import React, { useState } from 'react';
import { 
  Search, 
  Layers, 
  ChevronLeft,
  X
} from 'lucide-react';
import { ALL_98_MODULES, DOMAINS } from '../data/modulesCatalog';
import { DomainId, ModuleSpec } from '../types/odoo';

export const ModuleCatalogViewer: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalModule, setActiveModalModule] = useState<ModuleSpec | null>(null);

  const filteredModules = ALL_98_MODULES.filter(mod => {
    const matchesDomain = selectedDomain === 'all' || mod.domainId === selectedDomain;
    const matchesSearch = 
      mod.nameFa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.odooModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const getDomainName = (id: DomainId) => {
    return DOMAINS.find(d => d.id === id)?.nameFa || id;
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 bg-white text-neutral-900">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-neutral-900 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 mb-1">
              <Layers className="w-4 h-4 text-neutral-900" />
              <span>ماتریس معماری ۹۸ ماژول تخصصی خدمات خودرویی اودو</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-neutral-900 tracking-tight">
              کاتالوگ و ساختار تحلیلی ۹۸ ماژول اودو ۱۹ (Odoo Module Architecture)
            </h1>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl leading-relaxed">
              الگوی ساختاریافته ماژولار اودو:
              <span className="font-mono text-neutral-900 font-bold mr-1">
                Master Data → Transaction → Workflow/Status → Rules → Integration → UI/API → Notification/SLA → Report/KPI → Security/Audit
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-neutral-100 border border-neutral-900 text-neutral-900 text-center">
              <div className="text-lg font-black font-mono tabular-nums">{ALL_98_MODULES.length}</div>
              <div className="text-[10px] text-neutral-600 font-bold">کل ماژول‌ها</div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-center">
              <div className="text-lg font-black font-mono tabular-nums">۸</div>
              <div className="text-[10px] text-neutral-300 font-bold">دامنه تخصصی</div>
            </div>
          </div>
        </div>

        {/* Search & Domain Filter Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute right-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در نام ماژول، مدل پایتون (e.g. auto.service.order)، کد یا شرح وظایف..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pr-10 pl-4 py-2 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full text-xs">
            <button
              onClick={() => setSelectedDomain('all')}
              className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors font-bold ${
                selectedDomain === 'all'
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-900'
              }`}
            >
              همه ({ALL_98_MODULES.length})
            </button>
            {DOMAINS.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                className={`px-3 py-2 rounded-xl whitespace-nowrap transition-colors font-bold ${
                  selectedDomain === d.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-900'
                }`}
              >
                {d.nameFa.split(' ')[0]} {d.nameFa.split(' ')[1] || ''} ({d.moduleCount})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => setActiveModalModule(mod)}
            className="group cursor-pointer bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-neutral-900 rounded-xl p-4.5 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-[11px] font-black text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300">
                  {mod.code}
                </span>
                <span className="text-[11px] text-neutral-500 font-bold">
                  {getDomainName(mod.domainId)}
                </span>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 group-hover:text-black transition-colors line-clamp-1">
                {mod.nameFa}
              </h3>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5 mb-2 line-clamp-1">
                {mod.odooModel}
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2 mb-3">
                {mod.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                <span>{mod.workflow.length > 0 ? 'دارای گردش کار' : 'پایه'}</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-900 font-bold">
                <span>مشاهده معماری</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Module Detail Modal: Full 10-Step Odoo Architecture */}
      {activeModalModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border-2 border-neutral-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 flex items-start justify-between bg-neutral-50">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-black text-white bg-neutral-900 px-2.5 py-0.5 rounded">
                    {activeModalModule.code}
                  </span>
                  <span className="text-xs text-neutral-600 font-mono font-bold">
                    Model: {activeModalModule.odooModel}
                  </span>
                </div>
                <h2 className="text-lg font-black text-neutral-900">
                  {activeModalModule.nameFa}
                </h2>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {activeModalModule.nameEn} · دامنه: {getDomainName(activeModalModule.domainId)}
                </div>
              </div>
              <button
                onClick={() => setActiveModalModule(null)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body: The 10 Odoo Structural Steps */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-900 divide-y divide-neutral-200">
              {/* Step 1: Definition & Objective */}
              <div className="space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۱. تعریف دامنه و هدف ماژول (Domain & Objective)</span>
                </div>
                <p className="text-neutral-700 leading-relaxed pr-2">
                  {activeModalModule.description}
                </p>
              </div>

              {/* Step 2: Master Data */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۲. موجودیت‌های پایه (Master Data)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 pr-2">
                  {activeModalModule.masterData.map((item, idx) => (
                    <li key={idx}><span className="font-mono text-neutral-900 font-semibold">{item}</span></li>
                  ))}
                </ul>
              </div>

              {/* Step 3: Transactions */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۳. اسناد و تراکنش‌ها (Transactions)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 pr-2">
                  {activeModalModule.transactions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Step 4: Workflow & States */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۴. وضعیت‌ها و گردش کار (Workflow / States)</span>
                </div>
                <div className="bg-neutral-100 p-3 rounded-lg border border-neutral-300 font-mono text-neutral-900 text-[11px] font-bold leading-relaxed">
                  {activeModalModule.workflow.join(' → ')}
                </div>
              </div>

              {/* Step 5: Business Rules & Validations */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۵. قواعد اعتبارسنجی و قوانین کسب‌وکار (Business Rules)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 pr-2">
                  {activeModalModule.businessRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              {/* Step 6: Security & Roles */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۶. نقش‌ها و سطوح دسترسی (Roles & Security)</span>
                </div>
                <div className="space-y-1 pr-2">
                  <div className="text-neutral-700">نقش‌های کاربری: {activeModalModule.roles.join('، ')}</div>
                  <div className="text-neutral-900 text-[11px] font-mono bg-neutral-100 p-2 rounded border border-neutral-300">
                    قانون امنیتی: {activeModalModule.securityRules}
                  </div>
                </div>
              </div>

              {/* Step 7: UI Views & API */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۷. واسط کاربری و نماهای اودو (UI Views & API)</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pr-2">
                  {activeModalModule.uiViews.map((view, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-neutral-900 font-mono text-[10px] font-bold">
                      &lt;{view}&gt; view
                    </span>
                  ))}
                </div>
              </div>

              {/* Step 8: Integration Points */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۸. یکپارچگی سیستمی (Integration Points)</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pr-2">
                  {activeModalModule.integrations.map((integ, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-300 text-neutral-900 font-mono text-[10px] font-bold">
                      {integ}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step 9: Notification & SLA */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۹. اعلان‌ها، هشدارها و پایش SLA (Alerts & SLA)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 pr-2">
                  {activeModalModule.slaNotifications.map((notif, idx) => (
                    <li key={idx}>{notif}</li>
                  ))}
                </ul>
              </div>

              {/* Step 10: KPIs & Reports */}
              <div className="pt-4 space-y-1.5">
                <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                  <span>۱۰. شاخص‌های کلیدی عملکرد و گزارشات (KPIs & Reports)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-neutral-800 pr-2">
                  {activeModalModule.kpis.map((kpi, idx) => (
                    <li key={idx} className="font-bold text-neutral-900">{kpi}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500 font-bold">
                منطبق با معماری ماژولار Odoo 19 Backend
              </span>
              <button
                onClick={() => setActiveModalModule(null)}
                className="px-4 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
