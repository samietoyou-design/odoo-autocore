import React, { useState } from 'react';
import { 
  Workflow, 
  ArrowRight, 
  ArrowLeft,
  RefreshCw, 
  Layers, 
  Sparkles
} from 'lucide-react';
import { DOMAINS } from '../data/modulesCatalog';
import { DomainId } from '../types/odoo';

export const InteractiveFlowchart: React.FC = () => {
  const [selectedDomainTab, setSelectedDomainTab] = useState<DomainId | 'master'>('master');
  const [simulatorStep, setSimulatorStep] = useState(0);

  const simulationSteps = [
    {
      step: 1,
      title: 'مشتری و خودرو (گاراژ دیجیتال)',
      domain: 'مشتری و خودرو',
      action: 'ثبت خودرو با VIN در سیستم و درخواست سرویس دوره‌ای ۳۰ هزار کیلومتر',
      odooModel: 'fleet.vehicle → auto.service.order',
      output: 'ایجاد پیش‌نویس سفارش (Draft Order) با استعلام کیلومتر و سوابق قبلی',
      badge: 'مشتری'
    },
    {
      step: 2,
      title: 'نوبت‌دهی و اعتبارسنجی اسلات (Appointment)',
      domain: 'سفارش و خدمات',
      action: 'انتخاب تاریخ و ساعت مناسب در تقویم شعبه و رزرو اسلات با کنترل سقف ظرفیت',
      odooModel: 'auto.appointment.slot',
      output: 'ارسال پیامک تایید نوبت با کد پیگیری برای مشتری و رزرو ساعت',
      badge: 'مرکز تماس / وب'
    },
    {
      step: 3,
      title: 'پذیرش و تأیید سفارش در شعبه (Order Acceptance)',
      domain: 'سفارش و خدمات',
      action: 'سرپرست شعبه سفارش را بررسی کرده و پذیرش می‌کند (یا در صورت تکمیل ظرفیت با دلیل رد و به شعبه مجاور ریدایرکت می‌نماید)',
      odooModel: 'auto.order.acceptance',
      output: 'تغییر وضعیت به Accepted و آغاز تایمر زمان‌بندی SLA',
      badge: 'پذیرشگر شعبه'
    },
    {
      step: 4,
      title: 'تخصیص لاین و تکنسین (Bay & Tech Assignment)',
      domain: 'عملیات سالن',
      action: 'تخصیص سفارش به لاین ۲ (جک دو ستون) و تکنسین ماهر با تطابق مهارت موتور',
      odooModel: 'workshop.bay → hr.employee',
      output: 'لاین از حالت Available به Occupied تغییر یافته و سفارش در تبلت تکنسین ظاهر می‌شود',
      badge: 'سرپرست سالن'
    },
    {
      step: 5,
      title: 'ورود و بازرسی اولیه خودرو (Check-in & Inspection)',
      domain: 'سفارش و خدمات',
      action: 'ثبت کیلومتر دقیق، اسکن کدهای خطای OBD، ثبت عکس‌های بدنه و امضای دیجیتال چک‌لیست پذیرش',
      odooModel: 'auto.vehicle.inspection',
      output: 'صدور فرم کارشناسی و ضمیمه شدن به پاسپورت سلامت خودرو',
      badge: 'کارشناس پذیرش'
    },
    {
      step: 6,
      title: 'رزرو و خروج قطعات از انبار (Stock Reservation)',
      domain: 'انبار و قطعات',
      action: 'سیستم به صورت خودکار روغن و فیلتر را برای این سفارش رزرو و حواله خروج صادر می‌کند',
      odooModel: 'stock.move → stock.quant',
      output: 'کاهش موجودی آزاد انبار و اسکن کد اصالت QR قطعات قبل از نصب',
      badge: 'انباردار'
    },
    {
      step: 7,
      title: 'مدیریت تغییرات حین تعمیر (Change Order)',
      domain: 'سفارش و خدمات',
      action: 'تکنسین فرسودگی لنت عقب را مشاهده می‌کند؛ ثبت درخواست الحاقیه و ارسال لینک استعلام بها به مشتری با تایید پیامکی',
      odooModel: 'auto.change.order',
      output: 'مشتری لنت را آنلاین تایید می‌کند؛ قطعه لنت به سفارش اضافه می‌شود',
      badge: 'تکنسین و مشتری'
    },
    {
      step: 8,
      title: 'کنترل کیفیت نهایی و تست جاده (QC Inspection)',
      domain: 'عملیات سالن',
      action: 'ناظر کیفی مستقل چک‌لیست گشتاور پیچ چرخ‌ها و عدم وجود خطای دیاگ را بررسی و تایید می‌نماید',
      odooModel: 'auto.quality.control',
      output: 'تایید Pass در سیستم و آزادسازی لاین تعمیرگاه',
      badge: 'ناظر کیفیت (QC)'
    },
    {
      step: 9,
      title: 'صدور فاکتور و تفکیک مالی (Invoicing & Split)',
      domain: 'مالی و حسابداری',
      action: 'صدور فاکتور قطعی با تفکیک دقیق اجرت و قطعه و پرداخت از طریق پوز یا درگاه آنلاین',
      odooModel: 'account.move → account.payment',
      output: 'تسویه مانده فاکتور و ثبت سند حسابداری خودکار بهای تمام شده',
      badge: 'صندوقدار شعبه'
    },
    {
      step: 10,
      title: 'محاسبه کارمزد و تسویه شریک (Partner Settlement)',
      domain: 'مالی و فرانچایز',
      action: 'کسر ۱۵٪ کمیسیون پلتفرم مرکزی و ۵٪ ذخیره گارانتی و درج سهم ۸۰ درصدی شریک در صورتحساب هفتگی',
      odooModel: 'auto.partner.settlement',
      output: 'تولید سند پرداخت بستانکاری شعبه فرانچایز',
      badge: 'مدیر مالی شبکه'
    },
    {
      step: 11,
      title: 'به‌روزرسانی پاسپورت خودرو و هوش تجاری (BI & Passport)',
      domain: 'مشتری و BI',
      action: 'محاسبه Health Score جدید خودرو و ثبت در کارنامه سوابق؛ تجمیع آمار فروش در داشبورد GMV هیئت مدیره',
      odooModel: 'auto.vehicle.passport → auto.bi.executive',
      output: 'ارسال کارت گارانتی دیجیتال و فعال‌سازی یادآور سرویس دوره‌ای بعدی',
      badge: 'موتور BI اودو'
    },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 bg-white text-neutral-900">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border-2 border-neutral-900 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 mb-1">
              <Workflow className="w-4 h-4 text-neutral-900" />
              <span>فلوچارت تعاملی گردش کار و نقشه کلان یکپارچگی سیستم</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-neutral-900 tracking-tight">
              معماری جریان داده و فرآیندها در ERP خدمات خودرویی اودو
            </h1>
            <p className="text-xs text-neutral-600 mt-1 max-w-3xl leading-relaxed">
              منطق زنجیره ارزش:
              <span className="font-bold text-neutral-900 mr-1">
                مشتری/خودرو → سفارش/خدمات → عملیات سالن → انبار/خرید → مالی/تسویه → فرانچایز → هوش تجاری BI
              </span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedDomainTab('master')}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors font-bold flex items-center gap-1.5 ${
              selectedDomainTab === 'master'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>شبیه‌ساز گام‌به‌گام گردش داده (Master Flow)</span>
          </button>

          {DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomainTab(d.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors font-bold ${
                selectedDomainTab === d.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:border-neutral-900'
              }`}
            >
              دامنه {d.number}: {d.nameFa.split(' ')[0]} {d.nameFa.split(' ')[1] || ''}
            </button>
          ))}
        </div>
      </div>

      {/* View 1: Master Step Simulator */}
      {selectedDomainTab === 'master' ? (
        <div className="space-y-6">
          {/* Visual Step Simulator Card */}
          <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
              <div>
                <span className="text-xs font-bold text-neutral-500">شبیه‌ساز تعاملی ۱۱ مرحله‌ای چرخه حیات سفارش</span>
                <h2 className="text-base font-black text-neutral-900 mt-0.5">
                  گام {simulationSteps[simulatorStep].step} از ۱۱: {simulationSteps[simulatorStep].title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulatorStep(Math.max(0, simulatorStep - 1))}
                  disabled={simulatorStep === 0}
                  className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-neutral-900 disabled:opacity-30 text-xs font-bold text-neutral-900 flex items-center gap-1 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>مرحله قبل</span>
                </button>
                <button
                  onClick={() => setSimulatorStep(Math.min(simulationSteps.length - 1, simulatorStep + 1))}
                  disabled={simulatorStep === simulationSteps.length - 1}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-black disabled:opacity-30 text-xs font-bold text-white flex items-center gap-1 transition-colors shadow-sm"
                >
                  <span>مرحله بعد</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSimulatorStep(0)}
                  className="p-1.5 rounded-lg border border-neutral-300 hover:border-neutral-900 text-neutral-700 hover:text-black transition-colors"
                  title="شروع مجدد"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="grid grid-cols-11 gap-1.5 mb-6">
              {simulationSteps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setSimulatorStep(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === simulatorStep
                      ? 'bg-neutral-900 ring-2 ring-neutral-400'
                      : idx < simulatorStep
                      ? 'bg-neutral-600'
                      : 'bg-neutral-200'
                  }`}
                  title={`${s.step}. ${s.title}`}
                />
              ))}
            </div>

            {/* Active Step Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-50 p-5 rounded-xl border border-neutral-300">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-white text-neutral-900 border border-neutral-900">
                    دامنه: {simulationSteps[simulatorStep].domain}
                  </span>
                  <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-neutral-900 text-white">
                    عامل اجرا: {simulationSteps[simulatorStep].badge}
                  </span>
                </div>

                <div className="text-sm font-bold text-neutral-900">
                  اقدام عملیاتی در سیستم:
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                  {simulationSteps[simulatorStep].action}
                </p>

                <div className="pt-2 text-xs font-bold text-neutral-900">
                  خروجی و تغییر وضعیت در اودو:
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed font-mono font-bold">
                  {simulationSteps[simulatorStep].output}
                </p>
              </div>

              <div className="space-y-3 border-r border-neutral-300 pr-6">
                <div className="text-xs font-bold text-neutral-900">مدل‌های داده‌ای درگیر در Odoo:</div>
                <div className="p-3 rounded-lg bg-white border border-neutral-300 font-mono text-xs text-neutral-900 font-bold space-y-1">
                  <div>Model: {simulationSteps[simulatorStep].odooModel}</div>
                  <div className="text-[10px] text-neutral-500 font-normal">Trigger: Automated Method & UI Action</div>
                </div>

                <div className="text-[11px] text-neutral-600">
                  در این گام، اعتبارسنجی قوانین کسب‌وکار (@api.constrains) و محاسبه زمان SLA انجام می‌پذیرد.
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Domain Pipeline Map (Visual Nodes) */}
          <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-neutral-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-neutral-900" />
              <span>نقشه جریان پیوسته داده میان ۸ دامنه کلان</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-900">۱. مشتری و خودرو</div>
                <div className="text-[11px] text-neutral-600">مستر مشتری، گاراژ، VIN، تاریخچه و پاسپورت سلامت خودرو</div>
                <div className="text-[10px] text-neutral-800 font-mono font-bold">fleet.vehicle, res.partner</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-900">۲. سفارش و خدمات</div>
                <div className="text-[11px] text-neutral-600">نوبت‌دهی تقویمی، پذیرش، بازرسی OBD، دستور کار و SLA</div>
                <div className="text-[10px] text-neutral-800 font-mono font-bold">auto.service.order</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-900">۳. عملیات سالن و لاین‌ها</div>
                <div className="text-[11px] text-neutral-600">تخصیص لاین (Bay)، تکنسین، شیفت کاری، چک‌لیست و QC</div>
                <div className="text-[10px] text-neutral-800 font-mono font-bold">workshop.bay, hr.employee</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-900">۴. انبار و خرید قطعات</div>
                <div className="text-[11px] text-neutral-600">رزرو قطعه، بارکد اصالت QR، لات/بچ، سفارش خرید PO و رسید</div>
                <div className="text-[10px] text-neutral-800 font-mono font-bold">stock.move, purchase.order</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-900">۵. مالی و حسابداری</div>
                <div className="text-[11px] text-neutral-600">تفکیک اجرت/قطعه، پوز و درگاه، تسهیم هزینه، دفتر کل و معین</div>
                <div className="text-[10px] text-neutral-800 font-mono font-bold">account.move, account.payment</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-900">۶. شریک و فرانچایز</div>
                <div className="text-[11px] text-neutral-600">آنبردینگ، ممیزی فنی، خرید مخفیانه، نمره FTFR و تسویه شریک</div>
                <div className="text-[10px] text-neutral-800 font-mono font-bold">auto.partner.settlement</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-900">۷. وفاداری و بازاریابی</div>
                <div className="text-[11px] text-neutral-600">یادآور هوشمند کیلومتری سرویس، گواهی انتقال به خریدار و NPS</div>
                <div className="text-[10px] text-neutral-800 font-mono font-bold">auto.service.reminder</div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-900">۸. هوش تجاری مدیریتی</div>
                <div className="text-[11px] text-neutral-600">داشبورد GMV، پایش لحظه‌ای SLA، نرخ خطا و درآمد ناخالص</div>
                <div className="text-[10px] text-neutral-800 font-mono font-bold">auto.bi.executive</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Domain-Specific Visual Flowchart */
        <div className="bg-white border-2 border-neutral-900 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-base font-black text-neutral-900">
                فلوچارت فرآیندی: {DOMAINS.find(d => d.id === selectedDomainTab)?.nameFa}
              </h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                مسیر توالی لاجیکال ماژول‌ها منطبق با شیت {DOMAINS.find(d => d.id === selectedDomainTab)?.number} فایل نیازمندی‌ها
              </p>
            </div>
          </div>

          {/* Render Flowchart ASCII/Box */}
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-300 font-mono text-xs overflow-x-auto text-neutral-900 leading-relaxed font-bold">
            {selectedDomainTab === 'orders' && (
              <pre className="font-sans">
{`مشتری / کانال ثبت (اپلیکیشن موبایل، مرکز تماس، حضوری، ناوگان سازمانی)
   ↓
[Order Management] ثبت و ویرایش سفارش → نوع خدمت، خودرو، مشتری، محل خدمت، اولویت، وضعیت
   ↓
[Appointment Management] نوبت‌دهی هوشمند → تقویم → تاریخ و ساعت → ظرفیت اسلات → لیست انتظار
   ↓
[Order Acceptance] پذیرش/رد توسط شعبه → ثبت دلیل استاندارد رد → پیشنهاد شعبه جایگزین نزدیک
   ↓
[Assignment Management] تخصیص شعبه، تکنسین ماهر، لاین تعمیرگاهی (Bay) یا واحد سیار امدادی
   ↓
[Service Execution] ورود خودرو (Check-in) → شروع کار → توقف → ادامه → پایان و ثبت زمان واقعی
   ↓
[Inspection] بازرسی اولیه خودرو → وضعیت بدنه، کیلومتر، تست مایعات، اسکن خطاهای OBD
   ↓
[Change Order] کار یا قطعه اضافه حین تعمیر → شواهد تصویری → استعلام قیمت → تأیید دیجیتال مشتری
   ↓
[Order Status] گردش وضعیت ترتیبی از ثبت تا پذیرش، تعمیر، کنترل، ترخیص و تحویل
   ↓
[SLA Management] پایش بلادرنگ مهلت زمانی پذیرش/شروع/انجام → آلارم تاخیر → ثبت SLA Breach
   ↓
[Service History] بایگانی غیرقابل تغییر سوابق نهایی، تکنسین مجری، قطعات با سریال، مبالغ فاکتور`}
              </pre>
            )}

            {selectedDomainTab === 'workshop' && (
              <pre className="font-sans">
{`[Branch Management] تعریف شعبه، ساعات کاری، خدمات قابل ارائه، ظرفیت و وضعیت فعالیت
   ↓
[Capacity Management] محاسبه ظرفیت روزانه شعبه، ظرفیت هر خدمت، سقف تکنسین و اسلات زمانی
   ↓
[Bay Management] تعریف لاین تعمیرگاه (جک ۲ ستون، ۴ ستون، اتاق دیاگ) → وضعیت اشغال/آزاد → رزرو
   ↓
[Technician Management] تکنسین فنی → مهارت‌ها، گواهی‌ها، وضعیت حضور و شعبه خدمت
   ↓
[Shift Management] برنامه‌ریزی شیفت‌های صبح/عصر، حضور و غیاب، مرخصی و پوشش اضافه کاری
   ↓
[Service Time Management] تعریف زمان استاندارد تعمیراتی کتابچه (Flat Rate) → ثبت تاخیر و کارایی
   ↓
[Service Checklist] چک‌لیست قبل، حین و بعد از سرویس با سوالات الزامی بحرانی مدل‌محور
   ↓
[Evidence Management] بارگذاری عکس داغی قطعات، فیلم عیب، اسکرین‌شات دیاگ و مستندات گارانتی
   ↓
[Quality Control] چک‌لیست QC نهایی → آزمون جاده → Pass / Fail → ارجاع به Rework در صورت نقص
   ↓
[Supervisor Console] مانیتورینگ سالن: سفارش‌های باز، تاخیردار، منتظر QC و درخواست‌های الحاقیه
   ↓
[Branch Performance] ارزیابی روزانه خروجی Throughput، زمان سرویس، نرخ دوباره‌کاری و راندمان`}
              </pre>
            )}

            {selectedDomainTab === 'inventory' && (
              <pre className="font-sans">
{`[Item Master] تعریف قطعه، روغن، فیلتر، باتری، پارت نامبر OEM، SKU و واحد سنجش
   ↓
[Warehouse Management] انبار مرکزی، انبار شعب، انبار امانی شریک، انبار واحد سیار و قفسه‌ها
   ↓
[Inventory Transactions] رسید خرید، خروج مصرف بر اساس سفارش کار، انتقال، برگشت و اصلاح موجودی
   ↓
[Stock Reservation] قفل و رزرو قطعه برای سفارش نوبت‌دهی‌شده → آزادسازی در صورت لغو سفارش
   ↓
[Batch / Lot Tracking] ردیابی شماره بچ، سریال باتری/تایر، تاریخ تولید و انقضای روغن موتور
   ↓
[Authenticity Tracking] ردیابی منبع خرید، کد اصالت ضدتقلب، استعلام سامانه و اسکن QR پلمپ
   ↓
[Stock Control] کنترل لحظه‌ای موجودی واقعی، موجودی رزرو، موجودی آزاد و قطعات در راه
   ↓
[Replenishment] حداقل و حداکثر موجودی، Reorder Point، Safety Stock و پیشنهاد خودکار پیش‌نویس خرید
   ↓
[Transfer Management] مدیریت حواله انتقال کالا بین شعب، انبار مرکزی و شارژ واحدهای سیار امدادی
   ↓
[Returns & Warranty Parts] رسید قطعات معیوب گارانتی، داغی مصرف‌شده و مرجوعی به تأمین‌کننده
   ↓
[Inventory Valuation] ارزش‌گذاری موجودی انبار به روش میانگین موزون متحرک (AVCO) و بهای تمام شده COGS
   ↓
[Inventory BI] تحلیل کالاهای راکد (Dead Stock)، سرعت گردش موجودی و میزان مصرف به تفکیک خودرو`}
              </pre>
            )}

            {selectedDomainTab === 'purchasing' && (
              <pre className="font-sans">
{`[Supplier Master] اطلاعات حقوقی تأمین‌کننده، برندهای تحت پوشش، منطقه، اطلاعات تماس و وندرلیست
   ↓
[Supplier Price List] لیست قیمت خرید، درصدهای تخفیف حجمی، تاریخ اعتبار و حداقل مقدار سفارش MOQ
   ↓
[Credit Terms] شرایط پرداخت نقدی/اعتباری، مهلت چک، سقف اعتبار ریالی و مانده بدهی سررسیدشده
   ↓
[Purchase Request] درخواست خرید صادره از شعب، انبارها یا سیستم خودکار و گردش تاییدات مالی
   ↓
[Purchase Order] صدور سفارش خرید رسمی PO، تایید بودجه، اصلاح، لغو و تحویل چندمرحله‌ای
   ↓
[Goods Receipt] دریافت فیزیکی کالا، تطبیق با مقادیر PO، ثبت بچ، تاریخ انقضا و مغایرت‌گیری
   ↓
[Purchase Invoice] ثبت فاکتور تامین‌کننده و تطبیق ۳ طرفه خودکار (PO - رسید انبار - فاکتور)
   ↓
[Supplier Return] مرجوعی کالا به دلیل نقص کیفی، صدور سند بدهکاری Debit Note و پیگیری جایگزینی
   ↓
[Supplier Evaluation] امتیازدهی سیستماتیک به تامین‌کننده بر اساس قیمت، کیفیت، زمان تحویل و SLA
   ↓
[Contract Management] قرارداد سالیانه، شرایط تجاری، تعهدات گارانتی، تاریخ اعتبار و اسناد
   ↓
[Central Procurement] خرید متمرکز شبکه، تجمیع تقاضای شعب، اخذ بالاترین تخفیف و تخصیص سهمیه‌ای
   ↓
[Procurement BI] تحلیل جامع مخارج Spend Analysis، روند قیمت خرید قطعات و صرفه‌جویی خرید`}
              </pre>
            )}

            {selectedDomainTab === 'finance' && (
              <pre className="font-sans">
{`[Quotation Management] پیش‌فاکتور رسمی، تفکیک اجرت و قطعات، هزینه‌های جانبی و مهلت اعتبار
   ↓
[Invoice Management] فاکتور قطعی مشتری، تفکیک مالیات بر ارزش افزوده و صدور سند تعدیل Credit Note
   ↓
[Payment Management] ثبت دریافت وجه: نقدی، پوز بانکی PC-POS، درگاه آنلاین، اقساطی BNPL و Refund
   ↓
[Partner Settlement] سهم شعبه شریک، کسر کمیسیون پلتفرم، کسر جریمه‌های SLA، تعدیلات و تسویه
   ↓
[Supplier Payables] مدیریت بدهی تامین‌کنندگان قطعات، پیگیری سررسید چک‌ها و جدول پرداخت
   ↓
[Accounts Receivable] مطالبات مشتریان شرکتی و ناوگان‌ها، گزارش سنی بدهکاران Aging Report
   ↓
[Commission Management] فرمولاسیون کمیسیون پلتفرم، سهم تعمیرگاه، پاداش عملکردی تکنسین و بازاریاب
   ↓
[Revenue Management] شناسایی و تفکیک جریان‌های درآمدی: اجرت، مارجین قطعات، اشتراک و فرانچایز
   ↓
[Cost Management] بهای تمام شده قطعات (COGS)، لجستیک، کارمزد تراکنش‌ها، تخفیفات و هزینه گارانتی
   ↓
[Warranty Finance] ذخیره گارانتی (Warranty Reserve)، هزینه ادعای خسارت و بازیافت از قطعه‌ساز
   ↓
[Treasury] صندوق شعب، حساب‌های بانکی، درگاه‌های پرداخت، گردش وجوه نقد و مغایرت‌گیری خودکار
   ↓
[Accounting] درخت حساب‌ها، اسناد دوبل حسابداری، دفتر روزنامه، کل، معین و تفصیلی چندسطحی
   ↓
[Cost Center] مراکز هزینه به تفکیک شعبه، واحد سیار امدادی، دپارتمان مرکزی و پروژه‌های ناوگانی
   ↓
[Financial BI] حجم ناخالص مبادلات (GMV)، درآمد ناخالص، حاشیه سود ناخالص و صورت سود و زیان P&L`}
              </pre>
            )}

            {selectedDomainTab === 'franchise' && (
              <pre className="font-sans">
{`[Partner Master] مشخصات کامل تعمیرگاه، پروانه کسب، امکانات رفاهی، تعداد جک‌ها و وضعیت همکاری
   ↓
[Partner Onboarding] ثبت درخواست عضویت، ارزیابی مدارک ثبتی، نصب اقلام برندینگ و آموزش پرسنل
   ↓
[Contract Management] قرارداد فرانچایز، درصد کارمزد پلتفرم، تارگت‌های SLA، ضمانت‌نامه‌ها و فسخ
   ↓
[Certification] صدور گواهینامه‌های رسمی شعبه و تکنسین‌ها، رتبه‌بندی کیفی Gold/Silver/Bronze
   ↓
[Site Audit] ممیزی فیزیکی و محیطی تعمیرگاه: ایمنی محیط، ابزار استاندارد، اتاق انتظار و HSE
   ↓
[Technical Audit] کالیبراسیون دستگاه دیاگ، سلامت بالابرهای جک، دقت ترکمتر و استانداردهای سرویس
   ↓
[Mystery Shopping] اعزام مشتری مخفی، ارزیابی رفتار پذیرشگر، شفافیت قیمت و گزارش تخلفات
   ↓
[Partner Quality Score] محاسبه نمره کل شعبه: ترکیب FTFR، نرخ گارانتی، شکایت، CSAT، SLA و ممیزی
   ↓
[Corrective Action] ابلاغ برنامه اقدام اصلاحی CAPA برای رفع عدم انطباق‌ها و مهلت پیگیری
   ↓
[Suspension Management] اخطار اول و دوم، تعلیق موقت ارجاع سفارش، بلک‌لیست یا رفع تعلیق
   ↓
[Commission & Royalty] محاسبه Franchise Fee ورودی، Royalty فی ماهانه بر اساس درصد فروش
   ↓
[Partner Settlement] دسترسی به پورتال شریک: صورتحساب شفاف، کسورات جریمه و مبلغ قابل تسویه
   ↓
[Partner BI] تحلیل تطبیقی فروش شعب، مقایسه نرخ شکایت، شاخص FTFR و سودآوری شبکه شرکا`}
              </pre>
            )}

            {selectedDomainTab === 'garage' && (
              <pre className="font-sans">
{`[Customer Master] مشخصات مشتری، شماره تماس با احراز OTP، ترجیحات و کانال ارتباطی
   ↓
[Vehicle Master] پلاک ایران، شماره شاسی (VIN)، برند، مدل، سال ساخت، موتور و کیلومتر جاری
   ↓
[Customer Garage] نمایش خودروهای مشتری، مدیریت ناوگان خانوادگی و ارتباط مالک و راننده
   ↓
[Service History] کاردکس سوابق گذشته، قطعات تعویض‌شده، تکنسین مجری، شعبه خدمت و فاکتورها
   ↓
[Vehicle Health Passport] شناسنامه الکترونیک سلامت، امتیاز Health Score (۰ تا ۱۰۰) موتور و ترمز
   ↓
[Maintenance Plan] برنامه استاندارد نگهداری خودرو بر اساس مدل، کیلومتر و شرایط رانندگی
   ↓
[Service Reminder] یادآوری هوشمند زمان تعویض روغن، فیلتر، لنت و تسمه بر اساس سرعت پیمایش روزانه
   ↓
[Recommendation Management] توصیه‌های کارشناسی فنی: ضروری اکنون، به زودی، قابل تعویق با برآورد هزینه
   ↓
[Warranty Management] صدور ضمانت‌نامه دیجیتال قطعه و اجرت با بارکد و پوشش شبکه سراسری
   ↓
[Complaint Management] ثبت شکایت مشتری، تخصیص مسئول رسیدگی، تماس ظرف ۲ ساعت و حل اختلاف
   ↓
[Customer Feedback] نظرسنجی ۵ ستاره، سنجش شاخص رضایت CSAT و ترویج‌کنندگان خالص NPS
   ↓
[Resale Report] گواهی رسمی سوابق معتبر خودرو با QR ضدجعل مناسب خرید و فروش خودرو`}
              </pre>
            )}

            {selectedDomainTab === 'bi' && (
              <pre className="font-sans">
{`[Sales BI] ─────────────┐
[Operations BI] ────────┤
[Quality BI] ───────────┤
[Branch Performance] ───┤
[Technician BI] ────────┼───→ [Executive Dashboard]
[Inventory BI] ─────────┤      پایش لحظه‌ای GMV، درآمد ناخالص،
[Procurement BI] ───────┤      نرخ نقض SLA، بهره‌وری لاین‌ها،
[Financial BI] ─────────┤      توزیع مراجعات و سلامت مالی
[Partner BI] ───────────┤
[Customer BI] ──────────┤
[Warranty BI] ──────────┤
[SLA Monitoring] ───────┤
[Alerts & Exceptions] ──┘`}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
