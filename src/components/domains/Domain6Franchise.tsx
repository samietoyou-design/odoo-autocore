import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Search, 
  Plus, 
  Building2, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  TrendingUp,
  Star
} from 'lucide-react';
import { PartnerBranch } from '../../types/odoo';

interface Domain6FranchiseProps {
  branches: PartnerBranch[];
}

export const Domain6Franchise: React.FC<Domain6FranchiseProps> = ({
  branches,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<PartnerBranch | null>(branches[0] || null);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>دامنه ۶: مدیریت شریک و فرانچایز (Partner & Franchise Network)</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            شبکه شعب، امتیاز کیفی (FTFR)، ممیزی فنی و استانداردهای فرانچایز
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            پایش نمرات خرید مخفیانه (Mystery Shopping)، اقدامات اصلاحی (CAPA) و رتبه‌بندی استاندارد گلد و سیلور
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
              ۹۵.۸٪
            </div>
            <div className="text-[10px] text-slate-400">میانگین FTFR شبکه</div>
          </div>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {branches.map((b) => (
          <div
            key={b.id}
            onClick={() => setSelectedBranch(b)}
            className={`cursor-pointer bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all space-y-4 ${
              selectedBranch?.id === b.id
                ? 'border-rose-500 ring-1 ring-rose-500/20 bg-slate-850'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{b.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                {b.type === 'central' ? 'شعبه مرکزی' : b.type === 'franchise' ? 'فرانچایز' : 'واحد امداد سیار'}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>مالک / سرپرست: <span className="text-slate-100 font-medium">{b.ownerName}</span></div>
              <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate">{b.address}</span>
              </div>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center text-xs">
              <div>
                <div className="text-slate-400 text-[10px]">شاخص FTFR</div>
                <div className="font-bold text-emerald-400 font-mono tabular-nums">{b.ftfrRate}٪</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">رضایت مشتری</div>
                <div className="font-bold text-amber-400 font-mono tabular-nums flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{b.csatScore}</span>
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">نمره ممیزی</div>
                <div className="font-bold text-sky-400 font-mono tabular-nums">{b.mysteryShopScore} / ۱۰۰</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Branch Details */}
      {selectedBranch && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-400" />
              <span>شناسنامه تفصیلی و کارنامه کیفی: {selectedBranch.name}</span>
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              گواهی رتبه الف (Grade A Partner)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">تعداد جک‌ها و لاین‌ها:</div>
              <div className="text-base font-bold font-mono text-white mt-1">{selectedBranch.baysCount} لاین سرویس</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">تکنسین‌های دارای گواهی:</div>
              <div className="text-base font-bold font-mono text-white mt-1">{selectedBranch.activeTechniciansCount} نفر</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">درصد کارمزد پلتفرم:</div>
              <div className="text-base font-bold font-mono text-white mt-1">{selectedBranch.commissionRatePercent}٪</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px]">نرخ ادعای گارانتی (Rework):</div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-1">{selectedBranch.warrantyClaimRate}٪ (بسیار مطلوب)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
