import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Terminal
} from 'lucide-react';
import { ODOO_CODE_FILES } from '../data/odooCodeTemplates';

export const OdooCodeGenerator: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentFile = ODOO_CODE_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([currentFile.code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = currentFile.filename.replace('/', '_');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 bg-white text-neutral-900">
      {/* Title Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-neutral-900 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 mb-1">
              <FileCode2 className="w-4 h-4 text-neutral-900" />
              <span>موتور توسعه و کدهای منبع Odoo 19 Backend Developer</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-neutral-900 tracking-tight">
              پکیج کدهای آماده نصب ماژول اختصاصی اودو ۱۹ (Ready-to-Install Addon)
            </h1>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl leading-relaxed">
              سورس‌کدهای استاندارد پایتون (Python Models)، ویوهای XML، فایل امنیت ir.model.access.csv و مانیفست رسمی.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 text-xs font-bold flex items-center gap-1.5 transition-colors border border-neutral-900"
            >
              {copied ? <Check className="w-4 h-4 text-neutral-900" /> : <Copy className="w-4 h-4 text-neutral-700" />}
              <span>{copied ? 'کپی شد!' : 'کپی این فایل'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل</span>
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {ODOO_CODE_FILES.map((f, idx) => (
            <button
              key={f.filename}
              onClick={() => setSelectedFileIndex(idx)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-mono transition-colors flex items-center gap-2 ${
                selectedFileIndex === idx
                  ? 'bg-neutral-900 text-white shadow-sm font-bold'
                  : 'bg-neutral-100 text-neutral-700 border border-neutral-300 hover:border-neutral-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                selectedFileIndex === idx ? 'bg-white' : 'bg-neutral-900'
              }`} />
              <span>{f.filename}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer Box */}
      <div className="bg-neutral-950 border-2 border-neutral-900 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white">{currentFile.filename}</span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-300">{currentFile.description}</span>
          </div>

          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px] uppercase font-bold">
            {currentFile.language}
          </span>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-x-auto max-h-[600px] text-xs font-mono leading-relaxed" dir="ltr">
          <pre className="text-neutral-200">
            <code>{currentFile.code}</code>
          </pre>
        </div>
      </div>

      {/* Installation Guide & Developer Instructions */}
      <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-black text-neutral-900">
          <Terminal className="w-4 h-4 text-neutral-900" />
          <span>راهنمای استقرار و نصب ماژول در سرور اودو ۱۹ (Deployment Instructions)</span>
        </div>

        <div className="space-y-3 text-xs text-neutral-800 leading-relaxed font-medium">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
            <div className="font-bold text-neutral-900">۱. کپی فایل‌ها در مسیر addons:</div>
            <p className="font-mono text-neutral-700 text-[11px]" dir="ltr">
              cd /opt/odoo/custom-addons/<br />
              mkdir -p odoo_autocore/models odoo_autocore/views odoo_autocore/security odoo_autocore/controllers
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
            <div className="font-bold text-neutral-900">۲. به‌روزرسانی لیست برنامه‌ها و نصب از طریق خط فرمان:</div>
            <p className="font-mono text-neutral-700 text-[11px]" dir="ltr">
              ./odoo-bin -c /etc/odoo.conf -u odoo_autocore -d auto_erp_db --stop-after-init
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
            <div className="font-bold text-neutral-900">۳. فعال‌سازی حالت توسعه‌دهنده اودو (Developer Mode):</div>
            <p className="text-neutral-700">
              در رابط کاربری وب اودو وارد تنظیمات شده و با کلیک روی <span className="font-mono text-neutral-900 font-bold">Activate Developer Mode</span>، ماژول <span className="font-bold text-black">Odoo AutoCore ERP</span> را در فهرست Apps جستجو و نصب فرمایید.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
