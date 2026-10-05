import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  Search, 
  Plus, 
  QrCode, 
  FileText, 
  AlertTriangle, 
  Activity, 
  Calendar, 
  CheckCircle2,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { Vehicle, Customer } from '../../types/odoo';

interface Domain7GarageProps {
  vehicles: Vehicle[];
  customers: Customer[];
}

export const Domain7Garage: React.FC<Domain7GarageProps> = ({
  vehicles,
  customers,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(vehicles[0]);
  const [showResaleModal, setShowResaleModal] = useState(false);

  const getOwnerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'مشتری پلتفرم';
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500';
    if (score >= 75) return 'text-sky-400 border-sky-500';
    if (score >= 60) return 'text-amber-400 border-amber-500';
    return 'text-rose-400 border-rose-500';
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
            <Car className="w-4 h-4" />
            <span>دامنه ۷: مشتری، گاراژ و سلامت خودرو (Customer & Vehicle Garage)</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            پاسپورت دیجیتال سلامت خودرو و گواهی انتقال به خریدار (Resale Report)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            محاسبه شاخص Health Score، تاریخچه مراجعات، پایش سرویس کیلومتری و استعلام ضدتقلب معامله
          </p>
        </div>

        <button
          onClick={() => setShowResaleModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <QrCode className="w-4 h-4" />
          <span>صدور کارنامه سلامت و QR خرید/فروش</span>
        </button>
      </div>

      {/* Vehicles Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {vehicles.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelectedVehicle(v)}
            className={`cursor-pointer p-4.5 rounded-2xl border transition-all text-xs space-y-2 ${
              selectedVehicle.id === v.id
                ? 'bg-slate-800 border-blue-500 ring-1 ring-blue-500/20 shadow-md'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{v.model}</span>
              <span className="font-mono text-purple-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {v.plate}
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              مالک: <span className="text-slate-200">{getOwnerName(v.customerId)}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="font-mono text-slate-400 tabular-nums">{v.currentOdometer.toLocaleString()} km</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">امتیاز سلامت:</span>
                <span className={`font-mono font-bold text-xs ${getHealthColor(v.healthScore)}`}>
                  {v.healthScore} / ۱۰۰
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Digital Health Passport View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center bg-slate-950 ${getHealthColor(selectedVehicle.healthScore)}`}>
              <span className="text-xl font-bold font-mono">{selectedVehicle.healthScore}</span>
              <span className="text-[9px] font-sans">امتیاز سلامت</span>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-mono">VIN: {selectedVehicle.vin}</div>
              <h2 className="text-lg font-bold text-white mt-0.5">{selectedVehicle.brand} - {selectedVehicle.model} ({selectedVehicle.year})</h2>
              <div className="text-xs text-slate-400">تیپ: {selectedVehicle.trim} · موتور: {selectedVehicle.engineCode}</div>
            </div>
          </div>

          <div className="text-left bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="text-slate-400">سرویس دوره‌ای بعدی:</div>
            <div className="font-bold text-emerald-400 font-mono text-sm tabular-nums mt-0.5">
              {selectedVehicle.nextServiceOdometer.toLocaleString()} کیلومتر
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">سررسید زمانی: {selectedVehicle.nextServiceDueDate}</div>
          </div>
        </div>

        {/* Diagnostic Systems Status */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-200">وضعیت سیستم‌های فنی و تست‌های دوره‌ای</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">موتور و توربوشارژر</div>
              <div className="text-emerald-400 font-bold font-mono mt-1">عالی (۹۴٪)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">سیستم ترمز و ABS</div>
              <div className="text-amber-400 font-bold font-mono mt-1">نیاز به تعویض لنت (۶۵٪)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">گیربکس و انتقال قدرت</div>
              <div className="text-emerald-400 font-bold font-mono mt-1">نرمال و روان (۹۱٪)</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">سیستم برق، باتری و سنسورها</div>
              <div className="text-emerald-400 font-bold font-mono mt-1">بدون خطای دیاگ OBD</div>
            </div>
          </div>
        </div>

        {/* Expert Recommendations */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-200">توصیه‌های پیشگیرانه مهندسی (Preventive Recommendations)</h3>
          <div className="space-y-2">
            {selectedVehicle.pendingRecommendations.map((rec, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.urgency === 'now' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {rec.urgency === 'now' ? 'ضروری اکنون' : 'به زودی'}
                    </span>
                    <span className="font-bold text-slate-100">{rec.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{rec.reason}</div>
                </div>
                <div className="font-mono text-emerald-400 font-bold tabular-nums">
                  {rec.estimatedCost.toLocaleString()} ریال
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resale QR Report Modal */}
      {showResaleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                <span>گواهی دیجیتال سلامت و اصالت خودرو (Resale Certificate)</span>
              </h3>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
              <div className="w-32 h-32 bg-white p-2 mx-auto rounded-xl flex items-center justify-center">
                <div className="w-full h-full border-4 border-slate-900 grid grid-cols-4 gap-1 p-1">
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                </div>
              </div>

              <div>
                <div className="font-bold text-white text-sm">{selectedVehicle.model} ({selectedVehicle.year})</div>
                <div className="font-mono text-purple-300 text-xs mt-0.5">پلاک: {selectedVehicle.plate}</div>
                <div className="font-mono text-slate-400 text-[11px]">VIN: {selectedVehicle.vin}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300">
                شاخص سلامت کل: {selectedVehicle.healthScore} از ۱۰۰ · کیلومتر مستند در شبکه: {selectedVehicle.currentOdometer.toLocaleString()} km
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed text-center">
              خریدار با اسکن این کد با دوربین تلفن همراه می‌تواند کل سوابق رسمی، قطعات تعویض‌شده و عدم تقلب در کیلومتر را در پورتال معتبر شبکه مشاهده نماید.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResaleModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl"
              >
                بستن
              </button>
              <button
                onClick={() => {
                  alert('فایل گزارش رسمی PDF با مهر دیجیتال ایجاد شد.');
                  setShowResaleModal(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>دانلود گواهی رسمی PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
