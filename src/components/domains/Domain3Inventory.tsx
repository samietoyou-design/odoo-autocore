import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  QrCode, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { SparePart } from '../../types/odoo';

interface Domain3InventoryProps {
  parts: SparePart[];
  onUpdatePartQty: (partId: string, delta: number) => void;
}

export const Domain3Inventory: React.FC<Domain3InventoryProps> = ({
  parts,
  onUpdatePartQty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [scanningPart, setScanningPart] = useState<SparePart | null>(null);
  const [scanResult, setScanResult] = useState<boolean | null>(null);

  const filteredParts = parts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.nameFa.includes(searchTerm) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.includes(searchTerm) ||
      p.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVerifyQR = (part: SparePart) => {
    setScanningPart(part);
    setScanResult(null);
    setTimeout(() => {
      setScanResult(true);
    }, 700);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 bg-white text-neutral-900">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-neutral-900 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 mb-1">
            <Boxes className="w-4 h-4 text-neutral-900" />
            <span>دامنه ۳: انبار و قطعات یدکی (Inventory & Spare Parts)</span>
          </div>
          <h1 className="text-xl font-black text-neutral-900 tracking-tight">
            مدیریت کاتالوگ قطعات، ردیابی بچ/سریال و اصالت ضدتقلب QR
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            کنترل بلادرنگ موجودی آزاد، قطعات رزرو شده در دستورهای کار و نقاط سفارش مجدد (Reorder Points)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-900 text-center">
            <div className="text-sm font-black font-mono text-neutral-900 tabular-nums">
              {parts.reduce((acc, p) => acc + (p.qtyOnHand * p.costPrice), 0).toLocaleString()} ریال
            </div>
            <div className="text-[10px] text-neutral-500 font-bold">ارزش کل موجودی انبار</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-neutral-300 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی پارت نامبر، کد فنی OEM، برند یا بچ نامبر..."
            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pr-9 pl-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
          {['all', 'oil_fluid', 'filter', 'brake_chassis', 'battery', 'engine_part'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors font-bold ${
                selectedCategory === cat 
                  ? 'bg-neutral-900 text-white' 
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {cat === 'all' ? 'همه' : cat === 'oil_fluid' ? 'روغن و روانکار' : cat === 'filter' ? 'فیلترها' : cat === 'brake_chassis' ? 'ترمز و شاسی' : cat === 'battery' ? 'باتری' : 'موتوری'}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white border-2 border-neutral-900 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-right text-xs">
          <thead className="bg-neutral-100 text-neutral-900 border-b border-neutral-300 text-[11px] font-black">
            <tr>
              <th className="p-3">کد کالا / پارت نامبر</th>
              <th className="p-3">شرح کامل قطعه</th>
              <th className="p-3">برند / سازنده</th>
              <th className="p-3">شماره بچ / لات</th>
              <th className="p-3 text-center">موجودی فیزیکی</th>
              <th className="p-3 text-center">رزرو کارگاه</th>
              <th className="p-3 text-center">موجودی آزاد</th>
              <th className="p-3">قیمت فروش (ریال)</th>
              <th className="p-3 text-center">اصالت کالا</th>
              <th className="p-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 text-neutral-800">
            {filteredParts.map((part) => {
              const isLowStock = part.qtyAvailable <= part.reorderPoint;
              return (
                <tr key={part.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-3 font-mono text-neutral-900 font-black">{part.sku}</td>
                  <td className="p-3">
                    <div className="font-bold text-neutral-900">{part.nameFa}</div>
                    <div className="text-[10px] text-neutral-500 font-mono">{part.nameEn}</div>
                  </td>
                  <td className="p-3 font-semibold text-neutral-900">{part.brand}</td>
                  <td className="p-3 font-mono text-[11px] text-neutral-600">{part.batchNumber}</td>
                  <td className="p-3 text-center font-mono font-bold text-neutral-900 tabular-nums">
                    {part.qtyOnHand}
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-neutral-600 tabular-nums">
                    {part.qtyReserved}
                  </td>
                  <td className="p-3 text-center font-mono font-black tabular-nums">
                    <span className={isLowStock ? 'underline' : ''}>
                      {part.qtyAvailable}
                    </span>
                    {isLowStock && (
                      <span className="block text-[9px] font-bold text-neutral-900">سفارش مجدد!</span>
                    )}
                  </td>
                  <td className="p-3 font-mono font-black text-neutral-900 tabular-nums">
                    {part.salePrice.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleVerifyQR(part)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-300 hover:border-neutral-900 text-neutral-900 transition-colors text-[10px] font-bold"
                      title="استعلام اصالت QR"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-neutral-900" />
                      <span>{part.isAuthenticVerified ? 'تایید اصالت' : 'اسکن'}</span>
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onUpdatePartQty(part.id, 5)}
                        className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-900 text-[10px] font-mono font-bold"
                        title="ورود کالا (+۵)"
                      >
                        +۵
                      </button>
                      <button
                        onClick={() => onUpdatePartQty(part.id, -1)}
                        disabled={part.qtyAvailable <= 0}
                        className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 border border-neutral-300 text-neutral-900 text-[10px] font-mono font-bold"
                        title="مصرف (-۱)"
                      >
                        -۱
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* QR Code Verification Modal */}
      {scanningPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-black text-neutral-900 flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-neutral-900" />
              <span>استعلام سامانه جامع اصالت قطعات</span>
            </h3>

            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-300 flex flex-col items-center justify-center space-y-2">
              <div className="w-28 h-28 bg-white p-2 rounded-lg flex items-center justify-center border border-neutral-300">
                <div className="w-full h-full border-4 border-neutral-900 grid grid-cols-4 gap-1 p-1">
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                  <div className="bg-white" /><div className="bg-black" /><div className="bg-black" /><div className="bg-white" />
                  <div className="bg-black" /><div className="bg-white" /><div className="bg-black" /><div className="bg-black" />
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-white" /><div className="bg-black" />
                </div>
              </div>
              <div className="font-mono text-xs text-neutral-900 font-black">
                {scanningPart.authenticityCode}
              </div>
            </div>

            <div className="text-xs text-neutral-800">
              <div>نام کالا: <span className="font-bold text-black">{scanningPart.nameFa}</span></div>
              <div className="text-[11px] text-neutral-500 mt-1">شماره بچ کارخانه: {scanningPart.batchNumber}</div>
            </div>

            {scanResult ? (
              <div className="p-3 bg-neutral-100 border border-neutral-900 rounded-xl text-xs text-neutral-900 font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                <span>گواهی اصالت فابریک تایید گردید (ضدتقلب معتبر)</span>
              </div>
            ) : (
              <div className="text-xs text-neutral-600 animate-pulse font-medium">
                در حال استعلام از سامانه مرکزی قطعات...
              </div>
            )}

            <button
              onClick={() => setScanningPart(null)}
              className="w-full py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
            >
              بستن پنجره استعلام
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
