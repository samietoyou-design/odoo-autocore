import React, { useState } from 'react';
import { 
  BadgePercent, 
  CreditCard, 
  FileCheck2, 
  Wallet, 
  Receipt, 
  ArrowUpRight, 
  ArrowDownLeft,
  Percent,
  CheckCircle2,
  Building,
  DollarSign
} from 'lucide-react';
import { Invoice } from '../../types/odoo';

interface Domain5FinanceProps {
  invoices: Invoice[];
  onPayInvoice: (invoiceId: string) => void;
}

export const Domain5Finance: React.FC<Domain5FinanceProps> = ({
  invoices,
  onPayInvoice,
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'settlement' | 'journal'>('invoices');

  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalPlatformCommission = invoices.reduce((acc, inv) => acc + inv.platformCommissionAmount, 0);
  const totalPartnerShare = invoices.reduce((acc, inv) => acc + inv.partnerShareAmount, 0);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 mb-1">
            <BadgePercent className="w-4 h-4" />
            <span>دامنه ۵: مالی، حسابداری و تسویه شرکا (Finance & Settlement)</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            تفکیک اجرت/قطعه، تسویه شفاف شعب و درگاه‌های پرداخت ترکیبی
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            محاسبه خودکار کارمزد پلتفرم، سهم تعمیرگاه شریک، ذخیره گارانتی (Warranty Reserve) و ثبت آرتیکل دوبل
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'invoices' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            فاکتورهای فروش ({invoices.length})
          </button>
          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'settlement' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            فرمول تسویه حساب شرکا
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
              activeTab === 'journal' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            سند دوبل حسابداری Odoo
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">گردش کل فاکتورها (GMV)</div>
          <div className="text-lg font-bold font-mono text-white tabular-nums">{totalInvoiced.toLocaleString()} ریال</div>
          <div className="text-[10px] text-emerald-400">شامل قطعات اصلی و اجرت خدمات</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">سهم پرداختی به شعب و تعمیرگاه‌ها (۸۰٪)</div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">{totalPartnerShare.toLocaleString()} ریال</div>
          <div className="text-[10px] text-slate-400">تسویه دوره‌ای منظم پایا/ساتنا</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] text-slate-400">کارمزد پلتفرم مرکزی (۱۵٪)</div>
          <div className="text-lg font-bold font-mono text-violet-400 tabular-nums">{totalPlatformCommission.toLocaleString()} ریال</div>
          <div className="text-[10px] text-purple-300">درآمد خالص هلدینگ + ۵٪ ذخیره گارانتی</div>
        </div>
      </div>

      {activeTab === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-850 text-slate-300 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="p-3">شماره فاکتور</th>
                <th className="p-3">مشتری</th>
                <th className="p-3">دستور کار مرتبط</th>
                <th className="p-3 font-mono text-left">اجرت (ریال)</th>
                <th className="p-3 font-mono text-left">قطعات (ریال)</th>
                <th className="p-3 font-mono text-left">مالیات و عوارض</th>
                <th className="p-3 font-mono text-left">مبلغ کل فاکتور</th>
                <th className="p-3 text-center">روش تسویه</th>
                <th className="p-3 text-center">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono text-violet-300 font-bold">{inv.invoiceNumber}</td>
                  <td className="p-3 font-semibold text-slate-100">{inv.customerName}</td>
                  <td className="p-3 font-mono text-slate-400">{inv.orderNumber}</td>
                  <td className="p-3 font-mono text-left tabular-nums">{inv.laborTotal.toLocaleString()}</td>
                  <td className="p-3 font-mono text-left tabular-nums">{inv.partsTotal.toLocaleString()}</td>
                  <td className="p-3 font-mono text-left tabular-nums text-slate-400">{inv.tax.toLocaleString()}</td>
                  <td className="p-3 font-mono font-bold text-left text-emerald-400 tabular-nums">
                    {inv.total.toLocaleString()} ریال
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-200">
                      {inv.paymentMethod === 'pos_terminal' ? 'پوز بانکی' : 'درگاه اینترنتی'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      تسویه کامل شده
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settlement' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-white">منطق تسهیم و تسویه حساب با شرکای فرانچایز (Settlement Logic)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center justify-between">
                <span>۱. سهم تعمیرگاه / شریک</span>
                <span className="font-mono text-sm">۸۰٪ کل فاکتور</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                ۸۰ درصد کل مبالغ دریافتی از مشتری مستقیماً پس از کسر کارمزد به حساب شبای شریک منتقل می‌گردد.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-violet-400 flex items-center justify-between">
                <span>۲. کارمزد پلتفرم مرکزی</span>
                <span className="font-mono text-sm">۱۵٪ کارمزد</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                سهم نرم‌افزار، پشتیبانی مشتری، ارجاع ترافیک اپلیکیشن، برندینگ و گارانتی شبکه سراسری.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>۳. ذخیره گارانتی (Reserve)</span>
                <span className="font-mono text-sm">۵٪ امانی ۳۰ روزه</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                مبلغ امانی برای پوشش خسارت احتمالی دوباره‌کاری؛ پس از ۳۰ روز و عدم شکایت مشتری آزاد می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'journal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">آرتیکل سند حسابداری اتوماتیک اودو ۱۹ (Journal Entry: account.move)</h2>
              <p className="text-xs text-slate-400 font-mono">سند روزنامه صادره برای فاکتور INV-2024-0812</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              Balanced (تراز دوبل استاندارد)
            </span>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
            <table className="w-full text-right">
              <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-2.5">کد معین</th>
                  <th className="p-2.5">شرح حساب معین</th>
                  <th className="p-2.5 text-left">بدهکار (Debit)</th>
                  <th className="p-2.5 text-left">بستانکار (Credit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300 text-xs">
                <tr>
                  <td className="p-2.5 text-violet-405">10101</td>
                  <td className="p-2.5">حساب‌های دریافتنی تجاری - صندوق / پوز بانکی</td>
                  <td className="p-2.5 text-left text-emerald-400 font-bold tabular-nums">2,768,600</td>
                  <td className="p-2.5 text-left font-mono text-slate-500">-</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-violet-405">40101</td>
                  <td className="p-2.5">درآمد فروش قطعات یدکی خودرو</td>
                  <td className="p-2.5 text-left font-mono text-slate-500">-</td>
                  <td className="p-2.5 text-left tabular-nums text-slate-200">1,890,000</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-violet-405">40201</td>
                  <td className="p-2.5">درآمد ارائه خدمات و اجرت تعمیرات</td>
                  <td className="p-2.5 text-left font-mono text-slate-500">-</td>
                  <td className="p-2.5 text-left tabular-nums text-slate-200">650,000</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-violet-405">20301</td>
                  <td className="p-2.5">مالیات بر ارزش افزوده و عوارض پرداختنی</td>
                  <td className="p-2.5 text-left font-mono text-slate-500">-</td>
                  <td className="p-2.5 text-left tabular-nums text-slate-200">228,600</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
