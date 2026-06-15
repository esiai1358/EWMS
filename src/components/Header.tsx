import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, ShieldCheck, Clock, HardDrive, RefreshCw, Search, X, Layers, GitFork } from 'lucide-react';
import { AppUser } from '../types';
import { mockWorkflows } from '../data/mockData';

const ALL_MODULES = [
  { id: 'exec-dashboard', name: 'داشبورد مدیریتی کلان', section: 'داشبوردهای ارشد' },
  { id: 'tech-dashboard', name: 'داشبورد دفتر فنی کارگاه', section: 'داشبوردهای ارشد' },
  { id: 'workflows', name: 'کارتابل گردش کار (BPMN)', section: 'مدیریت و کارتابل' },
  { id: 'users', name: 'کاربران اکتیو دایرکتوری', section: 'مدیریت و کارتابل' },
  { id: 'roles', name: 'نقش‌ها و کاربری‌ها', section: 'مدیریت و کارتابل' },
  { id: 'tech-office', name: 'امور مدارک دفتر فنی', section: 'واحد دفتر فنی و طراحان' },
  { id: 'eng-tasks', name: 'وظایف ارجاعی مهندسین', section: 'واحد دفتر فنی و طراحان' },
  { id: 'shop-drawings', name: 'نقشه‌های کارگاهی شاپ', section: 'واحد دفتر فنی و طراحان' },
  { id: 'asbuilt-drawings', name: 'نقشه‌های بیلت نهایی', section: 'واحد دفتر فنی و طراحان' },
  { id: 'rfi', name: 'درخواست اطلاعات (RFI)', section: 'واحد دفتر فنی و طراحان' },
  { id: 'ncr', name: 'برگ گزارش مغایرت (NCR)', section: 'کنترل کیفیت و مصالح' },
  { id: 'qaqc', name: 'کنترل‌کیفیت بتن و جوش', section: 'کنترل کیفیت و مصالح' },
  { id: 'materials', name: 'تأییدیه متریال (MIV/MAR)', section: 'کنترل کیفیت و مصالح' },
  { id: 'proj-control', name: 'کنترل پروژه (SPI/CPI)', section: 'زنجیره تامین و کارگاه' },
  { id: 'warehouse', name: 'موجودی انبار کارگاه', section: 'زنجیره تامین و کارگاه' },
  { id: 'procurement', name: 'پیش‌فاکتورها و تدارکات', section: 'زنجیره تامین و کارگاه' },
  { id: 'daily-reports', name: 'گزارش‌های روزانه کارگاه', section: 'زنجیره تامین و کارگاه' },
  { id: 'kpi-engine', name: 'موتور محاسباتی کیفیت', section: 'ارزیابی و گزارشات' },
  { id: 'performance', name: 'رتبه‌بندی عملکرد آنلاین', section: 'ارزیابی و گزارشات' },
  { id: 'glossary', name: 'واژه‌نامه تخصصی و مخفف‌ها', section: 'راهنما و اصطلاحات فنی' },
  { id: 'blueprints', name: 'مرکز دانلود سورس و کدهای پایگاه داده', section: 'آرشیو کدهای فنی و سورس' },
];

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentUser: AppUser;
  activeModuleName: string;
  onSelectModule: (module: string) => void;
  onSelectWorkflow?: (workflowId: string) => void;
}

export default function Header({ 
  darkMode, 
  setDarkMode, 
  currentUser, 
  activeModuleName, 
  onSelectModule,
  onSelectWorkflow 
}: HeaderProps) {
  const [time, setTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const optionsDate: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long',
        timeZone: 'Asia/Tehran'
      };
      const optionsTime: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Tehran'
      };
      
      const pDate = new Intl.DateTimeFormat('fa-IR', optionsDate).format(now);
      const pTime = new Intl.DateTimeFormat('fa-IR', optionsTime).format(now);
      setTime(`${pDate} | ${pTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const cleanQuery = searchQuery.trim().toLowerCase();

  const filteredModules = cleanQuery
    ? ALL_MODULES.filter(m => 
        m.name.toLowerCase().includes(cleanQuery) || 
        m.section.toLowerCase().includes(cleanQuery)
      )
    : [];

  const filteredWorkflows = cleanQuery
    ? mockWorkflows.filter(w => 
        w.title.toLowerCase().includes(cleanQuery) ||
        w.id.toLowerCase().includes(cleanQuery) ||
        w.creator.toLowerCase().includes(cleanQuery) ||
        w.description.toLowerCase().includes(cleanQuery)
      )
    : [];

  const hasResults = filteredModules.length > 0 || filteredWorkflows.length > 0;

  return (
    <header className="sticky top-0 z-30 flex flex-col lg:flex-row items-center justify-between px-6 py-3 border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors duration-200 shadow-sm gap-4">
      {/* Module Title and Information */}
      <div className="flex items-center gap-3 w-full lg:w-auto shrink-0" id="header-left">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <HardDrive className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-base lg:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>{activeModuleName}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            سامانه EWMS عمران آذرستان - نیروگاه سیکل ترکیبی برق
          </p>
        </div>
      </div>

      {/* Dynamic modules/workflows search bar */}
      <div ref={containerRef} className="relative w-full max-w-sm lg:max-w-md" id="header-search">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="جستجو در بخش‌ها و گردش‌کارها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full pr-10 pl-10 py-1.5 rounded-xl border bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans text-right"
            dir="rtl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              title="پاک کردن متن"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown containing results */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 left-0 mt-2 max-h-[26rem] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-2 text-right div-with-scrollbar" dir="rtl">
            {cleanQuery === '' ? (
              <div>
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                  میانبر‌های پرکاربرد مهندسی
                </div>
                {[
                  { id: 'exec-dashboard', name: 'داشبورد مدیریتی کلان', section: 'داشبوردهای ارشد' },
                  { id: 'workflows', name: 'کارتابل گردش کار (BPMN)', section: 'مدیریت و کارتابل' },
                  { id: 'daily-reports', name: 'گزارش‌های روزانه کارگاه', section: 'زنجیره تامین و کارگاه' },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModule(m.id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs lg:text-sm rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-right"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>{m.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{m.section}</span>
                  </button>
                ))}
              </div>
            ) : hasResults ? (
              <div className="space-y-4">
                {/* Modules Results */}
                {filteredModules.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                      بخش‌ها و ماژول‌ها ({filteredModules.length})
                    </div>
                    {filteredModules.map(m => (
                      <button
                        key={m.id}
                        onClick={() => {
                          onSelectModule(m.id);
                          setSearchQuery('');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs lg:text-sm rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-right"
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          <span className="truncate">{m.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{m.section}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Workflows Results */}
                {filteredWorkflows.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-xs font-bold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 mb-1">
                      سندهای گردش کار جریان کار ({filteredWorkflows.length})
                    </div>
                    {filteredWorkflows.map(w => (
                      <button
                        key={w.id}
                        onClick={() => {
                          onSelectModule('workflows');
                          if (onSelectWorkflow) onSelectWorkflow(w.id);
                          setSearchQuery('');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex flex-col items-start px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition text-right gap-1"
                      >
                        <div className="w-full flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-xs lg:text-sm min-w-0">
                            <GitFork className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">{w.title}</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 shrink-0 font-mono">
                            {w.id}
                          </span>
                        </div>
                        <div className="w-full flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
                          <span className="truncate max-w-[70%]">{w.description}</span>
                          <span className="shrink-0">{w.creator}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500">
                موردی برای عبارت "{searchQuery}" یافت نشد.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Clock Widget */}
      <div className="hidden xl:flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-xs">
        <Clock className="w-4 h-4 text-blue-500" />
        <span style={{ color: '#cde35e', fontWeight: 'bold', textAlign: 'center', fontFamily: 'system-ui', width: '310px', height: '30px', paddingLeft: '0px', marginLeft: '0px', marginRight: '0px', fontSize: '15px', lineHeight: '30px', display: 'inline-block' }}>{time}</span>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-end" id="header-right">
        {/* AD Sync Tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>کربروس AD متصل</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
          title={darkMode ? "حالت روز" : "حالت شب"}
          id="theme-toggler"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Sync Button */}
        <button
          onClick={() => alert('مجموعه داده‌ها و کدهای وب‌سرویس با هاست IIS همگام‌سازی شد.')}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
          title="بروزرسانی داده‌ها"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-2 pl-2 border-r border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow">
            {currentUser.fullName.split(' ').pop()?.charAt(0) || 'م'}
          </div>
          <div className="hidden xl:block text-right">
            <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200 col-span-1">
              {currentUser.fullName}
            </span>
            <span className="block text-xs text-slate-400 mt-0.5">
              {currentUser.position}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
