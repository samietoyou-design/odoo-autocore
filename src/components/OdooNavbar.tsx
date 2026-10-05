import React, { useState } from 'react';
import { 
  Grid3X3, 
  Search, 
  Bell, 
  Building2, 
  Languages, 
  Plus, 
  FileCode2,
  Workflow,
  Layers
} from 'lucide-react';
import { DomainId } from '../types/odoo';

interface OdooNavbarProps {
  currentView: string;
  activeDomain: DomainId;
  onNavigate: (view: string, domain?: DomainId) => void;
  onOpenAppSwitcher: () => void;
  lang: 'fa' | 'en';
  onToggleLang: () => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  activeAlertsCount: number;
}

export const OdooNavbar: React.FC<OdooNavbarProps> = ({
  currentView,
  activeDomain,
  onNavigate,
  onOpenAppSwitcher,
  lang,
  onToggleLang,
  selectedBranch,
  onSelectBranch,
  activeAlertsCount,
}) => {
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  const getDomainTitle = () => {
    switch (activeDomain) {
      case 'orders': return lang === 'fa' ? 'مدیریت سفارش و خدمات' : 'Order & Services';
      case 'workshop': return lang === 'fa' ? 'عملیات سالن و تعمیرگاه' : 'Workshop & Bays';
      case 'inventory': return lang === 'fa' ? 'انبار و قطعات یدکی' : 'Inventory & Parts';
      case 'purchasing': return lang === 'fa' ? 'خرید و تأمین‌کنندگان' : 'Purchasing & Suppliers';
      case 'finance': return lang === 'fa' ? 'مالی، حسابداری و تسویه' : 'Finance & Accounting';
      case 'franchise': return lang === 'fa' ? 'مدیریت شرکا و فرانچایز' : 'Franchise Network';
      case 'garage': return lang === 'fa' ? 'مشتری، گاراژ و سلامت خودرو' : 'Customer & Vehicle Garage';
      case 'bi': return lang === 'fa' ? 'هوش تجاری و داشبورد کلان' : 'Executive BI';
      default: return 'Odoo AutoCore ERP';
    }
  };

  const branches = [
    'شعبه مرکزی غرب (ستارخان)',
    'فرانچایز شرق تهران (تهران‌پارس)',
    'واحد سیار امداد سریع ۱ (تجریش)'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-900 text-neutral-900">
      <div className="flex items-center justify-between px-3 lg:px-6 h-14">
        {/* Left Zone: App Switcher & App Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAppSwitcher}
            className="p-1.5 rounded-lg border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-neutral-900"
            title="منوی برنامه‌های اودو (App Launcher)"
          >
            <Grid3X3 className="w-4 h-4 text-neutral-900" />
            <span className="hidden sm:inline text-xs font-bold text-neutral-900">برنامه‌ها</span>
          </button>

          <div className="h-5 w-px bg-neutral-300 hidden sm:block" />

          {/* Current App Name */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-neutral-900 tracking-tight flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-900" />
              {currentView === 'catalog' 
                ? (lang === 'fa' ? 'کاتالوگ ۹۸ ماژول اودو' : '98 Modules Catalog')
                : currentView === 'flowchart'
                ? (lang === 'fa' ? 'فلوچارت معماری و یکپارچگی' : 'Integration Architecture Flowchart')
                : currentView === 'code'
                ? (lang === 'fa' ? 'سورس‌کد و مانیفست Odoo 19' : 'Odoo 19 Backend Code')
                : getDomainTitle()
              }
            </span>
          </div>

          {/* Quick Sub-navigation tabs */}
          <div className="hidden xl:flex items-center gap-1 mr-4">
            <button
              onClick={() => onNavigate('domain', activeDomain)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                currentView === 'domain' 
                  ? 'bg-neutral-900 text-white font-bold' 
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              عملیات جاری
            </button>
            <button
              onClick={() => onNavigate('catalog')}
              className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                currentView === 'catalog' 
                  ? 'bg-neutral-900 text-white font-bold' 
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ماتریس ۹۸ ماژول</span>
            </button>
            <button
              onClick={() => onNavigate('flowchart')}
              className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                currentView === 'flowchart' 
                  ? 'bg-neutral-900 text-white font-bold' 
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>فلوچارت فرآیندها</span>
            </button>
            <button
              onClick={() => onNavigate('code')}
              className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center gap-1 ${
                currentView === 'code' 
                  ? 'bg-neutral-900 text-white font-bold' 
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>پکیج کد Odoo 19</span>
            </button>
          </div>
        </div>

        {/* Center Zone: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-500 absolute right-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder={lang === 'fa' ? 'جستجوی سفارش، پلاک، قطعه یا ماژول (Ctrl+K)...' : 'Search orders, plates, parts (Ctrl+K)...'}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pr-9 pl-12 py-1.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 transition-colors"
            />
            <kbd className="absolute left-2.5 top-2 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600 bg-white rounded border border-neutral-300">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Right Zone: Branch, Quick Create, Bell, Language, Profile */}
        <div className="flex items-center gap-2">
          {/* Multi-Branch Selector */}
          <div className="relative">
            <button
              onClick={() => setShowBranchMenu(!showBranchMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-neutral-900 text-xs font-medium text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-neutral-900" />
              <span className="hidden md:inline max-w-[150px] truncate">{selectedBranch}</span>
            </button>

            {showBranchMenu && (
              <div className="absolute left-0 mt-1 w-64 bg-white border border-neutral-900 rounded-lg shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-500 border-b border-neutral-200">
                  انتخاب شعبه / تعمیرگاه (Multi-Branch)
                </div>
                {branches.map(b => (
                  <button
                    key={b}
                    onClick={() => {
                      onSelectBranch(b);
                      setShowBranchMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2 hover:bg-neutral-100 transition-colors ${
                      selectedBranch === b ? 'text-neutral-900 font-bold bg-neutral-100' : 'text-neutral-700'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Create Button */}
          <div className="relative">
            <button
              onClick={() => setShowQuickCreate(!showQuickCreate)}
              className="p-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg transition-colors flex items-center gap-1 text-xs px-2.5 font-bold"
              title="ایجاد سریع سند جدید"
            >
              <Plus className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">جدید</span>
            </button>

            {showQuickCreate && (
              <div className="absolute left-0 mt-1 w-52 bg-white border border-neutral-900 rounded-lg shadow-xl py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    onNavigate('domain', 'orders');
                    setShowQuickCreate(false);
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-neutral-100 text-neutral-900 font-medium"
                >
                  + ثبت سفارش کار جدید (Work Order)
                </button>
                <button
                  onClick={() => {
                    onNavigate('domain', 'inventory');
                    setShowQuickCreate(false);
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-neutral-100 text-neutral-900 font-medium"
                >
                  + تعریف قطعه جدید (Item Master)
                </button>
                <button
                  onClick={() => {
                    onNavigate('domain', 'purchasing');
                    setShowQuickCreate(false);
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-neutral-100 text-neutral-900 font-medium"
                >
                  + سفارش خرید کالا (PO)
                </button>
                <button
                  onClick={() => {
                    onNavigate('domain', 'garage');
                    setShowQuickCreate(false);
                  }}
                  className="w-full text-right px-3 py-2 hover:bg-neutral-100 text-neutral-900 font-medium"
                >
                  + ثبت خودرو در گاراژ (Vehicle Master)
                </button>
              </div>
            )}
          </div>

          {/* Alerts Bell */}
          <button
            onClick={() => onNavigate('domain', 'bi')}
            className="relative p-2 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-700 hover:text-black transition-colors"
            title="هشدارهای فعال SLA و عملیات"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 text-xs font-bold text-neutral-800 hover:text-black transition-colors"
            title="تغییر زبان (فارسی / English)"
          >
            <Languages className="w-3.5 h-3.5 text-neutral-600" />
            <span className="font-mono uppercase">{lang}</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 border-r border-neutral-300 pr-2">
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              اد
            </div>
            <div className="hidden lg:block text-right leading-tight">
              <div className="text-xs font-bold text-neutral-900">مدیر سیستم اودو</div>
              <div className="text-[10px] text-neutral-500 font-mono">Full-Stack Admin</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
