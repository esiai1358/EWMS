import { 
  LayoutDashboard, 
  Users, 
  Key, 
  GitFork, 
  Briefcase, 
  CheckSquare, 
  FileText, 
  Compass, 
  HelpCircle, 
  AlertOctagon, 
  FolderLock, 
  Sliders, 
  Sparkle, 
  SearchCode, 
  Package, 
  History, 
  ListOrdered, 
  TrendingUp, 
  Award, 
  FileCheck,
  Menu,
  ChevronRight,
  ChevronLeft,
  Building2,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  pendingWfCount: number;
  openNcrCount: number;
  openRfiCount: number;
}

export default function Sidebar({ 
  activeModule, 
  setActiveModule, 
  pendingWfCount, 
  openNcrCount, 
  openRfiCount 
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuSections = [
    {
      title: 'داشبوردهای ارشد',
      items: [
        { id: 'exec-dashboard', name: 'داشبورد مدیریتی کلان', icon: LayoutDashboard },
        { id: 'tech-dashboard', name: 'داشبورد دفتر فنی کارگاه', icon: TrendingUp },
      ]
    },
    {
      title: 'مدیریت و کارتابل',
      items: [
        { id: 'workflows', name: 'کارتابل گردش کار (BPMN)', icon: GitFork, badge: pendingWfCount, badgeColor: 'bg-blue-500' },
        { id: 'users', name: 'کاربران اکتیو دایرکتوری', icon: Users },
        { id: 'roles', name: 'نقش‌ها و کاربری‌ها', icon: Key },
      ]
    },
    {
      title: 'واحد دفتر فنی و طراحان',
      items: [
        { id: 'tech-office', name: 'امور مدارک دفتر فنی', icon: Briefcase },
        { id: 'eng-tasks', name: 'وظایف ارجاعی مهندسین', icon: CheckSquare },
        { id: 'shop-drawings', name: 'نقشه‌های کارگاهی شاپ', icon: FileText },
        { id: 'asbuilt-drawings', name: 'نقشه‌های بیلت نهایی', icon: Compass },
        { id: 'rfi', name: 'درخواست اطلاعات (RFI)', icon: HelpCircle, badge: openRfiCount, badgeColor: 'bg-amber-500' },
      ]
    },
    {
      title: 'کنترل کیفیت و مصالح',
      items: [
        { id: 'ncr', name: 'برگ گزارش مغایرت (NCR)', icon: AlertOctagon, badge: openNcrCount, badgeColor: 'bg-red-500' },
        { id: 'qaqc', name: 'کنترل‌کیفیت بتن و جوش', icon: Sparkle },
        { id: 'materials', name: 'تأییدیه متریال (MIV/MAR)', icon: FileCheck },
      ]
    },
    {
      title: 'زنجیره تامین و کارگاه',
      items: [
        { id: 'proj-control', name: 'کنترل پروژه (SPI/CPI)', icon: Sliders },
        { id: 'warehouse', name: 'موجودی انبار کارگاه', icon: Package },
        { id: 'procurement', name: 'پیش‌فاکتورها و تدارکات', icon: ListOrdered },
        { id: 'daily-reports', name: 'گزارش‌های روزانه کارگاه', icon: History },
      ]
    },
    {
      title: 'ارزیابی و گزارشات',
      items: [
        { id: 'kpi-engine', name: 'موتور محاسباتی کیفیت', icon: SearchCode },
        { id: 'performance', name: 'رتبه‌بندی عملکرد آنلاین', icon: Award },
      ]
    },
    {
      title: 'راهنما و اصطلاحات فنی',
      items: [
        { id: 'glossary', name: 'واژه‌نامه تخصصی و مخفف‌ها', icon: BookOpen },
      ]
    },
    {
      title: 'آرشیو کدهای فنی و سورس',
      items: [
        { id: 'blueprints', name: 'مرکز دانلود سورس و کدهای پایگاه داده', icon: FolderLock },
      ]
    }
  ];

  return (
    <aside 
      className={`relative h-screen bg-slate-900 text-slate-300 border-l border-slate-800 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-72'
      }`}
      id="main-sidebar"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2 overflow-hidden bg-slate-950">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-lg shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="truncate text-right">
              <span className="block text-sm font-bold text-slate-100 tracking-wide font-sans">
                عمران آذرستان
              </span>
              <span className="text-xs text-blue-400 font-mono">
                EWMS Enterprise v1.2
              </span>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="تغییر وضعیت منو"
        >
          {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links inside custom scrollbar */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        {menuSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed && (
              <h2 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 text-right">
                {sec.title}
              </h2>
            )}
            
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive 
                      ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-900/30' 
                      : 'hover:bg-slate-800 hover:text-slate-100/90 text-slate-400'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  
                  {!collapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full text-white font-mono font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Details */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 text-xs text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>تهیه کننده:</span>
            <span className="text-slate-400 font-sans">مهندس اسماعیلی</span>
          </div>
          <div className="flex justify-between">
            <span>سرپرستی آی‌پی:</span>
            <span className="text-slate-400 font-sans">IT-ICT</span>
          </div>
        </div>
      )}
    </aside>
  );
}
