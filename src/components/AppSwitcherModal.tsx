import React from 'react';
import { 
  ClipboardList, 
  Wrench, 
  Boxes, 
  ShoppingBag, 
  BadgePercent, 
  ShieldCheck, 
  Car, 
  BarChart3, 
  Layers, 
  Workflow, 
  FileCode2, 
  X,
  Sparkles
} from 'lucide-react';
import { DomainId } from '../types/odoo';
import { DOMAINS } from '../data/modulesCatalog';

interface AppSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDomain: (domain: DomainId) => void;
  onSelectSpecialView: (view: 'catalog' | 'flowchart' | 'code') => void;
}

export const AppSwitcherModal: React.FC<AppSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectDomain,
  onSelectSpecialView,
}) => {
  if (!isOpen) return null;

  const getDomainIcon = (id: DomainId) => {
    const iconClass = "w-7 h-7 text-neutral-900";
    switch (id) {
      case 'orders': return <ClipboardList className={iconClass} />;
      case 'workshop': return <Wrench className={iconClass} />;
      case 'inventory': return <Boxes className={iconClass} />;
      case 'purchasing': return <ShoppingBag className={iconClass} />;
      case 'finance': return <BadgePercent className={iconClass} />;
      case 'franchise': return <ShieldCheck className={iconClass} />;
      case 'garage': return <Car className={iconClass} />;
      case 'bi': return <BarChart3 className={iconClass} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white border border-neutral-900 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-black text-lg">
              Ω
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 tracking-tight">برنامه‌های اصلی سامانه خودرویی Odoo AutoCore</h2>
              <p className="text-xs text-neutral-500">۸ دامنه تخصصی کسب‌وکار + استودیو معماری ۹۸ ماژول اودو ۱۹</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors border border-neutral-200 hover:border-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8 Core Domains Grid */}
        <div className="mt-6">
          <div className="text-xs font-bold text-neutral-700 mb-3 px-1">ماژول‌های عملیاتی کسب‌وکار (Core Business Apps)</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {DOMAINS.map(domain => (
              <button
                key={domain.id}
                onClick={() => {
                  onSelectDomain(domain.id);
                  onClose();
                }}
                className="group flex flex-col items-center text-center p-4 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-neutral-900 transition-all shadow-sm"
              >
                <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-300 group-hover:border-neutral-900 mb-2.5 transition-colors">
                  {getDomainIcon(domain.id)}
                </div>
                <span className="text-xs font-bold text-neutral-900 transition-colors">
                  {domain.nameFa}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono mt-0.5">
                  {domain.moduleCount} ماژول تخصصی
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Odoo Developer & Architecture Tools */}
        <div className="mt-6 pt-5 border-t border-neutral-200">
          <div className="text-xs font-bold text-neutral-900 mb-3 px-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ابزارهای توسعه‌دهنده اودو (Odoo Full-Stack Developer Suite)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                onSelectSpecialView('catalog');
                onClose();
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-neutral-900 text-right transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-300">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">ماتریس ۹۸ ماژول</div>
                <div className="text-[10px] text-neutral-500">شناسنامه کامل ۱۰ مرحله‌ای هر ماژول</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectSpecialView('flowchart');
                onClose();
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-neutral-900 text-right transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-300">
                <Workflow className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">فلوچارت تعاملی یکپارچگی</div>
                <div className="text-[10px] text-neutral-500">گردش داده از مشتری تا BI</div>
              </div>
            </button>

            <button
              onClick={() => {
                onSelectSpecialView('code');
                onClose();
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 hover:border-neutral-900 text-right transition-colors"
            >
              <div className="p-2.5 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-300">
                <FileCode2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">کد سورس و پکیج Odoo 19</div>
                <div className="text-[10px] text-neutral-500">پایتون، ویوهای XML و مانیفست</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
