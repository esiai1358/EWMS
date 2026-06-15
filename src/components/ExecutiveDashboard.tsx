import React, { useState, useEffect } from 'react';
import { ResponsiveGridLayout, useContainerWidth } from 'react-grid-layout';
import { 
  mockUsers, 
  mockWorkflows, 
  mockTasks, 
  mockNcrs, 
  mockProjectMetrics, 
  mockDailyReports 
} from '../data/mockData';
import BpmVisualizer from './BpmVisualizer';
import SummaryKpi from './SummaryKpi';
import { 
  Grid, Lock, Unlock, RotateCcw, Save, Plus, Trash2, Settings, 
  Activity, CheckSquare, Layers, Eye, Download, AlertTriangle, 
  TrendingUp, BarChart3, HelpCircle, X, ChevronRight, Play, Info
} from 'lucide-react';

// Local Storage Keys
const LAYOUT_STORAGE_KEY = 'azarestan_exec_layout_config';
const VISIBLE_WIDGETS_KEY = 'azarestan_exec_widgets_visible';

interface Widget {
  id: string;
  name: string;
  category: 'metrics' | 'tables' | 'charts' | 'feed' | 'custom';
  description: string;
}

// All available widgets definition
const AVAILABLE_WIDGETS: Widget[] = [
  { id: 'metric-total-projects', name: 'کارت: مجموع پروژه‌های نیروگاه', category: 'metrics', description: 'نمایش کل زیرپروژه‌های فعال در کارگاه نیروگاهی' },
  { id: 'metric-tasks', name: 'کارت: وضعیت وظایف فنی کارگاه', category: 'metrics', description: 'تعداد کل تسک‌های مهندسی فعال و دارای تاخیر' },
  { id: 'metric-ncrs', name: 'کارت: گزارشات عدم انطباق (NCR)', category: 'metrics', description: 'تعداد پرونده‌های کیفی بتن‌ریزی و عملیات جوش باز' },
  { id: 'metric-efficiency', name: 'کارت: میانگین بهره‌وری مهندسین', category: 'metrics', description: 'درصد عملکرد و راندمان زمانی پرسنل مستقر در کارگاه' },
  { id: 'workflows-visualizer', name: 'ماژول: کارتابل فرآیندهای مهندسی (BPMN)', category: 'tables', description: 'امکان پایش فرآیندهای تایید مدرک و نقشه کارگاهی' },
  { id: 'project-progress', name: 'مسترویو: جدول پیشرفت زمانی و مالی', category: 'tables', description: 'نمای یکپارچه شاخص‌های SPI ،CPI و مغایرت بودجه مصوب پروژه‌ها' },
  { id: 'recent-activities', name: 'تایم‌لاین: آخرین رویدادها و گزارشات روزانه', category: 'feed', description: 'جریان زنده وقایع ابلاغی توسط سرپرست دفتر فنی و کارگاه' },
  { id: 'cost-variance-chart', name: 'نمودار: انحراف هزینه و راندمان مالی', category: 'charts', description: 'تجسم گرافیکی سودآوری یا بیش‌هزینه هر زیرسازه نیروگاه' },
  { id: 'discipline-submittals', name: 'نمودار: دیسیپلین مدارک مهندسی به تفکیک', category: 'charts', description: 'توزیع کیفی نقشه‌ها و مدارک دریافتی در قالب دیسپلین های فنی' }
];

// Default grid positions
const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'metric-total-projects', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-tasks', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-ncrs', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'metric-efficiency', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'workflows-visualizer', x: 0, y: 2, w: 12, h: 5.5, minW: 6, minH: 4 },
    { i: 'project-progress', x: 4, y: 7.5, w: 8, h: 5.5, minW: 6, minH: 4 },
    { i: 'recent-activities', x: 0, y: 7.5, w: 4, h: 5.5, minW: 3, minH: 4 },
    { i: 'cost-variance-chart', x: 6, y: 13, w: 6, h: 4.5, minW: 4, minH: 3 },
    { i: 'discipline-submittals', x: 0, y: 13, w: 6, h: 4.5, minW: 4, minH: 3 }
  ],
  md: [
    { i: 'metric-total-projects', x: 6, y: 0, w: 6, h: 2 },
    { i: 'metric-tasks', x: 0, y: 0, w: 6, h: 2 },
    { i: 'metric-ncrs', x: 6, y: 2, w: 6, h: 2 },
    { i: 'metric-efficiency', x: 0, y: 2, w: 6, h: 2 },
    { i: 'workflows-visualizer', x: 0, y: 4, w: 12, h: 5.5 },
    { i: 'project-progress', x: 0, y: 9.5, w: 12, h: 5.5 },
    { i: 'recent-activities', x: 0, y: 15, w: 12, h: 4.5 },
    { i: 'cost-variance-chart', x: 6, y: 19.5, w: 6, h: 4.5 },
    { i: 'discipline-submittals', x: 0, y: 19.5, w: 6, h: 4.5 }
  ]
};

const DEFAULT_VISIBLE_WIDGETS = [
  'metric-total-projects',
  'metric-tasks',
  'metric-ncrs',
  'metric-efficiency',
  'workflows-visualizer',
  'project-progress',
  'recent-activities',
  'cost-variance-chart',
  'discipline-submittals'
];

interface ExecutiveDashboardProps {
  currentUser: any;
}

export default function ExecutiveDashboard({ currentUser }: ExecutiveDashboardProps) {
  const { width, containerRef } = useContainerWidth();
  
  // States
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [layouts, setLayouts] = useState<any>(() => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved layout", e);
      }
    }
    return JSON.parse(JSON.stringify(DEFAULT_LAYOUTS));
  });

  const [visibleWidgetIds, setVisibleWidgetIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(VISIBLE_WIDGETS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse visible widgets", e);
      }
    }
    return [...DEFAULT_VISIBLE_WIDGETS];
  });

  const [activeTasks, setActiveTasks] = useState(0);
  const [delayedTasks, setDelayedTasks] = useState(0);
  const [openNcrs, setOpenNcrs] = useState(0);
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Load KPI data from mock
  useEffect(() => {
    const active = mockTasks.filter(t => t.status !== 'Completed').length;
    const delayed = mockTasks.filter(t => t.status === 'Delayed').length;
    const ncrsCount = mockNcrs.filter(n => n.status !== 'Closed').length;
    setActiveTasks(active);
    setDelayedTasks(delayed);
    setOpenNcrs(ncrsCount);
  }, []);

  // Show notification assistant helper
  const triggerNotification = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 3000);
  };

  // Handle Workflow item callback
  const handleUpdateWf = (updated: any) => {
    setWorkflows(workflows.map(w => w.id === updated.id ? updated : w));
    triggerNotification('فرآیند گردش مدرک با موفقیت بروزرسانی شد.');
  };

  // Save current layouts & visible settings
  const handleSaveConfig = () => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layouts));
    localStorage.setItem(VISIBLE_WIDGETS_KEY, JSON.stringify(visibleWidgetIds));
    setIsLocked(true);
    triggerNotification('پیکربندی چیدمان داشبورد ارشد کارگاه با موفقیت ذخیره شد.');
  };

  // Reset to default layout settings
  const handleResetLayout = () => {
    if (window.confirm('آیا مایل به بازنشانی چیدمان ابزارک‌ها به حالت اولیه پیش‌فرض عمران آذرستان هستید؟')) {
      setLayouts(JSON.parse(JSON.stringify(DEFAULT_LAYOUTS)));
      setVisibleWidgetIds([...DEFAULT_VISIBLE_WIDGETS]);
      setIsLocked(true);
      localStorage.removeItem(LAYOUT_STORAGE_KEY);
      localStorage.removeItem(VISIBLE_WIDGETS_KEY);
      triggerNotification('چیدمان داشبورد با موفقیت به حالت کارخانه‌ای مدیریت بازنشانی شد.');
    }
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (id: string) => {
    if (visibleWidgetIds.includes(id)) {
      if (visibleWidgetIds.length <= 1) {
        alert('حداقل نمایش یک ابزارک فعال جهت پایش الزامی می‌باشد!');
        return;
      }
      setVisibleWidgetIds(visibleWidgetIds.filter(wId => wId !== id));
      triggerNotification('ابزارک انتخابی موقتاً غیرفعال گردید.');
    } else {
      setVisibleWidgetIds([...visibleWidgetIds, id]);
      triggerNotification('ابزارک با موفقیت به فضای کاری مدیریت الحاق شد.');
    }
  };

  // Layout change handler triggering state update
  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
  };

  // Export excel simulator
  const handleExportSim = (name: string) => {
    alert(`سامانه در حال صدور اکسپورت Excel برای لیست ${name} است. فایل فشرده حاوی شیت‌ها بارگیری خواهد شد.`);
  };

  return (
    <div className="space-y-6" id="dashboard-grid-interactive-root">
      
      {/* Dynamic Floating Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 md:right-80 bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-3 rounded-xl shadow-xl border border-slate-700 dark:border-slate-200 z-[9999] flex items-center gap-3 animate-fade-in font-sans text-xs font-bold leading-relaxed">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Summary KPI Panel */}
      <SummaryKpi onTriggerNotification={triggerNotification} />

      {/* Controller Controls Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              داشبورد هوشمند با چیدمان پویا (RGL)
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">React v19</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">ابزارک‌ها را با کشیدن و رها کردن دلخواه جابجا کرده یا سایز آن‌ها را تغییر دهید.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Lock / Unlock Toggle Button */}
          <button
            onClick={() => {
              setIsLocked(!isLocked);
              triggerNotification(isLocked ? 'حالت ویرایش چیدمان فعال شد. ابزارک‌ها را بکشید.' : 'حالت ویرایش غیرفعال شد.');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isLocked 
                ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700' 
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-500/10'
            }`}
          >
            {isLocked ? (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>ویرایش چیدمان کنونی</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>قفل و قفل کردن تغییرات</span>
              </>
            )}
          </button>

          {/* Configuration Trigger */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>مدیریت ابزارک‌ها ({visibleWidgetIds.length})</span>
          </button>

          {/* Reset position Button */}
          <button
            onClick={handleResetLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/30 dark:hover:text-red-400 text-xs font-bold transition"
            title="بازگشت به چیدمان اولیه"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پیش‌فرض کارخانه</span>
          </button>

          {/* Save Button explicitly if modified */}
          {!isLocked && (
            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-black shadow-md shadow-blue-600/15"
            >
              <Save className="w-3.5 h-3.5" />
              <span>ذخيره موقعیت نهایی</span>
            </button>
          )}
        </div>
      </div>

      {/* Widget Control Side-Drawer Model */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-[999] p-4" onClick={() => setShowConfigModal(false)}>
          <div 
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-right transform animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-500" />
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">مدیریت لایه‌ها و ابزارک‌های انتخابی</h4>
              </div>
              <button 
                onClick={() => setShowConfigModal(false)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              ابزارک‌هایی که می‌خواهید در صفحه نمایش فرآیندهای ارشد مدیریت نیروگاه در دسترس باشند را فعال یا موقتاً خاموش کنید:
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
              {AVAILABLE_WIDGETS.map((widget) => {
                const isChecked = visibleWidgetIds.includes(widget.id);
                return (
                  <div 
                    key={widget.id} 
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                      isChecked 
                        ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-900 text-slate-800 dark:text-slate-100 font-bold' 
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{widget.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">{widget.description}</span>
                    </div>

                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                      isChecked ? 'bg-blue-650 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setVisibleWidgetIds([...DEFAULT_VISIBLE_WIDGETS])}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 font-bold text-xs"
              >
                فعالسازی همه
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-extrabold text-xs"
              >
                بستن و اعمال
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout Canvas */}
      <div 
        ref={containerRef as unknown as React.RefObject<HTMLDivElement>}
        className={`relative ${!isLocked ? 'ring-2 ring-dashed ring-amber-400/40 bg-amber-500/[0.01] rounded-2xl p-1' : ''}`}
        id="executive-grid-framework"
      >
        {/* Editing Mode Accent Indicator */}
        {!isLocked && (
          <div className="absolute top-2 left-2 z-50 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-md flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-ping" />
            <span>حالت جابجایی ابزارک‌ها فعال است. برای ثبت به صورت نهایی روی قفل چیدمان کلیک کنید.</span>
          </div>
        )}

        <ResponsiveGridLayout
          width={width || 1200}
          layouts={layouts}
          onLayoutChange={onLayoutChange}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={65}
          margin={[16, 16]}
          className="layout transition-all"
          dragConfig={{
            enabled: !isLocked,
            handle: '.widget-drag-handle',
            threshold: 3
          }}
          resizeConfig={{
            enabled: !isLocked,
            handles: ['se']
          }}
        >
          {/* 1. Metric Widget: Total Projects */}
          {visibleWidgetIds.includes('metric-total-projects') && (
            <div 
              key="metric-total-projects" 
              className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-sm border border-blue-500 flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-blue-100 uppercase tracking-wide">مجموع پروژه‌های نیروگاه</span>
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-blue-200 hover:text-white rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <span className="text-3xl font-black font-mono">۴ پروژه اصلی</span>
                </div>
                <span className="text-xs text-blue-100">فونداسیون، بویلر، پست برق، ابزار دقیق</span>
              </div>
              <div className="absolute -bottom-2 -left-2 opacity-10 pointer-events-none group-hover:scale-110 transition duration-300">
                <Layers className="w-20 h-20 text-white" />
              </div>
            </div>
          )}

          {/* 2. Metric Widget: Pending Tasks */}
          {visibleWidgetIds.includes('metric-tasks') && (
            <div 
              key="metric-tasks" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">وظایف فنی تحت پایش کارگاه</span>
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-800 dark:text-slate-100 font-mono">{mockTasks.length} تسک</span>
                  <span className="text-xs text-emerald-500 font-extrabold flex items-center">فعال: {activeTasks}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>منطبق با چارت زمانبندی MSP</span>
                  {delayedTasks > 0 && <span className="text-red-500 font-semibold">{delayedTasks} تسک با تأخیر بحرانی</span>}
                </div>
              </div>
              <div className="absolute -bottom-2 -left-2 opacity-5 pointer-events-none group-hover:scale-110 transition duration-300">
                <CheckSquare className="w-20 h-20 text-slate-900 dark:text-white" />
              </div>
            </div>
          )}

          {/* 3. Metric Widget: NCR Status */}
          {visibleWidgetIds.includes('metric-ncrs') && (
            <div 
              key="metric-ncrs" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">گزارشات عدم انطباق (NCR)</span>
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <span className={`text-3xl font-black font-mono ${openNcrs > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>{openNcrs} پرونده باز</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">نیاز به PWHT و تست عیار بتن کارگاه</span>
              </div>
              <div className="absolute -bottom-2 -left-2 opacity-5 pointer-events-none group-hover:scale-110 transition duration-300">
                <AlertTriangle className="w-20 h-20 text-red-500" />
              </div>
            </div>
          )}

          {/* 4. Metric Widget: Engineer Performance */}
          {visibleWidgetIds.includes('metric-efficiency') && (
            <div 
              key="metric-efficiency" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden relative group"
            >
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">میانگین بهره‌وری مهندسین</span>
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-4 h-4" />
                  </div>
                </div>
                <div className="my-2">
                  <span className="text-3xl font-black text-emerald-500 font-mono">۹۲.۴٪</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">برترین رتبه تیمی کارگاهی عمران آذرستان</span>
              </div>
              <div className="absolute -bottom-2 -left-2 opacity-5 pointer-events-none group-hover:scale-110 transition duration-300">
                <TrendingUp className="w-20 h-20 text-emerald-500" />
              </div>
            </div>
          )}

          {/* 5. Central Large Widget: BPMN Workflows */}
          {visibleWidgetIds.includes('workflows-visualizer') && (
            <div 
              key="workflows-visualizer" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col overflow-hidden"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">کارتابل فرآیندهای مهندسی کارگاه (BPMN)</h4>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">پایش لحظه‌ای گردش مدارک</span>
              </div>
              <div className="flex-1 overflow-auto p-4" style={{ scrollbarWidth: 'thin' }}>
                <BpmVisualizer workflowList={workflows} updateWorkflow={handleUpdateWf} currentUser={currentUser} />
              </div>
            </div>
          )}

          {/* 6. Mid-Sized Widget: Master Project Progress */}
          {visibleWidgetIds.includes('project-progress') && (
            <div 
              key="project-progress" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col overflow-hidden animate-fade-in"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">پایش مالی و زمانی پروژه‌ها (SPI/CPI)</h4>
                </div>
                <button 
                  onClick={() => handleExportSim('شاخص های برنامه ای')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <Download className="w-3 h-3" />
                  <span>دانلود گزارش اکسل</span>
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <table className="w-full text-right text-sm">
                  <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <tr className="bg-slate-50 dark:bg-slate-950/40 text-xs text-slate-600 dark:text-slate-400">
                      <th className="py-2.5 px-3">عنوان زیرپروژه نیروگاهی</th>
                      <th className="py-2.5 px-3">پیشرفت MSP</th>
                      <th className="py-2.5 px-3">پیشرفت واقعی</th>
                      <th className="py-2.5 px-3 font-mono">SPI</th>
                      <th className="py-2.5 px-3 font-mono">CPI</th>
                      <th className="py-2.5 px-3">بودجه (میلیارد ریال)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {mockProjectMetrics.map((met) => {
                      const isSpiDelayed = met.spi < 1.0;
                      const isCpiOverrun = met.cpi < 1.0;
                      return (
                        <tr key={met.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100">{met.projectName}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{met.plannedProgress}%</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${met.actualProgress}%` }} />
                              </div>
                              <span className="font-mono">{met.actualProgress}%</span>
                            </div>
                          </td>
                          <td className={`py-2.5 px-3 font-mono font-bold ${isSpiDelayed ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {met.spi}
                          </td>
                          <td className={`py-2.5 px-3 font-mono font-bold ${isCpiOverrun ? 'text-red-500' : 'text-emerald-500'}`}>
                            {met.cpi}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">{met.budget}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. Mid-Sized Widget: Recent Reports Feed */}
          {visibleWidgetIds.includes('recent-activities') && (
            <div 
              key="recent-activities" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col overflow-hidden"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">جریان گزارش‌های روزانه کارگاه</h4>
                </div>
                <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
                {mockDailyReports.map((report) => (
                  <div key={report.id} className="relative pl-3 border-l-2 border-blue-100 dark:border-slate-800 pb-1.5 last:pb-0">
                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-slate-900" />
                    <div className="flex justify-between items-center text-sm text-slate-400 dark:text-slate-500 mb-1">
                      <span className="font-bold">{report.reportDate}</span>
                      <span>تهیه‌کننده: {report.preparedBy}</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-normal">{report.weatherCondition}</h5>
                    <p className="text-sm text-slate-650 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{report.keyActivities}</p>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">نیروی انسانی: {report.contractorWorkers} نفر</span>
                      {report.concreteVolume > 0 && (
                        <span className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 px-1.5 py-0.5 rounded">بتن‌ریزی: {report.concreteVolume} متر مکعب</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. Bottom Chart Widget: Cost Variance Breakdown */}
          {visibleWidgetIds.includes('cost-variance-chart') && (
            <div 
              key="cost-variance-chart" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col overflow-hidden"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-700 dark:text-slate-300">تحلیلی مغایرت و انحراف بودجه ساخت</h4>
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="space-y-3">
                  {mockProjectMetrics.map((met) => {
                    const isNegative = met.costVariance < 0;
                    const maxVariance = 40; // Max visual range
                    const absPercentage = Math.min((Math.abs(met.costVariance) / maxVariance) * 100, 100);
                    return (
                      <div key={met.id} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="truncate text-slate-700 dark:text-slate-300 max-w-[200px]">{met.projectName.replace('نیروگاه برق آذرستان', '')}</span>
                          <span className={`font-mono font-bold ${isNegative ? 'text-red-500' : 'text-emerald-500'}`}>
                            {met.costVariance > 0 ? `+${met.costVariance}` : met.costVariance} ریال (میلیارد)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-md flex overflow-hidden">
                          {isNegative ? (
                            <div className="flex-1 flex justify-end">
                              <div className="bg-red-500 h-full rounded-r" style={{ width: `${absPercentage}%` }} />
                            </div>
                          ) : (
                            <div className="flex-1 flex justify-start">
                              <div className="bg-emerald-500 h-full rounded-l" style={{ width: `${absPercentage}%` }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[9px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />سودآور (انحراف مثبت)</span>
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />بیش‌هزینه (کاهش بودجه)</span>
                </div>
              </div>
            </div>
          )}

          {/* 9. Bottom Chart Widget: Discipline Submittals Sub-analyis */}
          {visibleWidgetIds.includes('discipline-submittals') && (
            <div 
              key="discipline-submittals" 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col overflow-hidden"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className={`widget-drag-handle cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded transition ${isLocked ? 'hidden' : 'block'}`}>
                    <Grid className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">ماتریس دیسیپلین نقشه‌ها و مدارک کارگاه</h4>
                </div>
                <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between text-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">پراکندگی حجم تولید اسناد فنی تایید شده سالن بویلر اصلی و تجهیزات فرعی:</p>
                <div className="grid grid-cols-4 gap-2 items-end flex-1 min-h-[100px] pb-2">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/40 rounded-t h-16 flex items-end justify-center transition-all">
                      <div className="w-1/2 bg-blue-600 rounded-t h-[75%]" />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300">CIVIL</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/40 rounded-t h-16 flex items-end justify-center transition-all">
                      <div className="w-1/2 bg-indigo-600 rounded-t h-[90%]" />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300">MECH</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/40 rounded-t h-16 flex items-end justify-center transition-all">
                      <div className="w-1/2 bg-cyan-600 rounded-t h-[55%]" />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300">ELECT</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/40 rounded-t h-16 flex items-end justify-center transition-all">
                      <div className="w-1/2 bg-teal-600 rounded-t h-[35%]" />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-300">PIPING</span>
                  </div>
                </div>
                <div className="text-xs text-left text-slate-400 font-mono mt-1" dir="ltr">
                  Total documents analyzed: 382 MAR/AsBuilt
                </div>
              </div>
            </div>
          )}

        </ResponsiveGridLayout>
      </div>

    </div>
  );
}
