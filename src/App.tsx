import React, { useState } from 'react';
import { DomainId, ServiceOrder, Bay } from './types/odoo';
import { 
  INITIAL_ORDERS, 
  INITIAL_BAYS, 
  INITIAL_TECHNICIANS, 
  INITIAL_SPARE_PARTS, 
  INITIAL_SUPPLIERS, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_INVOICES, 
  INITIAL_BRANCHES, 
  INITIAL_VEHICLES, 
  INITIAL_CUSTOMERS, 
  INITIAL_BI_METRICS 
} from './data/initialData';

import { OdooNavbar } from './components/OdooNavbar';
import { AppSwitcherModal } from './components/AppSwitcherModal';
import { ModuleCatalogViewer } from './components/ModuleCatalogViewer';
import { InteractiveFlowchart } from './components/InteractiveFlowchart';
import { OdooCodeGenerator } from './components/OdooCodeGenerator';

import { Domain1Orders } from './components/domains/Domain1Orders';
import { Domain2Workshop } from './components/domains/Domain2Workshop';
import { Domain3Inventory } from './components/domains/Domain3Inventory';
import { Domain4Purchasing } from './components/domains/Domain4Purchasing';
import { Domain5Finance } from './components/domains/Domain5Finance';
import { Domain6Franchise } from './components/domains/Domain6Franchise';
import { Domain7Garage } from './components/domains/Domain7Garage';
import { Domain8BI } from './components/domains/Domain8BI';

export default function App() {
  const [currentView, setCurrentView] = useState<'domain' | 'catalog' | 'flowchart' | 'code'>('domain');
  const [activeDomain, setActiveDomain] = useState<DomainId>('orders');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [selectedBranch, setSelectedBranch] = useState('شعبه مرکزی غرب (ستارخان)');
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);

  // Core Data Stores
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [bays, setBays] = useState<Bay[]>(INITIAL_BAYS);
  const [technicians, setTechnicians] = useState(INITIAL_TECHNICIANS);
  const [parts, setParts] = useState(INITIAL_SPARE_PARTS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [biMetrics, setBiMetrics] = useState(INITIAL_BI_METRICS);

  // Handlers
  const handleUpdateOrder = (updatedOrder: ServiceOrder) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    
    // If order was moved to done or invoiced, update BI & Invoices
    if (updatedOrder.state === 'done') {
      setBiMetrics(prev => ({
        ...prev,
        ordersCompletedToday: prev.ordersCompletedToday + 1,
        gmv: prev.gmv + updatedOrder.totalAmount,
      }));
    }
  };

  const handleCreateOrder = (newOrder: Partial<ServiceOrder>) => {
    setOrders(prev => [newOrder as ServiceOrder, ...prev]);
  };

  const handleUpdateBayStatus = (bayId: string, status: Bay['status']) => {
    setBays(prev => prev.map(b => b.id === bayId ? { ...b, status } : b));
  };

  const handleUpdatePartQty = (partId: string, delta: number) => {
    setParts(prev => prev.map(p => {
      if (p.id === partId) {
        const newOnHand = Math.max(0, p.qtyOnHand + delta);
        return {
          ...p,
          qtyOnHand: newOnHand,
          qtyAvailable: Math.max(0, newOnHand - p.qtyReserved)
        };
      }
      return p;
    }));
  };

  const handleApprovePO = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => po.id === poId ? { ...po, status: 'approved' } : po));
  };

  const handleReceivePO = (poId: string) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === poId) {
        // Also increase stock for items in PO
        po.items.forEach(it => {
          handleUpdatePartQty(it.partId, it.qty);
        });
        return { ...po, status: 'received' };
      }
      return po;
    }));
  };

  const handlePayInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'paid' } : inv));
  };

  const handleNavigate = (view: string, domain?: DomainId) => {
    if (domain) {
      setActiveDomain(domain);
      setCurrentView('domain');
    } else {
      setCurrentView(view as any);
    }
  };

  const activeAlertsCount = 2;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${lang === 'fa' ? 'font-sans' : ''}`} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      {/* Top Navbar */}
      <OdooNavbar
        currentView={currentView}
        activeDomain={activeDomain}
        onNavigate={handleNavigate}
        onOpenAppSwitcher={() => setIsAppSwitcherOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'fa' ? 'en' : 'fa')}
        selectedBranch={selectedBranch}
        onSelectBranch={setSelectedBranch}
        activeAlertsCount={activeAlertsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'catalog' && (
          <ModuleCatalogViewer />
        )}

        {currentView === 'flowchart' && (
          <InteractiveFlowchart />
        )}

        {currentView === 'code' && (
          <OdooCodeGenerator />
        )}

        {currentView === 'domain' && (
          <>
            {activeDomain === 'orders' && (
              <Domain1Orders
                orders={orders}
                onUpdateOrder={handleUpdateOrder}
                onCreateOrder={handleCreateOrder}
              />
            )}

            {activeDomain === 'workshop' && (
              <Domain2Workshop
                bays={bays}
                technicians={technicians}
                branches={branches}
                onUpdateBayStatus={handleUpdateBayStatus}
              />
            )}

            {activeDomain === 'inventory' && (
              <Domain3Inventory
                parts={parts}
                onUpdatePartQty={handleUpdatePartQty}
              />
            )}

            {activeDomain === 'purchasing' && (
              <Domain4Purchasing
                purchaseOrders={purchaseOrders}
                suppliers={suppliers}
                onApprovePO={handleApprovePO}
                onReceivePO={handleReceivePO}
              />
            )}

            {activeDomain === 'finance' && (
              <Domain5Finance
                invoices={invoices}
                onPayInvoice={handlePayInvoice}
              />
            )}

            {activeDomain === 'franchise' && (
              <Domain6Franchise
                branches={branches}
              />
            )}

            {activeDomain === 'garage' && (
              <Domain7Garage
                vehicles={vehicles}
                customers={customers}
              />
            )}

            {activeDomain === 'bi' && (
              <Domain8BI
                metrics={biMetrics}
              />
            )}
          </>
        )}
      </main>

      {/* App Switcher Modal */}
      <AppSwitcherModal
        isOpen={isAppSwitcherOpen}
        onClose={() => setIsAppSwitcherOpen(false)}
        onSelectDomain={(dom) => {
          setActiveDomain(dom);
          setCurrentView('domain');
        }}
        onSelectSpecialView={(v) => {
          setCurrentView(v);
        }}
      />
    </div>
  );
}
