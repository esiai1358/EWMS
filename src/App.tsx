import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ModuleTabContent from './components/ModuleTabContent';
import { mockUsers } from './data/mockData';

export default function App() {
  const [activeModule, setActiveModule] = useState('exec-dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null);

  // Apply dark class to document body
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Current logged in user details synced is ICT Supervisor مهدی اسماعیلی
  const currentUser = mockUsers[0]; // m.esmaeili

  const activeModuleTitle = () => {
    switch(activeModule) {
      case 'exec-dashboard': return 'داشبورد ارشد مدیران ارشد';
      case 'tech-dashboard': return 'داشبورد کنترل محاسباتی دفتر فنی';
      case 'workflows': return 'کارتابل فرآیندهای مهندسی کارگاه (BPMN)';
      case 'users': return 'مدیریت پرسنل و کاربران اکتیو دایرکتوری';
      case 'roles': return 'ماتریس نقش‌ها و سطوح دسترسی (RBAC)';
      case 'tech-office': return 'مدیریت مدارک و اسناد دفتر فنی';
      case 'eng-tasks': return 'برنامه‌ریزی و ارجاع وظایف مهندسی';
      case 'shop-drawings': return 'ژورنال کنترل شاپ نقشه‌های کارگاه';
      case 'asbuilt-drawings': return 'آرشیو نقشه‌های وضع موجود (As-Built)';
      case 'rfi': return 'مدیریت درخواست‌های اطلاعات کارگاهی (RFI)';
      case 'ncr': return 'گزارش‌های بازرسی و عدم انطباق بتن/جوش (NCR)';
      case 'qaqc': return 'آزمایشگاه کنترل کیفی بتن ریزی و التراسونیک';
      case 'materials': return 'سابمیتال تأیید متریال کارگاهی (MAR)';
      case 'proj-control': return 'تحلیل زمانی و بودجه پروژه (MSP/Primavera)';
      case 'warehouse': return 'دفتر معین انبارداری و مصالح کارگاه';
      case 'procurement': return 'درخواست‌های خرید کالا و پیش‌فاکتور طراح';
      case 'daily-reports': return 'گزارش‌های روزانه فعالیت فنی کارگاه';
      case 'kpi-engine': return 'پارس‌کننده فرمول‌ها و موتور KPI';
      case 'performance': return 'ارزیابی کیفی پرسنل طراح پروژه نیروگاه';
      case 'blueprints': return 'مرکز صادرات کدهای بک‌اند C# و SQL Server';
      case 'glossary': return 'واژه‌نامه تخصصی و اصطلاحات فنی کارگاه';
      default: return 'مدیریت فرآیندها';
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 custom-grid-bg" id="master-app-root">
      
      {/* Main Workspace Frame - Placed on the right under RTL layout flow */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden" id="workspace-container">
        
        {/* Top Header */}
        <Header 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          currentUser={currentUser}
          activeModuleName={activeModuleTitle()}
          onSelectModule={setActiveModule}
          onSelectWorkflow={setSelectedWorkflowId}
        />

        {/* Dynamic Tab Workspace Content area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950/70" style={{ scrollbarWidth: 'thin' }}>
          
          {/* Main Title Banner info */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-5 rounded-2xl shadow-sm">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">عمران آذرستان - پروژه احداث نیروگاه سیکل ترکیبی برق</p>
              <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                {activeModuleTitle()}
              </h2>
            </div>
            
            <div className="text-left" dir="ltr">
              <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400">سند کنترل کیفی نیروگاهی</span>
              <span className="block text-xs text-slate-400 mt-0.5 font-mono">تهیه‌کننده: مهندس مهدی اسماعیلی</span>
            </div>
          </div>

          <ModuleTabContent 
            activeModuleId={activeModule} 
            currentUser={currentUser} 
            externalSelectedWfId={selectedWorkflowId}
            onExternalWfSelected={setSelectedWorkflowId}
          />
        </main>

      </div>

      {/* Sidebar Navigation - Placed on the left under RTL layout flow */}
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        pendingWfCount={1}
        openNcrCount={2}
        openRfiCount={2}
      />
    </div>
  );
}
