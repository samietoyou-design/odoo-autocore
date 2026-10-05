import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Car, 
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { BIMetrics } from '../../types/odoo';

interface Domain8BIProps {
  metrics: BIMetrics;
}

export const Domain8BI: React.FC<Domain8BIProps> = ({ metrics }) => {
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: 'alt-1',
      severity: 'warning',
      title: 'افزایش زمان توقف در لاین ۳ (تنظیم فرمان)',
      desc: 'میانگین توقف سفارشات در لاین ۳ از ۴۵ دقیقه به ۶۲ دقیقه افزایش یافته است.',
      timestamp: '۱۰ دقیقه پیش'
    },
    {
      id: 'alt-2',
      severity: 'info',
      title: 'نزدیک شدن فیلتر هوای TU5 به نقطه سفارش مجدد (Reorder Point)',
      desc: 'موجودی آزاد به ۱۲ عدد رسیده است؛ پیش‌نویس استعلام خرید RFQ ایجاد شد.',
      timestamp: '۲۵ دقیقه پیش'
    }
  ]);

  const handleDismissAlert = (id: string) => {
    setActiveAlerts(activeAlerts.filter(a => a.id !== id));
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>دامنه ۸: هوش تجاری و داشبورد اجرایی هلدینگ (Executive BI & Analytics)</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            داشبورد ۳۶۰ درجه مدیران ارشد، شاخص‌های GMV و پایش تعهدات SLA
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            تجمیع شاخص‌های ۱۴ ماژول تحلیلی: فروش، عملیات، کیفیت (FTFR)، بهره‌وری لاین‌ها و کنترل استثنائات
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-indigo-950 border border-indigo-800 text-xs font-mono text-indigo-300">
          داده‌های زنده (Live Stream Sync)
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ارزش ناخالص مبادلات (GMV)</span>
            <span className="text-emerald-400 flex items-center font-mono text-[11px] font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +۱۸.۴٪
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-white tabular-nums">
            {(metrics.gmv / 10000000).toLocaleString()} <span className="text-xs font-sans text-slate-400">میلیون تومان</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            فروش کل خدمات، اجرت و قطعات شبکه
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>نرخ رعایت تعهدات زمانی (SLA)</span>
            <span className="text-emerald-400 flex items-center font-mono text-[11px] font-bold">
              تارگت ۹۵٪
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {metrics.slaComplianceRate}٪
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            تحویل به موقع خودرو بدون معطلی مشتری
          </div>
        </div>

        {/* FTFR Quality */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>تعمیر موفق در بار اول (FTFR)</span>
            <span className="text-sky-400 flex items-center font-mono text-[11px] font-bold">
              عالی
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-sky-400 tabular-nums">
            {metrics.ftfr}٪
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            تنها ۱.۸٪ دوباره‌کاری و بازگشت خودرو
          </div>
        </div>

        {/* Cycle Time */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>میانگین اقامت خودرو (Cycle Time)</span>
            <span className="text-emerald-400 flex items-center font-mono text-[11px] font-bold">
              -۱۲ دقیقه
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 tabular-nums">
            {metrics.cycleTimeHours} <span className="text-xs font-sans text-slate-400">ساعت</span>
          </div>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
            از لحظه پذیرش تا آزمون کیفیت و ترخیص
          </div>
        </div>
      </div>

      {/* Real-time Alerts Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">مرکز هشدارهای هوشمند و کنترل ناهنجاری‌ها (Alerts & Exceptions)</h2>
          </div>
          <span className="text-xs text-slate-400">
            {activeAlerts.length} مورد هشدار فعال
          </span>
        </div>

        {activeAlerts.length > 0 ? (
          <div className="space-y-3">
            {activeAlerts.map((alt) => (
              <div
                key={alt.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alt.severity === 'warning' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {alt.severity === 'warning' ? 'هشدار عملیاتی' : 'اطلاعیه انبار'}
                    </span>
                    <span className="font-bold text-slate-100">{alt.title}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pr-1">{alt.desc}</p>
                  <div className="text-[10px] text-slate-500 font-mono pr-1">{alt.timestamp}</div>
                </div>

                <button
                  onClick={() => handleDismissAlert(alt.id)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors shrink-0"
                >
                  رسیدگی شد
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-emerald-400 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>هیچ هشدار بحرانی فعالی در شبکه وجود ندارد. تمام پارامترها در وضعیت سبز قرار دارند.</span>
          </div>
        )}
      </div>
    </div>
  );
};
