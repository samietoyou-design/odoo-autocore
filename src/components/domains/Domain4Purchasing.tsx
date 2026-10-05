import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CheckCircle2, 
  Star
} from 'lucide-react';
import { PurchaseOrder, Supplier } from '../../types/odoo';

interface Domain4PurchasingProps {
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  onApprovePO: (poId: string) => void;
  onReceivePO: (poId: string) => void;
}

export const Domain4Purchasing: React.FC<Domain4PurchasingProps> = ({
  purchaseOrders,
  suppliers,
  onApprovePO,
  onReceivePO,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'suppliers'>('orders');

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 bg-white text-neutral-900">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-neutral-900 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 mb-1">
            <ShoppingBag className="w-4 h-4 text-neutral-900" />
            <span>دامنه ۴: خرید و مدیریت تأمین‌کنندگان (Procurement & Suppliers)</span>
          </div>
          <h1 className="text-xl font-black text-neutral-900 tracking-tight">
            سفارشات خرید (PO)، رسید انبار سه‌طرفه و کارنامه کیفی تأمین‌کنندگان
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            کنترل شرایط اعتباری، قیمت قراردادی، تطبیق سه‌طرفه (3-Way Matching) و تجمیع تقاضای شبکه
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-300 text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeTab === 'orders' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-700 hover:text-black'
            }`}
          >
            سفارشات خرید ({purchaseOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeTab === 'suppliers' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-700 hover:text-black'
            }`}
          >
            وندورلیست تأمین‌کنندگان ({suppliers.length})
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="bg-white border-2 border-neutral-900 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                      {po.poNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      po.status === 'received' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900 border border-neutral-300'
                    }`}>
                      {po.status === 'received' ? 'رسید انبار شد (GRN Done)' : 'سفارش تأیید شده'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono font-bold">{po.createdAt}</span>
                </div>

                <div>
                  <div className="text-xs text-neutral-500 font-bold">تأمین‌کننده طرف قرارداد:</div>
                  <div className="text-sm font-black text-neutral-900">{po.supplierName}</div>
                </div>

                {/* Items in PO */}
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1.5 text-xs">
                  {po.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-neutral-800">
                      <span className="font-medium">{item.partName}</span>
                      <span className="font-mono tabular-nums text-neutral-900 font-bold">
                        {item.qty} عدد × {item.unitPrice.toLocaleString()} ریال
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-neutral-300 flex items-center justify-between font-bold">
                    <span className="text-neutral-700">مجموع سند خرید:</span>
                    <span className="text-neutral-900 font-mono tabular-nums font-black">{po.totalAmount.toLocaleString()} ریال</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-xs">
                  <div className="text-neutral-500 text-[11px] font-medium">
                    موعد تحویل: {po.expectedDate}
                  </div>
                  {po.status === 'approved' && (
                    <button
                      onClick={() => onReceivePO(po.id)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ثبت رسید فیزیکی انبار (GRN)</span>
                    </button>
                  )}
                  {po.status === 'received' && (
                    <span className="text-neutral-900 font-mono font-bold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
                      <span>تطبیق ۳ طرفه کامل شد</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Suppliers List & Scorecards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="bg-white border-2 border-neutral-900 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-900">{sup.name}</span>
                <div className="flex items-center gap-1 text-neutral-900 text-xs font-bold font-mono bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                  <Star className="w-3 h-3 fill-neutral-900" />
                  <span>{sup.rating}</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-600">
                گروه کالا: <span className="text-neutral-900 font-bold">{sup.category}</span>
              </div>
              <div className="text-[11px] text-neutral-600">
                مسئول فروش: <span className="text-neutral-900 font-bold">{sup.contactPerson} ({sup.phone})</span>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-1 text-xs">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>سقف اعتبار ریالی:</span>
                  <span className="font-mono text-neutral-900 font-bold">{sup.creditLimit.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span>مانده بدهی جاری:</span>
                  <span className="font-mono text-neutral-900 font-bold">{sup.currentBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600">
                  <span>مهلت پرداخت:</span>
                  <span className="font-mono text-neutral-900 font-bold">{sup.creditTermDays} روزه</span>
                </div>
                <div className="flex items-center justify-between text-neutral-600 pt-1 border-t border-neutral-200">
                  <span>تحویل به موقع:</span>
                  <span className="font-mono text-neutral-900 font-black">{sup.deliveryOnTimeRate}٪</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
