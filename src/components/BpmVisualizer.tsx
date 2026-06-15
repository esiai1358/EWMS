import { useState, useEffect } from 'react';
import { WorkflowDefinition, WorkflowHistory, WorkflowStepName } from '../types';
import { GitFork, Check, Play, User, RefreshCcw, FileSignature, ArrowLeft, Plus } from 'lucide-react';

interface BpmVisualizerProps {
  workflowList: WorkflowDefinition[];
  updateWorkflow: (updated: WorkflowDefinition) => void;
  currentUser: { fullName: string };
  externalSelectedWfId?: string | null;
  onExternalWfSelected?: (id: string | null) => void;
}

const STEPS: WorkflowStepName[] = [
  'Create Request',
  'Manager Review',
  'Senior Engineer',
  'Engineer',
  'QA/QC Review',
  'Document Control',
  'Project Control',
  'Final Approval'
];

const STEP_TRANSLATIONS: Record<WorkflowStepName, string> = {
  'Create Request': 'ثبت درخواست اولیه',
  'Manager Review': 'بررسی مدیر پروژه',
  'Senior Engineer': 'تایید مهندس ارشد',
  'Engineer': 'بررسی مهندس کارگاه',
  'QA/QC Review': 'ممیزی کنترل کیفی',
  'Document Control': 'ثبت و آرشیو DCC',
  'Project Control': 'بررسی کنترل پروژه',
  'Final Approval': 'تایید و امضا نهایی'
};

export default function BpmVisualizer({ 
  workflowList, 
  updateWorkflow, 
  currentUser,
  externalSelectedWfId,
  onExternalWfSelected
}: BpmVisualizerProps) {
  const [selectedWfId, setSelectedWfId] = useState<string>(workflowList[0]?.id || '');
  const [commentText, setCommentText] = useState('');
  const [delegateUser, setDelegateUser] = useState('مهندس سارا کریمی');

  useEffect(() => {
    if (externalSelectedWfId) {
      const exists = workflowList.some(w => w.id === externalSelectedWfId);
      if (exists) {
        setSelectedWfId(externalSelectedWfId);
      }
      if (onExternalWfSelected) {
        onExternalWfSelected(null);
      }
    }
  }, [externalSelectedWfId, workflowList, onExternalWfSelected]);

  const selectedWf = workflowList.find(w => w.id === selectedWfId);

  if (!selectedWf) {
    return <div className="p-4 text-center text-slate-500">سند گردشکاري برای پی‌جویی یافت نشد.</div>;
  }

  const currentStepIndex = STEPS.indexOf(selectedWf.currentStep);

  const handleAction = (action: 'Approve' | 'Reject' | 'Return' | 'Escalate' | 'Delegate') => {
    let nextStepIndex = currentStepIndex;
    let nextStatus: 'Approved' | 'Rejected' | 'In Progress' | 'Returned' = 'In Progress';

    if (action === 'Approve') {
      if (currentStepIndex < STEPS.length - 1) {
        nextStepIndex = currentStepIndex + 1;
      } else {
        nextStatus = 'Approved';
      }
    } else if (action === 'Reject') {
      nextStatus = 'Rejected';
    } else if (action === 'Return') {
      if (currentStepIndex > 0) {
        nextStepIndex = currentStepIndex - 1;
      }
      nextStatus = 'Returned';
    }

    const newHistoryItem: WorkflowHistory = {
      date: '1405/03/15',
      user: currentUser.fullName,
      action: action,
      step: selectedWf.currentStep,
      comment: commentText || 'انتقال خودکار موتور هوشمند BPMN'
    };

    const updated: WorkflowDefinition = {
      ...selectedWf,
      currentStep: STEPS[nextStepIndex],
      status: nextStatus,
      history: [...selectedWf.history, newHistoryItem]
    };

    updateWorkflow(updated);
    setCommentText('');
    alert(`فرآیند با موفقیت ویرایش و به مرحله '${STEP_TRANSLATIONS[STEPS[nextStepIndex]]}' منتقل شد.`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm" id="bpmn-visualizer-card">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GitFork className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">درگاه شبیه‌ساز گردش کار Flowable BPMN</h3>
        </div>
        <select
          value={selectedWfId}
          onChange={(e) => setSelectedWfId(e.target.value)}
          className="text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded p-1.5 focus:outline-none"
        >
          {workflowList.map(w => (
            <option key={w.id} value={w.id}>{w.id} - {w.title.slice(0, 30)}...</option>
          ))}
        </select>
      </div>

      {/* BPMN Interactive Step Nodes */}
      <div className="p-6 bg-slate-50/50 dark:bg-slate-950/30 overflow-x-auto">
        <p className="text-[11px] text-slate-400 mb-4 text-center">ترسیم گراف جریان تاییدیه اسناد عمران آذرستان (شبیه‌ساز زنده موتور Flowable)</p>
        <div className="flex items-center justify-between min-w-[900px] py-4 px-2 select-none relative">
          
          {/* Connector Line Background */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            const isFuture = idx > currentStepIndex;

            let nodeStyles = "";
            let textStyles = "";

            if (isCompleted) {
              nodeStyles = "bg-emerald-500 border-emerald-600 text-white dark:bg-emerald-600";
              textStyles = "text-emerald-600 dark:text-emerald-400 font-semibold text-xs";
            } else if (isActive) {
              nodeStyles = "bg-blue-600 border-blue-700 text-white shadow-lg ring-4 ring-blue-500/30 animate-pulse";
              textStyles = "text-blue-600 dark:text-blue-400 font-bold text-xs";
            } else {
              nodeStyles = "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500";
              textStyles = "text-slate-500 dark:text-slate-500 text-xs";
            }

            return (
              <div key={step} className="flex flex-col items-center gap-2 z-10 relative flex-1">
                {/* Node Orb */}
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${nodeStyles}`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : <span>{idx + 1}</span>}
                </div>
                {/* Step Name */}
                <div className="text-center">
                  <span className={`block whitespace-nowrap ${textStyles}`}>
                    {STEP_TRANSLATIONS[step]}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                    {step}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Simulation Area */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Actions Controls (Left Side in Layout/RTL right side) */}
        <div className="md:col-span-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1">
            <FileSignature className="w-4 h-4 text-blue-500" />
            <span>پنل اخذ تصمیم مهندسی</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">توضیح یا نظر کارشناس:</label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="w-full text-xs p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                placeholder="توضیحات تکمیلی در مورد عیار، تداخل و تایید شاپ نقشه را وارد کنید..."
              />
            </div>

            {/* Simulated Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAction('Approve')}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition shadow-sm"
              >
                تایید و ارسال (Approve)
              </button>
              <button
                onClick={() => handleAction('Return')}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-bold transition shadow-sm"
              >
                بازگرداندن به قبل (Return)
              </button>
              <button
                onClick={() => handleAction('Reject')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition col-span-2 shadow-sm"
              >
                رد نهایی درخواست (Reject)
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block text-[11px] text-slate-500">انتخاب شخص برای واگذاری (Delegate):</label>
              <div className="flex gap-1.5">
                <select
                  value={delegateUser}
                  onChange={(e) => setDelegateUser(e.target.value)}
                  className="flex-1 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded p-1"
                >
                  <option value="مهندس سارا کریمی">مهندس سارا کریمی (دفتر فنی)</option>
                  <option value="مهندس علیرضا رضایی">مهندس علیرضا رضایی (مدیر پروژه)</option>
                  <option value="مهندس فرهاد احمدی">مهندس فرهاد احمدی (QA/QC)</option>
                </select>
                <button
                  onClick={() => handleAction('Delegate')}
                  className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs transition"
                >
                  تفویض
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Log / History Trace (Right Side) */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">تاریخچه ممیزی گردش کار (Audit Trace Log)</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                selectedWf.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                selectedWf.status === 'Returned' ? 'bg-amber-500/10 text-amber-600' :
                'bg-blue-500/10 text-blue-600'
              }`}>
                وضعیت: {
                  selectedWf.status === 'Approved' ? 'تایید نهایی شده' :
                  selectedWf.status === 'Returned' ? 'مرجوع شده' :
                  'در حال گردش'
                }
              </span>
            </div>

            <div className="space-y-3.5 max-h-[190px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {selectedWf.history.map((hist, index) => (
                <div key={index} className="flex gap-3 items-start border-r-2 border-slate-200 dark:border-slate-700 pr-3 relative">
                  <span className="absolute right-[-6px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{hist.user}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{hist.date}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded ${
                        hist.action === 'Approve' ? 'bg-emerald-500/10 text-emerald-500' :
                        hist.action === 'Return' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {hist.action === 'Approve' ? 'تأیید' : hist.action === 'Return' ? 'مرجوع' : hist.action}
                      </span>
                    </div>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">مرحله: {STEP_TRANSLATIONS[hist.step] || hist.step}</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{hist.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>دریافت خروجی BPMN خام پرونده {selectedWf.id}</span>
            <button
              onClick={() => alert('دانلود فایل گرافیکی Flowable BPMN به فرمت XML اغاز شد.')}
              className="text-blue-500 hover:underline flex items-center gap-1 text-[10px] font-bold"
            >
              دانلود فایل XML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
