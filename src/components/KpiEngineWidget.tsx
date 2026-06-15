import { useState } from 'react';
import { Award, Zap, Percent, RefreshCw, BarChart2 } from 'lucide-react';

interface EngineerKpiInputs {
  name: string;
  role: string;
  reworkCount: number;
  baseQuality: number; // 0-100
  baseEfficiency: number; // 0-100
  plannedDays: number;
  actualDays: number;
}

export default function KpiEngineWidget() {
  const [inputs, setInputs] = useState<EngineerKpiInputs>({
    name: 'مهندس سارا کریمی',
    role: 'کارشناس ارشد دفتر فنی',
    reworkCount: 1,
    baseQuality: 92,
    baseEfficiency: 88,
    plannedDays: 14,
    actualDays: 12
  });

  // Calculate formulas
  const reworkIndex = inputs.reworkCount;
  
  // Quality Index = QualityScore - (ReworkCount * 5)
  const qualityIndex = Math.max(0, Math.min(100, inputs.baseQuality - (inputs.reworkCount * 5)));
  
  // Performance Index = QualityScore * (1 - (ReworkCount * 0.1))
  const performanceIndex = Math.max(0, Math.min(100, inputs.baseQuality * (1 - (inputs.reworkCount * 0.1))));
  
  // Efficiency Index = EfficiencyScore * (PlannedDays / ActualDays)
  const timeRatio = inputs.plannedDays / (inputs.actualDays || 1);
  const efficiencyIndex = Math.max(0, Math.min(100, inputs.baseEfficiency * timeRatio));

  // Overall rating
  let overallRating = 'C';
  let ratingColor = 'text-red-500 bg-red-500/10 border-red-500/20';
  let ratingLabel = 'نیاز به دوره‌های آموزشی و ممیزی مجدد';

  const averageComposite = (qualityIndex + performanceIndex + efficiencyIndex) / 3;

  if (averageComposite >= 90) {
    overallRating = 'A++';
    ratingColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    ratingLabel = 'رتبه ممتاز - کاندیدای ارتقا پایه مهندسی ارشد';
  } else if (averageComposite >= 75) {
    overallRating = 'A';
    ratingColor = 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    ratingLabel = 'عالی - عملکرد استاندارد بهینه پروژه نیروگاه';
  } else if (averageComposite >= 60) {
    overallRating = 'B';
    ratingColor = 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    ratingLabel = 'متوسط/خوب - روند رو به رشد کیفی کارگاه';
  }

  const handleReset = () => {
    setInputs({
      name: 'مهندس سارا کریمی',
      role: 'کارشناس ارشد دفتر فنی',
      reworkCount: 1,
      baseQuality: 92,
      baseEfficiency: 88,
      plannedDays: 14,
      actualDays: 15
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm" id="kpi-engine-card">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <span>موتور محاسبات فرمول‌های KPI و رتبه‌بندی عمران آذرستان</span>
        </h3>
        <button
          onClick={handleReset}
          className="p-1 text-slate-400 hover:text-blue-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="بازنشانی ورودی‌ها"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Parameters (Form) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">متغیرهای ارزیابی مهندس</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">انتخاب مهندس:</label>
              <select
                value={inputs.name}
                onChange={(e) => {
                  const name = e.target.value;
                  const role = name === 'مهندس سارا کریمی' ? 'کارشناس ارشد دفتر فنی' :
                               name === 'مهندس جعفر احمدیار' ? 'سرپرست کارگاه اجرایی' :
                               'کارشناس کنترل پروژه نیروگاه';
                  setInputs({ ...inputs, name, role });
                }}
                className="w-full text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded p-1.5"
              >
                <option value="مهندس سارا کریمی">مهندس سارا کریمی</option>
                <option value="مهندس جعفر احمدیار">مهندس جعفر احمدیار</option>
                <option value="مهندس حمید موسوی">مهندس حمید موسوی</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">کیفیت پایه (Base Q):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.baseQuality}
                  onChange={(e) => setInputs({ ...inputs, baseQuality: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                  className="w-full text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded p-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">راندمان پایه (Base E):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputs.baseEfficiency}
                  onChange={(e) => setInputs({ ...inputs, baseEfficiency: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })}
                  className="w-full text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded p-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block flex justify-between text-[11px] text-slate-500 mb-1">
                <span>تعداد بازکاری نقشه مهندسی (Rework Index):</span>
                <span className="font-bold text-red-500">{inputs.reworkCount} بار بازگشت</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={inputs.reworkCount}
                onChange={(e) => setInputs({ ...inputs, reworkCount: parseInt(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">مدت زمان مصوب (روز):</label>
                <input
                  type="number"
                  min="1"
                  value={inputs.plannedDays}
                  onChange={(e) => setInputs({ ...inputs, plannedDays: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded p-1.5"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">مدت زمان واقعی (روز):</label>
                <input
                  type="number"
                  min="1"
                  value={inputs.actualDays}
                  onChange={(e) => setInputs({ ...inputs, actualDays: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded p-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Formula Display (Right Side) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">گزارش پردازش بلادرنگ فرمول‌های مهندسی</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Quality Index Card */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono">QUALITY INDEX (QI)</span>
                  <span className="block text-xl font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">{qualityIndex.toFixed(1)}%</span>
                </div>
                <div className="mt-2 text-[9px] text-slate-500 flex flex-col font-mono bg-slate-50 dark:bg-slate-950 p-1 rounded">
                  <span>QI = Quality - (Rework * 5)</span>
                  <span className="text-emerald-500 mt-0.5">{inputs.baseQuality} - ({inputs.reworkCount} * 5) = {qualityIndex}</span>
                </div>
              </div>

              {/* Performance Index Card */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono">PERFORMANCE (PI)</span>
                  <span className="block text-xl font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">{performanceIndex.toFixed(1)}%</span>
                </div>
                <div className="mt-2 text-[9px] text-slate-500 flex flex-col font-mono bg-slate-50 dark:bg-slate-950 p-1 rounded">
                  <span>PI = Quality * (1 - Rework*0.1)</span>
                  <span className="text-blue-500 mt-0.5">{inputs.baseQuality} * (1 - {inputs.reworkCount * 0.1})</span>
                </div>
              </div>

              {/* Efficiency Index Card */}
              <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-sm relative overflow-hidden">
                <div>
                  <span className="block text-[10px] text-slate-400 font-mono">EFFICIENCY (EI)</span>
                  <span className={`block text-xl font-black mt-1 font-mono ${efficiencyIndex > inputs.baseEfficiency ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-100'}`}>{efficiencyIndex.toFixed(1)}%</span>
                </div>
                <div className="mt-2 text-[9px] text-slate-500 flex flex-col font-mono bg-slate-50 dark:bg-slate-950 p-1 rounded">
                  <span>EI = Efficiency * (Days_P / Days_A)</span>
                  <span className="text-violet-500 mt-0.5">{inputs.baseEfficiency} * ({inputs.plannedDays} / {inputs.actualDays})</span>
                </div>
              </div>

            </div>

            {/* Scale Indicator */}
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-50/30 dark:bg-slate-950/20">
              <div className="flex gap-3">
                <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-black text-lg shadow-inner ${ratingColor}`}>
                  {overallRating}
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">امتیاز کل ارزیابی: {averageComposite.toFixed(1)} / ۱۰۰</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{ratingLabel}</p>
                </div>
              </div>
              <div className="text-left font-mono text-[10px] text-slate-400">
                بروزرسانی زنده بر اساس پایگاه داده عمران آذرستان
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
            <span>فرمول‌های بالا مستقیماً در قالب ویوو (View) با نام `vw_EngineerPerformanceSummary` در SQL Server پیاده‌سازی شده و قابل اکسپورت است.</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
