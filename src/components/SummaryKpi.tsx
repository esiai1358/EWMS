import { useState, useEffect } from 'react';
import { Clock, TrendingUp, RefreshCw, Activity, FileText, AlertCircle, ArrowUpRight, HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import { mockRfis } from '../data/mockData';

interface SummaryKpiProps {
  onTriggerNotification?: (msg: string) => void;
}

export default function SummaryKpi({ onTriggerNotification }: SummaryKpiProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Real-time statistics state
  const [metrics, setMetrics] = useState({
    engineeringProgress: 84.62,
    plannedProgress: 86.10,
    rfiTurnaroundHours: 32.4,
    totalRfiCount: mockRfis.length,
    pendingRfisCount: mockRfis.filter(r => r.status !== 'Closed').length,
    activeSubmittals: 14,
    completedSubmittals: 112,
  });

  // Simulated live decimal incremental progress ticks
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => {
        // Realistically increment progress by small decimals
        const nextEngProgress = prev.engineeringProgress >= 99.9 
          ? 84.62 
          : prev.engineeringProgress + (Math.random() * 0.005);
        
        // Randomly fluctuate turnaround hours slightly between 31.8 and 33.5
        const nextTurnaround = Math.max(31.5, Math.min(34.2, prev.rfiTurnaroundHours + (Math.random() * 0.2 - 0.1)));

        return {
          ...prev,
          engineeringProgress: parseFloat(nextEngProgress.toFixed(4)),
          rfiTurnaroundHours: parseFloat(nextTurnaround.toFixed(1)),
        };
      });
      setLastUpdated(new Date());
    }, 6000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle manual data fetching simulation
  const handleFetchData = () => {
    setIsSyncing(true);
    if (onTriggerNotification) {
      onTriggerNotification('در حال استعلام آخرین وضعیت مدارک از کارگاه و دفتر مرکزی...');
    }
    
    setTimeout(() => {
      setIsSyncing(false);
      setMetrics(prev => ({
        ...prev,
        engineeringProgress: parseFloat((84.62 + Math.random() * 0.15).toFixed(4)),
        rfiTurnaroundHours: parseFloat((31.5 + Math.random() * 1.5).toFixed(1)),
        pendingRfisCount: mockRfis.filter(r => r.status !== 'Closed').length,
      }));
      setLastUpdated(new Date());
      if (onTriggerNotification) {
        onTriggerNotification('شاخص‌های کلیدی فاز مهندسی و زمان‌پاسخ دهی RFI با موفقیت به‌روزرسانی شد.');
      }
    }, 950);
  };

  const handleUrgentFollowup = (rfiNo: string) => {
    if (onTriggerNotification) {
      onTriggerNotification(`هشدار ویژه و پیامک فوری در شبکه دفتر فنی برای پرونده ${rfiNo} با موفقیت ارسال گردید.`);
    }
  };

  const engineeringDelay = (metrics.plannedProgress - metrics.engineeringProgress).toFixed(2);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-5 space-y-5" dir="rtl" id="summary-kpi-root">
      
      {/* KPI Top Bar: Sync status and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              شاخص‌های زنده و تحلیل عملکرد فاز مهندسی نیروگاه
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 animate-pulse font-mono">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                متصل به مرکز مخابرات وب‌سرویس (LIVE)
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              پایش لحظه‌ای سرعت پردازش مدارک شاپ فونداسیون، بویلر، و ترن‌اراند RFIهای دفتر فنی کارگاه
            </p>
          </div>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-2.5 py-1 rounded-lg text-xs text-slate-600 dark:text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer selection:bg-transparent">
              <input 
                type="checkbox" 
                checked={autoRefresh} 
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-3.5 h-3.5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500"
              />
              <span>بروزرسانی خودکار (۶ ثانیه)</span>
            </label>
          </div>

          <button
            onClick={handleFetchData}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-75 rounded-lg text-xs font-bold transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>به‌روزرسانی داده‌ها</span>
          </button>
          
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden xl:inline-block">
            بروزرسانی: {lastUpdated.toLocaleTimeString('fa-IR')}
          </span>
        </div>
      </div>

      {/* Main KPI Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4" id="kpi-cards-grid">
        
        {/* KPI Card 1: Percent Completion of Engineering */}
        <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="z-10 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">پیشرفت کل فاز مهندسی</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +۰.۳۵٪
              </span>
            </div>
            
            {isSyncing ? (
              <div className="space-y-2 py-1.5">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-855 rounded animate-pulse w-1/2" />
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1" dir="rtl">
                  <span className="text-3xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
                    {metrics.engineeringProgress.toFixed(2)}٪
                  </span>
                  <span className="text-xs text-slate-400 font-normal">تکمیل شده</span>
                </div>
                
                {/* Progress Comparison */}
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>برنامه زمان‌بندی MSP: {metrics.plannedProgress.toFixed(1)}٪</span>
                    <span className="text-amber-500 dark:text-amber-400">انحراف: {engineeringDelay}٪-</span>
                  </div>
                  
                  {/* Progress bar container */}
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000 relative"
                      style={{ width: `${metrics.engineeringProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="absolute right-2 -bottom-2 opacity-5 pointer-events-none group-hover:scale-110 transition duration-300">
            <TrendingUp className="w-20 h-20 text-blue-600" />
          </div>
        </div>

        {/* KPI Card 2: Pending RFI Turnaround Time */}
        <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group">
          <div className="z-10 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">زمان ترن‌اراند تایید RFI</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                استاندارد کارگاه
              </span>
            </div>

            {isSyncing ? (
              <div className="space-y-2 py-1.5">
                <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-855 rounded animate-pulse w-1/2" />
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-1" dir="rtl">
                  <span className="text-3xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                    {metrics.rfiTurnaroundHours}
                  </span>
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400">ساعت</span>
                </div>

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-sans">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>متوسط پاسخ دفتر فنی به مدارک از ابتدای ماه</span>
                </div>

                <div className="mt-1 flex items-center gap-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">حد مجاز قرارادی:</span>
                  <span className="text-[11px] font-mono text-slate-550 dark:text-slate-400">۷۲ ساعت کاری</span>
                </div>
              </div>
            )}
          </div>
          <div className="absolute right-2 -bottom-2 opacity-5 pointer-events-none group-hover:scale-110 transition duration-300">
            <Clock className="w-20 h-20 text-emerald-600" />
          </div>
        </div>

        {/* KPI Card 3: Pending RFI Overview */}
        <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group col-span-1 xl:col-span-2">
          <div className="z-10 space-y-2.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">وضعیت استعلام‌ها و RFI‌های باز</span>
                <span className="text-[10px] bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold px-1.5 py-0.5 rounded">
                  {metrics.pendingRfisCount} معلق
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">مجموع استعلام‌ها: {metrics.totalRfiCount} عدد</span>
            </div>

            {isSyncing ? (
              <div className="space-y-2.5 py-1">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-full" />
                <div className="h-5 bg-slate-150 dark:bg-slate-850 rounded animate-pulse w-5/6" />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-550 dark:text-slate-400">آخرین موارد معطل مانده جهت ابلاغ اصلاحات نقشه شاپ دیسیپلین‌های کارگاه:</p>
                
                {/* RFI Mini-list */}
                <div className="space-y-1.5 max-h-[4.5rem] overflow-y-auto pr-1 text-xs" style={{ scrollbarWidth: 'thin' }}>
                  {mockRfis.filter(r => r.status !== 'Closed').map(r => (
                    <div 
                      key={r.id} 
                      className="flex items-center justify-between p-1 px-2 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-blue-200 transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">{r.rfiNo}</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px] sm:max-w-xs">{r.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-zinc-400 font-mono">مسئول: {r.assignedTo.split(' ').pop()}</span>
                        <button 
                          onClick={() => handleUrgentFollowup(r.rfiNo)}
                          className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-white rounded text-[10px] border border-amber-500/20 font-bold transition duration-200"
                          title="پیگیری آنلاین کارتابل و پیامک"
                        >
                          <Send className="w-2.5 h-2.5" />
                          <span>خروج از بن‌بست</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
