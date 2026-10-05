import React, { useState } from 'react';
import { 
  Wrench, 
  Users, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { Bay, Technician, PartnerBranch } from '../../types/odoo';

interface Domain2WorkshopProps {
  bays: Bay[];
  technicians: Technician[];
  branches: PartnerBranch[];
  onUpdateBayStatus: (bayId: string, status: Bay['status']) => void;
}

export const Domain2Workshop: React.FC<Domain2WorkshopProps> = ({
  bays,
  technicians,
  branches,
  onUpdateBayStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'bays' | 'technicians' | 'supervisor'>('bays');

  const getStatusBadge = (status: Bay['status']) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-900 border border-neutral-300">لاین آزاد</span>;
      case 'occupied':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 text-white">مشغول کار</span>;
      case 'reserved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-800 border border-neutral-400">رزرو نوبت</span>;
      case 'maintenance':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-500 border border-neutral-300">سرویس جک</span>;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 bg-white text-neutral-900">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-neutral-900 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 mb-1">
            <Wrench className="w-4 h-4 text-neutral-900" />
            <span>دامنه ۲: عملیات شعبه و تعمیرگاه (Branch & Workshop Operations)</span>
          </div>
          <h1 className="text-xl font-black text-neutral-900 tracking-tight">
            کنسول سالن، لاین‌های تعمیراتی (Bays) و دیسپچ تکنسین‌ها
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            کنترل لحظه‌ای ظرفیت جک‌ها، استانداردهای زمان سرویس (Flat Rate)، چک‌لیست QC و مانیتورینگ سالن
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-300 text-xs">
          <button
            onClick={() => setActiveTab('bays')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeTab === 'bays' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-700 hover:text-black'
            }`}
          >
            لاین‌های تعمیرگاه ({bays.length})
          </button>
          <button
            onClick={() => setActiveTab('technicians')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeTab === 'technicians' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-700 hover:text-black'
            }`}
          >
            تکنسین‌ها و مهارت‌ها ({technicians.length})
          </button>
          <button
            onClick={() => setActiveTab('supervisor')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              activeTab === 'supervisor' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-700 hover:text-black'
            }`}
          >
            کنسول سرپرست سالن
          </button>
        </div>
      </div>

      {/* Tab 1: Bay Grid Planner */}
      {activeTab === 'bays' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span>لاین‌های تعمیرگاهی شعبه مرکزی غرب و واحدهای سیار:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-bold"><span className="w-2 h-2 rounded-full bg-neutral-400" /> آزاد ({bays.filter(b => b.status === 'available').length})</span>
              <span className="flex items-center gap-1.5 font-bold"><span className="w-2 h-2 rounded-full bg-neutral-900" /> مشغول ({bays.filter(b => b.status === 'occupied').length})</span>
              <span className="flex items-center gap-1.5 font-bold"><span className="w-2 h-2 rounded-full bg-neutral-300" /> رزرو ({bays.filter(b => b.status === 'reserved').length})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bays.map((bay) => (
              <div
                key={bay.id}
                className="bg-white border-2 border-neutral-900 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-black text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                      {bay.code}
                    </span>
                    {getStatusBadge(bay.status)}
                  </div>

                  <h3 className="text-sm font-black text-neutral-900 mb-2">{bay.name}</h3>

                  <div className="space-y-1.5 text-xs text-neutral-800 bg-neutral-50 p-3 rounded-xl border border-neutral-200 mb-4">
                    {bay.currentOrderNumber ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">دستور کار جاری:</span>
                          <span className="font-mono text-neutral-900 font-black">{bay.currentOrderNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-neutral-500">تکنسین مسئول:</span>
                          <span className="text-neutral-900 font-bold">{bay.currentTechnician || 'تعیین نشده'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-neutral-500 text-center py-1 font-medium">
                        لاین آماده پذیرش و ورود خودرو
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Bay Actions */}
                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-neutral-500 font-mono font-bold">
                    {bay.type === 'two_post_lift' ? 'جک ۲ ستون' : bay.type === 'quick_service' ? 'سرویس سریع' : bay.type === 'four_post_alignment' ? 'میزان فرمان' : 'سیار امدادی'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {bay.status === 'occupied' ? (
                      <button
                        onClick={() => onUpdateBayStatus(bay.id, 'available')}
                        className="px-2.5 py-1 bg-neutral-900 hover:bg-black text-white rounded-lg text-[11px] font-bold transition-colors"
                      >
                        آزادسازی لاین
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateBayStatus(bay.id, 'occupied')}
                        className="px-2.5 py-1 bg-white hover:bg-neutral-100 border border-neutral-900 text-neutral-900 rounded-lg text-[11px] font-bold transition-colors"
                      >
                        اشغال دستی لاین
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Technician Matrix */}
      {activeTab === 'technicians' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicians.map((tech) => (
            <div key={tech.id} className="bg-white border-2 border-neutral-900 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                    {tech.nameFa.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900">{tech.nameFa}</h3>
                    <div className="text-[11px] text-neutral-500 font-mono font-bold">{tech.code}</div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                  tech.status === 'busy' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900 border border-neutral-300'
                }`}>
                  {tech.status === 'busy' ? 'مشغول تعمیر' : 'آماده به کار'}
                </span>
              </div>

              {/* Skills tags */}
              <div className="space-y-1">
                <div className="text-[11px] text-neutral-500 font-bold">تخصص‌های فنی:</div>
                <div className="flex flex-wrap gap-1">
                  {tech.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-[10px] text-neutral-900 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Score indicators */}
              <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-center text-xs">
                <div>
                  <div className="text-neutral-500 text-[10px] font-bold">راندمان (Efficiency)</div>
                  <div className="font-bold text-neutral-900 font-mono tabular-nums">{tech.efficiencyScore}٪</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px] font-bold">شاخص FTFR</div>
                  <div className="font-bold text-neutral-900 font-mono tabular-nums">{tech.ftfrScore}٪</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px] font-bold">سفارشات ترخیص‌شده</div>
                  <div className="font-bold text-neutral-900 font-mono tabular-nums">{tech.completedOrdersCount}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Supervisor Console */}
      {activeTab === 'supervisor' && (
        <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-base font-black text-neutral-900">کنسول نظارت بلادرنگ سرپرست سالن (Supervisor Live Console)</h2>
              <p className="text-xs text-neutral-600">شناسایی فوری گلوگاه‌های سالن، سفارش‌های دارای تاخیر و موارد معطل QC</p>
            </div>
            <div className="px-3 py-1 bg-neutral-900 text-white text-xs rounded-lg font-bold">
              وضعیت کلی سالن: نرمال (SLA: 97.2%)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
              <div className="text-xs font-bold text-neutral-900 flex items-center justify-between">
                <span>خودروهای در حال بازرسی</span>
                <span className="font-mono text-sm font-black">۱ دستگاه</span>
              </div>
              <p className="text-[11px] text-neutral-600">
                پژو ۲۰۷ (لاین ۳) - در حال اسکن دیاگ و بررسی سیستم ABS.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
              <div className="text-xs font-bold text-neutral-900 flex items-center justify-between">
                <span>الحاقیه‌های معطل تأیید مشتری</span>
                <span className="font-mono text-sm font-black">۱ مورد</span>
              </div>
              <p className="text-[11px] text-neutral-600">
                هیوندای سانتافه (واحد سیار) - منتظر تایید تعویض بست باتری.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
              <div className="text-xs font-bold text-neutral-900 flex items-center justify-between">
                <span>در انتظار آزمون کنترل کیفی (QC)</span>
                <span className="font-mono text-sm font-black">۱ دستگاه</span>
              </div>
              <p className="text-[11px] text-neutral-600">
                دنا پلاس توربو (لاین ۱) - آماده تست نهایی و گشتاور چرخ‌ها.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
