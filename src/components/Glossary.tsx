import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Copy, 
  CheckCircle2, 
  Filter, 
  Layers, 
  FileText, 
  Compass, 
  Building2, 
  X, 
  HelpCircle, 
  AlertTriangle,
  History,
  Briefcase
} from 'lucide-react';

export interface GlossaryTerm {
  id: string;
  acronym: string;
  englishName: string;
  persianName: string;
  category: 'formulas' | 'documents' | 'engineering' | 'it-system';
  categoryLabel: string;
  definition: string;
  appUsage: string;
  standard: string;
}

const INITIAL_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'TRM-1',
    acronym: 'BPMN',
    englishName: 'Business Process Model and Notation',
    persianName: 'مدل‌سازی و مدیریت فرآیندهای کاری نیروگاه',
    category: 'it-system',
    categoryLabel: 'فناوری و مهندسی سیستم',
    definition: 'استاندارد بین‌المللی تصویری برای مستندسازی کامپیوتری فرآیندهای کارگاه. در این سیستم برای ردیابی تایید نقشه‌ها و مدارک به صورت موازی و متوالی بر پایه گامهای از پیش تعریف شده استفاده می‌شود.',
    appUsage: 'در ماژول «کارتابل فرآیندهای مهندسی کارگاه»، وضعیت تایید نقشه‌ها بر اساس نمودارهای استاندارد شبیه‌سازی گشته و وظیفه به دپارتمان کاندید ارسال می‌گردد.',
    standard: 'استاندارد بین‌المللی ISO/IEC 19510'
  },
  {
    id: 'TRM-2',
    acronym: 'NCR',
    englishName: 'Non-Conformance Report',
    persianName: 'گزارش مغایرت یا عدم انطباق کیفی',
    category: 'documents',
    categoryLabel: 'مکاتبات و مدیریت اسناد (DCC)',
    definition: 'برگه رسمی صادر شده توسط بازرس کیفی (QC) کارگاه که نشان‌دهنده نقص و انحراف مشخص قطعات بتن‌ریزی یا ساختار جوشکاری پروژه از نقشه پایه‌طراحی صادرشده می‌باشد.',
    appUsage: 'در بخش «برگ گزارش مغایرت (NCR)» کاربران برگه صادر کرده، رویه‌ها و روشهای اصلاحی (Corrective Action) را تایید یا پرونده را رد می‌کنند.',
    standard: 'بخش کنترل فرآیندهای ناسازگار در استاندارد کیفیت ISO 9001 Clause 8.7'
  },
  {
    id: 'TRM-3',
    acronym: 'RFI',
    englishName: 'Request For Information',
    persianName: 'درخواست رسمی ارائه اطلاعات و جزئیات فنی',
    category: 'documents',
    categoryLabel: 'مکاتبات و مدیریت اسناد (DCC)',
    definition: 'مکاتبه استاندارد ارسالی از سمت بخش فنی کارگاه عمران آذرستان به مهندسین طراح اصلی به منظور ابهام‌زدایی از نقشه‌ها یا برقراری شفافیت مابین دیسیپلین‌های مختلف مخازن و داکت‌های بویلر.',
    appUsage: 'در زبانه «درخواست اطلاعات (RFI)» ابهام ثبت شده و پس از پاسخ از مشاور طراح، تاریخ انقضا و بسته‌شدن RFI رصد می‌گردد.',
    standard: 'استاندارد مدیریت پروژه PMBOK - بخش تبیین ارتباطات فنی کارگاه'
  },
  {
    id: 'TRM-4',
    acronym: 'MAR / Submittal',
    englishName: 'Material Approval Request',
    persianName: 'درخواست تایید فنی مصالح و مواد مورد استفاده کارگاهی',
    category: 'documents',
    categoryLabel: 'مکاتبات و مدیریت اسناد (DCC)',
    definition: 'فرآیند اخذ مجامع فنی شامل ارسال اسناد، شناسنامه ممیزی، نتایج آزمایش فیزیکی مواد و نمونه آزمایشی فولاد یا بتن به مشاور عالی جهت اعمال مهر تایید قبل از سفارش ساخت.',
    appUsage: 'در بخش «سابمیتال تأیید متریال کارگاهی (MAR)»، مدارک ارسال گشته و فاز تایید یا مشروط بودن استفاده متریال رصد می‌شود.',
    standard: 'شرایط عمومی پیمان بین‌المللی FIDIC Clause 3.2'
  },
  {
    id: 'TRM-5',
    acronym: 'As-Built Drawings',
    englishName: 'As-Built Drawings',
    persianName: 'نقشه‌های بیلت نهایی یا ازبیلت (وضعیت ساخت نهایی)',
    category: 'engineering',
    categoryLabel: 'امور فنی و کارگاهی',
    definition: 'نقشه‌هایی که گام نهایی ساخت و وضعیت بالفعل اجرا شده از سازه بتنی یا پایپینگ را نشان می‌دهند. کلیه تغییرات تغییر شکل مابین گامهای اولیه شاپ و گام نهایی کارگاهی در آن اعمال گشته است.',
    appUsage: 'در ماژول «آرشیو نقشه‌های وضع موجود»، این اسناد برای مرجع دائم پایش دوره‌ای فونداسیونها و تحویل به کارفرما بایگانی می‌شوند.',
    standard: 'استاندارد کلاس‌بندی مستندسازی صنعت ساخت ASTM E1557'
  },
  {
    id: 'TRM-6',
    acronym: 'SPI',
    englishName: 'Schedule Performance Index',
    persianName: 'شاخص عملکرد زمان‌بندی و پایداری پیشرفت زمانی',
    category: 'formulas',
    categoryLabel: 'شاخص‌ها و محاسبات فنی',
    definition: 'یکی از کلیدی‌ترین شاخص‌های مالی و مدیریتی که تناسب ارزش کسب‌شده بالفعل پروژه را بر ارزش پیش‌بینی‌شده در زمانبندی مقایسه می‌کند. حاصل‌تقسیم مقادیر بزرگتر از ۱ حاکی از رشد زمانی مناسب است.',
    appUsage: 'در داشبورد عملکردی و تحلیلی، SPI مستقیماً از فایل‌های MSP و Primavera به صورت محاسباتی به منظور برآورد فازهای تاخیردار نیروگاه کپی و پایش می‌شود.',
    standard: 'استاندارد مدیریت ارزش کسب‌شده موسسه PMI (EVM Standard)'
  },
  {
    id: 'TRM-7',
    acronym: 'CPI',
    englishName: 'Cost Performance Index',
    persianName: 'شاخص انحراف مالی و عملکرد هزینه پروژه',
    category: 'formulas',
    categoryLabel: 'شاخص‌ها و محاسبات فنی',
    definition: 'شاخصی عددی حاکی از میزان کارایی بودجه تخصیص‌یافته با تقسیم ارزش حاصله کار بر هزینه واقعی صرف‌شده. خروجی کمتر از یک هشدار دهنده هزینه‌تراشی مازاد بر بودجه اولیه است.',
    appUsage: 'در ابزارک تحلیلی مغایرت و بهای تمام‌شده پروژه، به منظور پایش حاشیه سود کارگاه عمران آذرستان استفاده می‌شود.',
    standard: 'استاندارد ارزش کسب‌شده PMBOK Chapter 7'
  },
  {
    id: 'TRM-8',
    acronym: 'RBAC',
    englishName: 'Role-Based Access Control',
    persianName: 'سیستم اعتبارسنجی و دسترسی کاربر بر پایه نقش',
    category: 'it-system',
    categoryLabel: 'فناوری و مهندسی سیستم',
    definition: 'مکانیزم مدرن توزیع مجوزهای نرم‌افزار بر پایه پوزیشن حرفه‌ای افراد در چارت سازمانی به جای تخصیص تکی روی شناسه‌ها. امنیت به کلیه فیلترهای کنترلی متصل است.',
    appUsage: 'ماژول‌های «ماتریس نقش‌ها و سطوح دسترسی» بر مبنای این الگو فعالیت می‌کنند و کاربران را به صورت گروهی منتسب می‌نمایند.',
    standard: 'استاندارد امنیت لایه‌ای موسسه NIST (RBAC standards)'
  },
  {
    id: 'TRM-9',
    acronym: 'PWHT',
    englishName: 'Post Weld Heat Treatment',
    persianName: 'عملیات حرارتی پس از جوشکاری جهت تنش‌زدایی فلز',
    category: 'engineering',
    categoryLabel: 'امور فنی و کارگاهی',
    definition: 'عملیات گرما دادن کنترل‌شده اتصالات لوله‌کشی و فونداسیون‌های توربین گازی پس از پایان جوش به منظور همگن‌سازی ذرات و رفع تنش‌های فیزیکی انقباض ناشی از حرارت بالا.',
    appUsage: 'در برگه‌های NCR و کنترل کیفی بتن/جوش، ثبت پاسپورت عملیات حرارتی به عنوان پیش‌نیاز رد صلاحیت فنی NCR لحاظ می‌شود.',
    standard: 'استاندارد مخازن تحت فشار آمریکا ASME S-VIII Div 1'
  },
  {
    id: 'TRM-10',
    acronym: 'UT',
    englishName: 'Ultrasonic Testing',
    persianName: 'تست بازرسی جوش با امواج فراصوت (غیرمخرب)',
    category: 'engineering',
    categoryLabel: 'امور فنی و کارگاهی',
    definition: 'طریقه‌ای مینیاتوری از پایش غیرمخرب که عیوب گازی پنهان، حفرات ذوب نشده و ترک‌های مینی‌متری را در بتن سنگین نیروگاه و شیت‌های بویلر به تصویر می‌کشد.',
    appUsage: 'در زبانه «آزمایشگاه کنترل کیفی بتن و بتن ریزی»، مقادیر ضخامت و صحت‌های ثبت شده آزمون التراسونیک مستقیماً پایش و رتبه‌بندی کیفی می‌شوند.',
    standard: 'آیین‌نامه ملی آمریکا ASNT SNT-TC-1A / ASME Section V'
  },
  {
    id: 'TRM-11',
    acronym: 'MDR',
    englishName: 'Master Document Register',
    persianName: 'فهرست مرجع و ماتریس پایش تایید کل اسناد فنی پروژه',
    category: 'documents',
    categoryLabel: 'مکاتبات و مدیریت اسناد (DCC)',
    definition: 'بانک داده جامعی که آخرین ویرایش صادرشده، تاریخ‌ها، دیسیپلین، تایید ترانسمیتال و وضعیت حاکم بر کلیه مدارک ارشد نیروگاهی را ثبت و به عنوان قلب تیم مهندسی پروژه عمل می‌کند.',
    appUsage: 'زبانه «امور مدارک دفتر فنی» و فیلترهای دیسیپلین روی پایگاه داده MDR بنا گشته است و آخرین Revisionها را به روز نگه می‌دارد.',
    standard: 'مستندسازی نقشه‌های مهندسی ASME Y14.100'
  },
  {
    id: 'TRM-12',
    acronym: 'MIV / MVR',
    englishName: 'Material Verification Report',
    persianName: 'شناسنامه و صورت‌جلسه بازرسی و وصول متریال انبار',
    category: 'documents',
    categoryLabel: 'مکاتبات و مدیریت اسناد (DCC)',
    definition: 'سندی رسمی برای تطبیق مواد خام فلزی، کیت‌های برقی و کابل‌های ابزاردقیق وارده به گمرک کارگاه را با مشخصات دقیق مندرج در متریال تایید شده نیروگاهی (MAR).',
    appUsage: 'در بخش «زبانه دفتر معین انبار کارگاه»، هر کالا دارای گواهی ورود متناظر MVR برای ایجاد پیوستگی کیفی انبار فیزیکی است.',
    standard: 'پروتکل کنترل زنجیره تامین و انبارداری نیروگاهی ISO 9001:2015'
  }
];

export default function Glossary() {
  const [glossaries, setGlossaries] = useState<GlossaryTerm[]>(INITIAL_GLOSSARY);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'formulas' | 'documents' | 'engineering' | 'it-system'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Suggested term form state
  const [newTerm, setNewTerm] = useState({
    acronym: '',
    englishName: '',
    persianName: '',
    category: 'documents' as GlossaryTerm['category'],
    definition: '',
    appUsage: '',
    standard: ''
  });

  // Calculate stats
  const totalTerms = glossaries.length;
  const acronymsCount = glossaries.filter(t => t.acronym.length > 0).length;
  const docsCount = glossaries.filter(t => t.category === 'documents').length;
  const formulasCount = glossaries.filter(t => t.category === 'formulas').length;

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (term: GlossaryTerm) => {
    const textToCopy = `مخفف: ${term.acronym}
نام انگلیسی: ${term.englishName}
ترجمه فارسی: ${term.persianName}
تعریف فنی: ${term.definition}
مرجع فنی: ${term.standard}`;
    navigator.clipboard.writeText(textToCopy);
    showToast(`اطلاعات واژه تخصصی "${term.acronym || term.englishName}" با موفقیت کپی شد.`);
  };

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm.persianName || !newTerm.definition) {
      alert('لطفاً عنوان واژه فنی و تعریف فنی آن را به صورت دقیق بنویسید.');
      return;
    }

    const categoryLabelMap = {
      formulas: 'شاخص‌ها و محاسبات فنی',
      documents: 'مکاتبات و مدیریت اسناد (DCC)',
      engineering: 'امور فنی و کارگاهی',
      'it-system': 'فناوری و مهندسی سیستم'
    };

    const added: GlossaryTerm = {
      id: `TRM-${glossaries.length + 101}`,
      acronym: newTerm.acronym.trim().toUpperCase(),
      englishName: newTerm.englishName.trim(),
      persianName: newTerm.persianName.trim(),
      category: newTerm.category,
      categoryLabel: categoryLabelMap[newTerm.category],
      definition: newTerm.definition.trim(),
      appUsage: newTerm.appUsage.trim() || 'در مدیریت عمومی و ارجاع مکاتبات کارگاه پروژه عمران آذرستان پایش می‌گردد.',
      standard: newTerm.standard.trim() || 'استاندارد پیوست کیفی دفتر فنی آذرستان'
    };

    setGlossaries([added, ...glossaries]);
    setSelectedCategory('all');
    setSearchTerm('');
    setShowAddModal(false);
    
    // Reset form
    setNewTerm({
      acronym: '',
      englishName: '',
      persianName: '',
      category: 'documents',
      definition: '',
      appUsage: '',
      standard: ''
    });

    showToast(`اصطلاح فنی جدید "${added.acronym || added.persianName}" به جمع واژگان دیتابیس لوکال افزوده شد.`);
  };

  // Filter glossary list
  const filteredGlossaries = glossaries.filter(term => {
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    const cleanSearch = searchTerm.toLowerCase();
    const matchesSearch = 
      term.acronym.toLowerCase().includes(cleanSearch) ||
      term.englishName.toLowerCase().includes(cleanSearch) ||
      term.persianName.toLowerCase().includes(cleanSearch) ||
      term.definition.toLowerCase().includes(cleanSearch) ||
      term.standard.toLowerCase().includes(cleanSearch);
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6" id="technical-glossary-engine">
      
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[9999] bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-scale-up" dir="rtl">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Cards Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 p-4 rounded-xl text-white shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-blue-200">کل واژگان تخصصی نیروگاهی</span>
            <h3 className="text-2xl font-black font-mono mt-1">{totalTerms} عبارت</h3>
          </div>
          <p className="text-xs text-blue-100 mt-2">تعریف شده در مشخصات فنی عمران آذرستان</p>
          <BookOpen className="absolute -bottom-2 -left-2 w-16 h-16 opacity-10 pointer-events-none group-hover:scale-110 transition shrink-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">شناسه و اختصارات فنی (Acronyms)</span>
            <h3 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100 mt-1">{acronymsCount} مخفف</h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">اصطلاحات مهندسی با حروف اول بین‌المللی</p>
          <Layers className="absolute -bottom-2 -left-2 w-16 h-16 opacity-5 pointer-events-none group-hover:scale-110 transition shrink-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">اسناد فنی و مکاتبات کارگاهی</span>
            <h3 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100 mt-1">{docsCount} سند ممیزی</h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">اصطلاحات تایید متریال، گزارش مغایرت و نقشه‌ها</p>
          <FileText className="absolute -bottom-2 -left-2 w-16 h-16 opacity-5 pointer-events-none group-hover:scale-110 transition shrink-0" />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">کمی و زمانبندی (MSP/EVM)</span>
            <h3 className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100 mt-1">{formulasCount} شاخص علمی</h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">فرمول‌های محاسبه راندمان و کیفیت آنلاین</p>
          <Compass className="absolute -bottom-2 -left-2 w-16 h-16 opacity-5 pointer-events-none group-hover:scale-110 transition shrink-0" />
        </div>

      </div>

      {/* 2. Controls and Live Search Filter Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="جستجوی همزمان واژه فارسی، انگلیسی، مخفف یا استاندارد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm pr-9 pl-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute left-3 top-2 rounded p-0.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>پیشنهاد و افزودن اصطلاح جدید</span>
            </button>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 items-center pt-2 border-t border-slate-100 dark:border-slate-800 text-sm">
          <span className="text-slate-500 ml-2 flex items-center gap-1 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>دسته‌بندی موضوعی:</span>
          </span>
          {[
            { id: 'all', label: 'همه واژگان' },
            { id: 'formulas', label: 'شاخص‌ها و محاسبات فنی' },
            { id: 'documents', label: 'مکاتبات و بایگانی اسناد (DCC)' },
            { id: 'engineering', label: 'امور فنی و کارگاهی' },
            { id: 'it-system', label: 'فناوری و مهندسی سیستم' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* 3. Main Results Display */}
      {filteredGlossaries.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-xl mx-auto space-y-3">
          <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">اصطلاحی یافت نشد</h4>
          <p className="text-xs text-slate-400">
            جستجوی شما با هیچ‌کدام از واژگان تخصصی و مخفف‌های نیروگاهی مطابقت نداشت. می‌توانید عبارت دیگری را تایپ کرده یا واژه جدید را ذخیره فرمایید.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            حذف کلیه فیلترها و نمایش همه
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredGlossaries.map((term) => (
            <div 
              key={term.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-blue-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              
              {/* Card top info */}
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    {term.acronym ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-100 dark:border-blue-900 px-2.5 py-0.5 rounded-md tracking-wider">
                          {term.acronym}
                        </span>
                        <span className="text-xs font-mono text-slate-400 uppercase py-0.5">
                          {term.categoryLabel}
                        </span>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {term.categoryLabel}
                      </span>
                    )}
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-2 font-sans">
                      {term.persianName}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-mono" dir="ltr">
                      {term.englishName}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopy(term)}
                    className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="کپی تعریف فنی"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100/60 dark:border-slate-800/60">
                  <span className="text-xs text-slate-500 block mb-0.5 font-medium">تعریف فنی دقیق:</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {term.definition}
                  </p>
                </div>
              </div>

              {/* Card Bottom details */}
              <div className="pt-3 border-t border-slate-100/60 dark:border-slate-800/60 space-y-2 text-xs">
                
                <div className="flex items-start gap-1">
                  <span className="text-slate-500 shrink-0 font-medium">عملکرد سیستم:</span>
                  <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
                    {term.appUsage}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 px-2.5 py-1.5 rounded">
                  <span className="font-sans">مرجع فنی / استاندارد:</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">{term.standard}</span>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* 4. Support Warning / Note Banner */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-amber-800 dark:text-amber-400">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-1 font-extrabold">راهنمای ممیزی پروژه نیروگاه برق عمران آذرستان</strong>
          <p>
            کلیه لغات و معانی گنجانده شده در این واژه‌نامه توسط بخش کنترل مهندسی (DCC) و منطبق بر مدارک مادر نیروگاه (MDR Rev.3) تبیین شده‌اند. هرگونه انحراف مکاتباتی در جریان RFIها یا NCRها نسبت به کدهای استاندارد ASME و FIDIC ثبت شده در این دایره‌المعارف خطا تلقی خواهد شد.
          </p>
        </div>
      </div>

      {/* 5. ADD TERM SUGGESTION DRAWER / MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-center items-center z-[999] p-4" onClick={() => setShowAddModal(false)}>
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 w-full max-w-xl shadow-2xl space-y-4 text-right transform animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-500" />
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">پیشنهاد و ثبت اصطلاح یا مخفف جدید</h4>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              جهت ارتقاء درک پرسنل و سوپروایزرهای نیروگاه، می‌توانید مخفف یا اصطلاح مدنظر کارگاه را به همراه استاندارد مرجع پیشنهاد دهید تا در پایگاه واژگان درج گردد:
            </p>

            <form onSubmit={handleCreateTerm} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-slate-500 mb-1">حروف اختصاری (مانند NCR):</label>
                  <input
                    type="text"
                    value={newTerm.acronym}
                    onChange={(e) => setNewTerm({ ...newTerm, acronym: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500 font-mono pr-2"
                    placeholder="e.g. MDR"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">دسته‌بندی موضوعی کالا/مفهوم:</label>
                  <select
                    value={newTerm.category}
                    onChange={(e) => setNewTerm({ ...newTerm, category: e.target.value as any })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="documents">مکاتبات و مدیریت اسناد (DCC)</option>
                    <option value="formulas">شاخص‌ها و محاسبات فنی</option>
                    <option value="engineering">امور فنی و کارگاهی</option>
                    <option value="it-system">فناوری و مهندسی سیستم</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-slate-505 dark:text-slate-400 mb-1">ترجمه و اصطلاح دقیق فارسی (<span className="text-red-500">*</span>):</label>
                  <input
                    type="text"
                    required
                    value={newTerm.persianName}
                    onChange={(e) => setNewTerm({ ...newTerm, persianName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500"
                    placeholder="مانند: گزارش عدم انطباق بتن"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">نام کامل انگلیسی:</label>
                  <input
                    type="text"
                    value={newTerm.englishName}
                    onChange={(e) => setNewTerm({ ...newTerm, englishName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500 text-left"
                    placeholder="e.g. Master Document Register"
                    dir="ltr"
                  />
                </div>

              </div>

              <div>
                <label className="block text-slate-505 dark:text-slate-400 mb-1">تعریف کامل فنی و تخصصی (<span className="text-red-500">*</span>):</label>
                <textarea
                  required
                  rows={2}
                  value={newTerm.definition}
                  onChange={(e) => setNewTerm({ ...newTerm, definition: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500"
                  placeholder="توضیح کامل عملکرد، ماهیت مهندسی، زوایا یا فرمول‌ها..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-slate-500 mb-1">عملکرد در این نرم‌افزار / سامانه:</label>
                  <input
                    type="text"
                    value={newTerm.appUsage}
                    onChange={(e) => setNewTerm({ ...newTerm, appUsage: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500"
                    placeholder="مثال: در زبانه RFI به کدهای کارتابل..."
                  />
                </div>

                <div>
                  <label className="block text-slate-500 mb-1">مرجع استاندارد بین‌المللی (مثلا ASME Code):</label>
                  <input
                    type="text"
                    value={newTerm.standard}
                    onChange={(e) => setNewTerm({ ...newTerm, standard: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded p-2 focus:outline-none focus:border-blue-500"
                    placeholder="مثال: ASME Sec VII / ASTM"
                  />
                </div>

              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>ثبت اصطلاح جدید</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
