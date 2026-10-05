import React, { useState } from 'react';
import { 
  ClipboardList, 
  Clock, 
  Plus, 
  Search, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { ServiceOrder, OrderState } from '../../types/odoo';

interface Domain1OrdersProps {
  orders: ServiceOrder[];
  onUpdateOrder: (updatedOrder: ServiceOrder) => void;
  onCreateOrder: (newOrder: Partial<ServiceOrder>) => void;
}

export const Domain1Orders: React.FC<Domain1OrdersProps> = ({
  orders,
  onUpdateOrder,
  onCreateOrder,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(orders[0] || null);
  const [filterState, setFilterState] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showChangeOrderModal, setShowChangeOrderModal] = useState(false);
  const [changeOrderTitle, setChangeOrderTitle] = useState('');
  const [changeOrderReason, setChangeOrderReason] = useState('');
  const [changeOrderAmount, setChangeOrderAmount] = useState(250000);

  // New order form state
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [newPriority, setNewPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filterState === 'all' || o.state === filterState;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.includes(searchTerm) ||
      o.vehiclePlate.includes(searchTerm) ||
      o.vehicleModel.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleStateTransition = (targetState: OrderState) => {
    if (!selectedOrder) return;
    const updated = { ...selectedOrder, state: targetState };
    if (targetState === 'done') {
      updated.qcPassed = true;
      updated.endTime = 'هم‌اکنون';
    }
    if (targetState === 'in_progress') {
      updated.startTime = 'هم‌اکنون';
    }
    setSelectedOrder(updated);
    onUpdateOrder(updated);
  };

  const handleAddChangeOrder = () => {
    if (!selectedOrder || !changeOrderTitle) return;
    const newCO = {
      id: `co-${Date.now()}`,
      title: changeOrderTitle,
      reason: changeOrderReason || 'ضرورت تعویض در حین سرویس',
      additionalItems: [
        {
          id: `item-${Date.now()}`,
          name: changeOrderTitle,
          category: 'part' as const,
          price: changeOrderAmount,
          qty: 1,
          estimatedMinutes: 15,
        }
      ],
      totalAdditionalAmount: changeOrderAmount,
      customerApproved: true,
      approvalTimestamp: 'لحظاتی پیش (تأیید پیامکی OTP)',
      evidenceNotes: 'شواهد فرسودگی پیوست شد.',
    };

    const updated = {
      ...selectedOrder,
      changeOrders: [...selectedOrder.changeOrders, newCO],
      totalPartsAmount: selectedOrder.totalPartsAmount + changeOrderAmount,
      totalAmount: selectedOrder.totalAmount + changeOrderAmount,
      state: 'in_progress' as OrderState,
    };

    setSelectedOrder(updated);
    onUpdateOrder(updated);
    setShowChangeOrderModal(false);
    setChangeOrderTitle('');
    setChangeOrderReason('');
  };

  const handleCreateNewOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newPlate) return;

    const newObj: ServiceOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `WO-2024-00${orders.length + 101}`,
      customerId: `cust-${Date.now()}`,
      customerName: newCustomerName,
      customerPhone: newPhone || '09120000000',
      vehicleId: `veh-${Date.now()}`,
      vehiclePlate: newPlate,
      vehicleModel: newVehicleModel || 'پژو پارس TU5',
      branchId: 'br-1',
      branchName: 'شعبه مرکزی غرب (ستارخان)',
      serviceType: 'regular_service',
      channel: 'online_app',
      priority: newPriority,
      state: 'draft',
      appointmentTime: 'امروز ساعت ۱۴:۰۰',
      slaLimitMinutes: 90,
      elapsedMinutes: 0,
      slaBreached: false,
      services: [
        {
          id: `srv-${Date.now()}-1`,
          name: 'پکیج سرویس دوره‌ای روغن و فیلترها',
          category: 'labor',
          price: 450000,
          qty: 1,
          estimatedMinutes: 30,
        }
      ],
      changeOrders: [],
      totalLaborAmount: 450000,
      totalPartsAmount: 0,
      totalAmount: 450000,
      isPaid: false,
      createdAt: 'امروز',
    };

    onCreateOrder(newObj);
    setSelectedOrder(newObj);
    setShowNewOrderModal(false);
    setNewCustomerName('');
    setNewPlate('');
    setNewVehicleModel('');
    setNewPhone('');
  };

  const getStateBadge = (state: OrderState) => {
    switch (state) {
      case 'draft': return <span className="text-neutral-500 font-bold">پیش‌نویس</span>;
      case 'appointment': return <span className="text-neutral-900 font-bold">نوبت‌دهی‌شده</span>;
      case 'accepted': return <span className="text-neutral-900 font-bold">پذیرش شعبه</span>;
      case 'assigned': return <span className="text-neutral-900 font-bold">تخصیص به لاین</span>;
      case 'checked_in': return <span className="text-neutral-900 font-bold">ورود (Check-in)</span>;
      case 'inspecting': return <span className="text-neutral-900 font-bold">در حال بازرسی OBD</span>;
      case 'in_progress': return <span className="text-black font-black underline">در حال انجام تعمیر</span>;
      case 'change_order_pending': return <span className="text-black font-black">در انتظار تایید الحاقیه</span>;
      case 'qc_pending': return <span className="text-neutral-900 font-bold">کنترل کیفیت نهایی</span>;
      case 'done': return <span className="text-black font-black">پایان کار / آماده ترخیص</span>;
      case 'delivered': return <span className="text-neutral-600 font-bold">تحویل مشتری شد</span>;
      default: return <span className="text-neutral-600">{state}</span>;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 bg-white text-neutral-900">
      {/* Module Title Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-neutral-900 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 mb-1">
            <ClipboardList className="w-4 h-4 text-neutral-900" />
            <span>دامنه ۱: مدیریت سفارش و خدمات (Order & Service Management)</span>
          </div>
          <h1 className="text-xl font-black text-neutral-900 tracking-tight">
            کنسول مدیریت گردش کار سفارشات و دستور کار (Work Orders)
          </h1>
          <p className="text-xs text-neutral-600 mt-0.5">
            گردش کار ۱۰ مرحله‌ای: ثبت → نوبت → پذیرش → تخصیص → ورود → بازرسی → تعمیر → الحاقیه → کنترل کیفیت → ترخیص
          </p>
        </div>

        <button
          onClick={() => setShowNewOrderModal(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت سفارش کار جدید</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Orders List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Status Filter */}
          <div className="bg-white border border-neutral-300 rounded-xl p-3 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو با شماره سفارش، پلاک، نام مشتری..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg pr-9 pl-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1">
              {['all', 'in_progress', 'inspecting', 'change_order_pending', 'done'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterState(st)}
                  className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors font-bold ${
                    filterState === st 
                      ? 'bg-neutral-900 text-white' 
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {st === 'all' ? 'همه' : st === 'in_progress' ? 'در حال تعمیر' : st === 'inspecting' ? 'بازرسی' : st === 'change_order_pending' ? 'الحاقیه' : 'تکمیل'}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards List */}
          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`cursor-pointer p-4 rounded-xl border transition-all text-xs ${
                  selectedOrder?.id === ord.id
                    ? 'bg-neutral-50 border-neutral-900 shadow-sm'
                    : 'bg-white border-neutral-300 hover:border-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-black text-neutral-900">{ord.orderNumber}</span>
                  <div className="flex items-center gap-2">
                    {ord.priority === 'urgent' && (
                      <span className="text-[10px] text-white font-bold bg-neutral-900 px-1.5 py-0.5 rounded">
                        فوری / امدادی
                      </span>
                    )}
                    <span className="text-[11px]">{getStateBadge(ord.state)}</span>
                  </div>
                </div>

                <div className="text-neutral-900 font-bold mb-1">{ord.customerName}</div>
                <div className="text-neutral-600 text-[11px] flex items-center justify-between">
                  <span>{ord.vehicleModel}</span>
                  <span className="font-mono text-neutral-900 font-bold">{ord.vehiclePlate}</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-neutral-500" />
                    <span className="tabular-nums font-mono font-bold">{ord.elapsedMinutes} / {ord.slaLimitMinutes} دقیقه</span>
                  </div>
                  <span className="font-mono text-neutral-900 font-black tabular-nums">
                    {ord.totalAmount.toLocaleString()} ریال
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Order Form View (7 cols) */}
        {selectedOrder ? (
          <div className="lg:col-span-7 bg-white border-2 border-neutral-900 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Header Action Bar */}
            <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {selectedOrder.state === 'draft' && (
                  <button
                    onClick={() => handleStateTransition('appointment')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors"
                  >
                    تایید نوبت
                  </button>
                )}
                {selectedOrder.state === 'appointment' && (
                  <button
                    onClick={() => handleStateTransition('accepted')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors"
                  >
                    پذیرش در شعبه
                  </button>
                )}
                {selectedOrder.state === 'accepted' && (
                  <button
                    onClick={() => handleStateTransition('assigned')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors"
                  >
                    تخصیص لاین و تکنسین
                  </button>
                )}
                {selectedOrder.state === 'assigned' && (
                  <button
                    onClick={() => handleStateTransition('checked_in')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors"
                  >
                    ورود خودرو (Check-in)
                  </button>
                )}
                {selectedOrder.state === 'checked_in' && (
                  <button
                    onClick={() => handleStateTransition('inspecting')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors"
                  >
                    شروع بازرسی اولیه OBD
                  </button>
                )}
                {selectedOrder.state === 'inspecting' && (
                  <button
                    onClick={() => handleStateTransition('in_progress')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors"
                  >
                    شروع تعمیرات در لاین
                  </button>
                )}
                {selectedOrder.state === 'in_progress' && (
                  <>
                    <button
                      onClick={() => setShowChangeOrderModal(true)}
                      className="px-3 py-1.5 bg-white border border-neutral-900 hover:bg-neutral-100 text-neutral-900 rounded-lg font-bold transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ثبت الحاقیه (Change Order)</span>
                    </button>
                    <button
                      onClick={() => handleStateTransition('qc_pending')}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors"
                    >
                      ارسال به QC
                    </button>
                  </>
                )}
                {selectedOrder.state === 'qc_pending' && (
                  <button
                    onClick={() => handleStateTransition('done')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>تأیید کنترل کیفیت و پایان کار</span>
                  </button>
                )}
                {selectedOrder.state === 'done' && (
                  <button
                    onClick={() => handleStateTransition('delivered')}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-lg font-bold transition-colors"
                  >
                    ترخیص و تحویل به مشتری
                  </button>
                )}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-neutral-300">
                <span className="text-neutral-500">وضعیت سند:</span>
                {getStateBadge(selectedOrder.state)}
              </div>
            </div>

            {/* Odoo Form Sheet */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[640px] text-xs">
              {/* Order Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-neutral-200 gap-2">
                <div>
                  <div className="text-[11px] text-neutral-500 font-mono">سفارش کار رسمی Odoo 19:</div>
                  <h2 className="text-xl font-black font-mono text-neutral-900 tracking-tight">
                    {selectedOrder.orderNumber}
                  </h2>
                </div>

                <div className="text-left">
                  <div className="text-[11px] text-neutral-500">جمع کل فاکتور:</div>
                  <div className="text-lg font-black font-mono text-neutral-900 tabular-nums">
                    {selectedOrder.totalAmount.toLocaleString()} ریال
                  </div>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div className="space-y-2">
                  <div className="text-neutral-500 font-bold text-[11px] border-b border-neutral-200 pb-1">اطلاعات مشتری و خودرو</div>
                  <div><span className="text-neutral-500">مالک:</span> <span className="font-bold text-neutral-900 mr-1">{selectedOrder.customerName}</span></div>
                  <div><span className="text-neutral-500">تماس:</span> <span className="font-mono text-neutral-900 mr-1">{selectedOrder.customerPhone}</span></div>
                  <div><span className="text-neutral-500">خودرو:</span> <span className="font-bold text-neutral-900 mr-1">{selectedOrder.vehicleModel}</span></div>
                  <div><span className="text-neutral-500">پلاک:</span> <span className="font-mono text-neutral-900 font-black mr-1">{selectedOrder.vehiclePlate}</span></div>
                </div>

                <div className="space-y-2">
                  <div className="text-neutral-500 font-bold text-[11px] border-b border-neutral-200 pb-1">تخصیص کارگاه و SLA</div>
                  <div><span className="text-neutral-500">شعبه:</span> <span className="text-neutral-900 font-medium mr-1">{selectedOrder.branchName}</span></div>
                  <div><span className="text-neutral-500">لاین (Bay):</span> <span className="font-bold text-neutral-900 mr-1">{selectedOrder.bayName || 'هنوز تخصیص نیافته'}</span></div>
                  <div><span className="text-neutral-500">تکنسین مسئول:</span> <span className="font-bold text-neutral-900 mr-1">{selectedOrder.technicianName || 'تعیین نشده'}</span></div>
                  <div><span className="text-neutral-500">سقف زمان SLA:</span> <span className="font-mono text-neutral-900 font-bold mr-1">{selectedOrder.slaLimitMinutes} دقیقه</span></div>
                </div>
              </div>

              {/* Services & Parts Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                  <span>اقلام خدمات و قطعات مصرفی (Service Lines)</span>
                  <span className="text-[11px] text-neutral-500 font-normal">تفکیک اجرت و قطعه</span>
                </div>
                <div className="border border-neutral-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-neutral-100 text-neutral-700 border-b border-neutral-200 text-[11px] font-bold">
                      <tr>
                        <th className="p-2.5">شرح خدمت / قطعه</th>
                        <th className="p-2.5">دسته</th>
                        <th className="p-2.5">تعداد</th>
                        <th className="p-2.5">نرخ واحد (ریال)</th>
                        <th className="p-2.5">مبلغ کل (ریال)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-neutral-800">
                      {selectedOrder.services.map((srv) => (
                        <tr key={srv.id} className="hover:bg-neutral-50">
                          <td className="p-2.5 font-bold text-neutral-900">{srv.name}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 border border-neutral-300 text-neutral-800 font-bold">
                              {srv.category === 'labor' ? 'اجرت' : 'قطعه یدکی'}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono tabular-nums">{srv.qty}</td>
                          <td className="p-2.5 font-mono tabular-nums">{srv.price.toLocaleString()}</td>
                          <td className="p-2.5 font-mono font-bold text-neutral-900 tabular-nums">
                            {(srv.price * srv.qty).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotals */}
                <div className="flex justify-end gap-6 pt-2 font-mono text-xs">
                  <div><span className="text-neutral-500 font-sans">اجرت:</span> <span className="text-neutral-900 font-bold tabular-nums">{selectedOrder.totalLaborAmount.toLocaleString()} ریال</span></div>
                  <div><span className="text-neutral-500 font-sans">قطعات:</span> <span className="text-neutral-900 font-bold tabular-nums">{selectedOrder.totalPartsAmount.toLocaleString()} ریال</span></div>
                </div>
              </div>

              {/* Inspection Summary */}
              {selectedOrder.inspection && (
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                    <span>نتایج بازرسی اولیه و دستگاه دیاگ (Inspection & OBD)</span>
                    <span className="text-[11px] text-neutral-600 font-mono font-bold">
                      کیلومتر: {selectedOrder.inspection.odometer.toLocaleString()} km
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-white border border-neutral-300">
                      <div className="text-neutral-500">سلامت باتری:</div>
                      <div className="text-neutral-900 font-bold font-mono">{selectedOrder.inspection.batteryHealthPercent}٪</div>
                    </div>
                    <div className="p-2 rounded bg-white border border-neutral-300">
                      <div className="text-neutral-500">سایش لنت ترمز:</div>
                      <div className="text-neutral-900 font-bold font-mono">{selectedOrder.inspection.brakePadWearPercent}٪</div>
                    </div>
                    <div className="p-2 rounded bg-white border border-neutral-300">
                      <div className="text-neutral-500">فشار باد لاستیک:</div>
                      <div className="text-neutral-900 font-bold font-mono">{selectedOrder.inspection.tirePressurePsi} PSI</div>
                    </div>
                    <div className="p-2 rounded bg-white border border-neutral-300">
                      <div className="text-neutral-500">کدهای خطای OBD:</div>
                      <div className="text-neutral-900 font-mono text-[10px] font-bold">
                        {selectedOrder.inspection.obdCodes.length > 0 ? selectedOrder.inspection.obdCodes[0] : 'بدون کد خطا'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    <span className="font-bold text-neutral-900">یادداشت کارشناس: </span>
                    {selectedOrder.inspection.inspectorNotes}
                  </div>
                </div>
              )}

              {/* Change Orders Section */}
              {selectedOrder.changeOrders.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-neutral-900" />
                    <span>الحاقیه‌ها و کارهای اضافه تصویب‌شده (Change Orders)</span>
                  </div>
                  {selectedOrder.changeOrders.map((co) => (
                    <div key={co.id} className="p-3 rounded-xl bg-neutral-50 border border-neutral-300 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-neutral-900">
                        <span>{co.title}</span>
                        <span className="text-neutral-900 font-mono">
                          {co.customerApproved ? '✓ تایید دیجیتال مشتری اخذ شد' : 'منتظر تایید مشتری'}
                        </span>
                      </div>
                      <div className="text-neutral-600 text-[11px]">{co.reason}</div>
                      <div className="text-[11px] text-neutral-900 font-mono font-bold pt-1">
                        مبلغ اضافه: {co.totalAdditionalAmount.toLocaleString()} ریال · {co.approvalTimestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 flex items-center justify-center p-12 bg-white border border-neutral-300 rounded-2xl text-neutral-500 text-xs">
            یک سفارش را از لیست سمت راست انتخاب کنید تا فرم گردش کار باز شود.
          </div>
        )}
      </div>

      {/* Change Order Modal */}
      {showChangeOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-neutral-900" />
              <span>ثبت کار یا قطعه اضافه (Change Order)</span>
            </h3>
            <p className="text-xs text-neutral-600">
              هیچ قطعه یا اجرت اضافه‌ای بدون اخذ تاییدیه دیجیتال مشتری به فاکتور نهایی الصاق نمی‌گردد.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-800 font-bold mb-1">عنوان کار یا قطعه اضافه:</label>
                <input
                  type="text"
                  value={changeOrderTitle}
                  onChange={(e) => setChangeOrderTitle(e.target.value)}
                  placeholder="مثال: تعویض فیلتر بنزین و شستشوی سوزن انژکتور"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 focus:outline-none focus:border-neutral-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-800 font-bold mb-1">دلیل فنی ضرورت تعویض:</label>
                <input
                  type="text"
                  value={changeOrderReason}
                  onChange={(e) => setChangeOrderReason(e.target.value)}
                  placeholder="مثال: گرفتگی فیلتر و افت فشار پمپ بنزین"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 focus:outline-none focus:border-neutral-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-800 font-bold mb-1">برآورد مبلغ اضافه (ریال):</label>
                <input
                  type="number"
                  value={changeOrderAmount}
                  onChange={(e) => setChangeOrderAmount(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 font-mono focus:outline-none focus:border-neutral-900 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
              <button
                onClick={() => setShowChangeOrderModal(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleAddChangeOrder}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold"
              >
                ارسال به مشتری و تایید خودکار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleCreateNewOrderSubmit} className="w-full max-w-lg bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-neutral-900" />
              <span>ثبت سفارش کار خودرو (Create Service Order)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-800 font-bold mb-1">نام و نام خانوادگی مشتری:</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="مثال: علی حسینی"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-800 font-bold mb-1">شماره تماس همراه:</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0912..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-800 font-bold mb-1">مدل و برند خودرو:</label>
                <input
                  type="text"
                  required
                  value={newVehicleModel}
                  onChange={(e) => setNewVehicleModel(e.target.value)}
                  placeholder="مثال: دنا پلاس، تارا، ۲۰۷، سراتو"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-800 font-bold mb-1">شماره پلاک ایران:</label>
                <input
                  type="text"
                  required
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  placeholder="مثال: ۳۴ ب ۵۶۱ ایران ۲۲"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-800 font-bold mb-1">درجه اولویت سفارش:</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-900 font-medium"
                >
                  <option value="normal">عادی (Normal)</option>
                  <option value="high">بالا (High)</option>
                  <option value="urgent">فوری / امداد در جاده (Urgent)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold"
              >
                ثبت سفارش کار
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
