import React, { useState } from 'react';
import { 
  mockUsers, 
  mockRoles, 
  mockWorkflows, 
  mockTasks, 
  mockShopDrawings, 
  mockAsBuiltDrawings, 
  mockRfis, 
  mockNcrs, 
  mockDocuments, 
  mockMaterialApprovals, 
  mockWarehouseItems, 
  mockProcurementRequests, 
  mockDailyReports,
  mockProjectMetrics
} from '../data/mockData';
import { blueprintAssets } from '../data/blueprints';
import BpmVisualizer from './BpmVisualizer';
import KpiEngineWidget from './KpiEngineWidget';
import ExecutiveDashboard from './ExecutiveDashboard';
import Glossary from './Glossary';
import { 
  Search, Plus, Eye, CheckCircle2, AlertTriangle, Clock, XCircle, FileText, Download, Copy, RefreshCw, Layers, MapPin, DollarSign, Database, Award, UserPlus, Send, Archive
} from 'lucide-react';

interface ModuleTabContentProps {
  activeModuleId: string;
  currentUser: any;
  externalSelectedWfId?: string | null;
  onExternalWfSelected?: (id: string | null) => void;
}

export default function ModuleTabContent({ 
  activeModuleId, 
  currentUser,
  externalSelectedWfId,
  onExternalWfSelected
}: ModuleTabContentProps) {
  // Local states mimicking live database
  const [users, setUsers] = useState(mockUsers);
  const [roles, setRoles] = useState(mockRoles);
  const [workflows, setWorkflows] = useState(mockWorkflows);
  const [tasks, setTasks] = useState(mockTasks);
  const [shopDrawings, setShopDrawings] = useState(mockShopDrawings);
  const [asbuiltDrawings, setAsbuiltDrawings] = useState(mockAsBuiltDrawings);
  const [rfis, setRfis] = useState(mockRfis);
  const [ncrs, setNcrs] = useState(mockNcrs);
  const [documents, setDocuments] = useState(mockDocuments);
  const [materials, setMaterials] = useState(mockMaterialApprovals);
  const [warehouse, setWarehouse] = useState(mockWarehouseItems);
  const [procurements, setProcurements] = useState(mockProcurementRequests);
  const [dailyReports, setDailyReports] = useState(mockDailyReports);

  // Common Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('ALL');

  // Forms controllers
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', fullName: '', position: '', department: '', email: '', role: 'مهندس کارگاه' });

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assignedEngineer: 'مهندس سارا کریمی', priority: 'High' as 'High'|'Medium'|'Low' });

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 1. ADD USER TO ACTIVE DIRECTORY
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName) return;
    const added = {
      id: `USR-${users.length + 1}`,
      username: newUser.username,
      fullName: newUser.fullName,
      position: newUser.position,
      department: newUser.department,
      role: newUser.role,
      isActive: true,
      email: newUser.email || `${newUser.username}@azarestan.com`
    };
    setUsers([...users, added]);
    setNewUser({ username: '', fullName: '', position: '', department: '', email: '', role: 'مهندس کارگاه' });
    setShowAddUser(false);
    alert('کاربر جدید با موفقیت ایجاد و با اکتیو دایرکتوری (Active Directory) همگام‌سازی شد.');
  };

  // 2. ADD TASK
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const added = {
      id: `TSK-${tasks.length + 101}`,
      title: newTask.title,
      assignedEngineer: newTask.assignedEngineer,
      priority: newTask.priority,
      status: 'In Progress' as const,
      startDate: '1405/03/15',
      dueDate: '1405/04/10',
      reworkCount: 0,
      qualityScore: 100,
      efficiencyScore: 100
    };
    setTasks([added, ...tasks]);
    setNewTask({ title: '', assignedEngineer: 'مهندس سارا کریمی', priority: 'High' });
    setShowAddTask(false);
    alert('وظیفه مهندسی با موفقیت درج و به مهندس مربوطه ابلاغ شد.');
  };

  // Update Workflow item callback
  const handleUpdateWf = (updated: any) => {
    setWorkflows(workflows.map(w => w.id === updated.id ? updated : w));
  };

  // Simulated export to Excel
  const handleExportSim = (modName: string) => {
    alert(`سامانه در حال صدور اکسپورت Excel برای لیست ${modName} است.`);
  };

  // Dynamic switcher
  switch (activeModuleId) {
    case 'exec-dashboard': {
      return (
        <ExecutiveDashboard currentUser={currentUser} />
      );
    }
    case 'tech-dashboard': {
      const pendingMar = materials.filter(m => m.status === 'Pending').length;
      return (
        <div className="space-y-6" id="module-tech-dashboard">
          <KpiEngineWidget />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Quick Office Stats */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">تحلیلی بارهای استودیو دفتر فنی</h4>
              
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>نسبت بازکاری متریال (Rework Ratio)</span>
                    <span className="font-mono font-bold text-red-500">۱۸.۵٪</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-2" style={{ width: '18.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>تأییدیه های مصالح معلق مانده در کارگاه</span>
                    <span className="font-mono font-bold text-amber-500">{pendingMar} پرونده</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-2" style={{ width: `${(pendingMar / materials.length) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>تحویل نقشه‌های کارگاهی مصوب ازبیلت</span>
                    <span className="font-mono font-bold text-emerald-500">۹۴.۲٪</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-2" style={{ width: '94.2%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Technical Office Leaderboard */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-4">شاخص عملکرد کیفی طراحان و مهندسین ارشد</h4>
              <div className="space-y-3">
                {tasks.map((tsk) => (
                  <div key={tsk.id} className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{tsk.assignedEngineer}</span>
                      <span className="text-[10px] text-slate-400">تسک ارجاعی: {tsk.title.slice(0, 40)}...</span>
                    </div>
                    <div className="text-left font-mono">
                      <span className="text-xs font-bold text-blue-600 block">کیفیت: {tsk.qualityScore}%</span>
                      <span className="text-[9px] text-slate-500">میزان تاخیر: {tsk.reworkCount} بار بازکاری</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      );
    }

    // Module 3: Workflows List (BPMN)
    case 'workflows': {
      return (
        <div className="space-y-6" id="module-workflows">
          <BpmVisualizer 
            workflowList={workflows} 
            updateWorkflow={handleUpdateWf} 
            currentUser={currentUser} 
            externalSelectedWfId={externalSelectedWfId}
            onExternalWfSelected={onExternalWfSelected}
          />
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">مجموعه گردش کارهای مهندسی کارگاه نیروگاه</h4>
              <button
                onClick={() => alert('امکان اتصال زنده به موتور BPMN Flowable در هاست داخلی برقرار است.')}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>بروزرسانی داده‌ها</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-4">شناسه</th>
                    <th className="py-3 px-4">عنوان نقشه یا سند تحت تایید</th>
                    <th className="py-3 px-4">ایجادکننده</th>
                    <th className="py-3 px-4">تاریخ ثبت</th>
                    <th className="py-3 px-4">گروه کاندید / گام فعلی</th>
                    <th className="py-3 px-4">وضعیت کلی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {workflows.map(wf => (
                    <tr key={wf.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{wf.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-100">{wf.title}</td>
                      <td className="py-3 px-4">{wf.creator}</td>
                      <td className="py-3 px-4 font-mono">{wf.createdAt}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-mono text-[10px]">
                          {wf.currentStep}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          wf.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                          wf.status === 'Returned' ? 'bg-amber-500/10 text-amber-600' :
                          'bg-blue-500/10 text-blue-600'
                        }`}>
                          {wf.status === 'Approved' ? 'تایید نهایی شده' :
                           wf.status === 'Returned' ? 'مرجوع شده' : 'جاری در سازمان'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // Module 4: Users Management
    case 'users': {
      return (
        <div className="space-y-6" id="module-users">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">کاربران سازمان (Active Directory)</h3>
              <p className="text-xs text-slate-400">فهرست کل پرسنل همگام‌سازی شده با دومین عمران آذرستان</p>
            </div>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>افزودن همکار جدید</span>
            </button>
          </div>

          {/* New User Form Dialog */}
          {showAddUser && (
            <form onSubmit={handleCreateUser} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">ثبت دستی شناسه‌ جدید برای پروژه</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-500">نام کاربری AD:</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full text-xs bg-white dark:bg-slate-900 border rounded p-1.5 text-slate-800 dark:text-slate-100"
                    placeholder="e.g. s.ahvazi"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    className="w-full text-xs bg-white dark:bg-slate-900 border rounded p-1.5 text-slate-800 dark:text-slate-100"
                    placeholder="e.g. مهندس صادق اهوازی"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">سمت سازمانی:</label>
                  <input
                    type="text"
                    value={newUser.position}
                    onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                    className="w-full text-xs bg-white dark:bg-slate-900 border rounded p-1.5 text-slate-800 dark:text-slate-100"
                    placeholder="کارشناس طراح پایپینگ"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold">ثبت و ایجاد</button>
                <button type="button" onClick={() => setShowAddUser(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">انصراف</button>
              </div>
            </form>
          )}

          {/* Users Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <th className="py-3 px-4">شناسه</th>
                  <th className="py-3 px-4">نام کامل</th>
                  <th className="py-3 px-4">سمت</th>
                  <th className="py-3 px-4">بخش سازمانی</th>
                  <th className="py-3 px-4">پست الکترونیک رسمی</th>
                  <th className="py-3 px-4">وضعیت همگام‌سازی AD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-855 transition">
                    <td className="py-3 px-4 font-mono">{u.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{u.fullName}</td>
                    <td className="py-3 px-4">{u.position}</td>
                    <td className="py-3 px-4 font-mono">{u.department}</td>
                    <td className="py-3 px-4 font-mono">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">فعال و مجاز</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Module 5: Role Management (RBAC)
    case 'roles': {
      return (
        <div className="space-y-6" id="module-roles">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">مدیریت نقش‌ها و ماتریس سطوح دسترسی (RBAC)</h3>
            <p className="text-xs text-slate-400">تعیین دسترسی‌های امنیتی هر مهندس بر اساس قوانین سازمانی</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map(r => (
              <div key={r.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-blue-600 font-mono">{r.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">{r.id}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{r.persianName}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{r.description}</p>
                </div>
                
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="block text-[10px] text-slate-400 mb-1">مجوزهای فعال این کاربری:</span>
                  <div className="flex flex-wrap gap-1">
                    {r.permissions.map(p => (
                      <span key={p} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Module 6: Technical Office Documents control
    case 'tech-office': {
      return (
        <div className="space-y-6" id="module-tech-office">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">اسناد و دستورالعمل‌های فنی نیروگاه</h3>
              <p className="text-xs text-slate-400">کلاسه اسناد، روش‌های اجرایی مصوب مشاور مپنا و کتب راهنما</p>
            </div>
            <button
              onClick={() => handleExportSim('اسناد فنی')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border rounded-lg text-xs font-bold hover:bg-slate-200 transition text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>خروجی کلی</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600" id="table-head">
                  <th className="py-3 px-4">کد بین‌المللی DCC</th>
                  <th className="py-3 px-4">عنوان مستند مهندسی</th>
                  <th className="py-3 px-4">نوع سند</th>
                  <th className="py-3 px-4">دسته‌بندی کنترل اسناد</th>
                  <th className="py-3 px-4">آخرین نسخه (Rev)</th>
                  <th className="py-3 px-4">سطح طبقه‌بندی امنیتی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    <td className="py-3 px-4 font-mono text-blue-600 font-bold">{doc.docNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{doc.title}</td>
                    <td className="py-3 px-4 font-mono">{doc.type}</td>
                    <td className="py-3 px-4">{doc.category}</td>
                    <td className="py-3 px-4 font-mono font-bold">ورژن {doc.rev}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.confidentiality === 'Public' ? 'bg-emerald-500/10 text-emerald-600' :
                        doc.confidentiality === 'Confidential' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {doc.confidentiality === 'Public' ? 'عمومی' :
                         doc.confidentiality === 'Confidential' ? 'محرمانه کارگاه' : 'خیلی محرمانه'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Module 7: Engineering Tasks
    case 'eng-tasks': {
      return (
        <div className="space-y-6" id="module-eng-tasks">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">کارپوشه وظایف محاسباتی مهندسین</h3>
              <p className="text-xs text-slate-400">توزیع کارهای طراحی و محاسباتی با پایش آنلاین بازکاری و عیار مهندسی</p>
            </div>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ایجاد تسک جدید</span>
            </button>
          </div>

          {/* Task creation Form dialog */}
          {showAddTask && (
            <form onSubmit={handleCreateTask} className="p-4 bg-slate-50 dark:bg-slate-950 border rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">تبیین کار جدید در پروژه نیروگاه</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500">عنوان وظیفه:</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full text-xs p-1.5 border rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    placeholder="طراحی بتن عیار ۴۰۰ واحد ۱"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">مهندس مسئول ارجاع:</label>
                  <select
                    value={newTask.assignedEngineer}
                    onChange={(e) => setNewTask({ ...newTask, assignedEngineer: e.target.value })}
                    className="w-full text-xs p-1.5 border rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    <option value="مهندس سارا کریمی">مهندس سارا کریمی</option>
                    <option value="مهندس جعفر احمدیار">مهندس جعفر احمدیار</option>
                    <option value="مهندس حمید موسوی">مهندس حمید موسوی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500">اولویت پروژه:</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full text-xs p-1.5 border rounded bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  >
                    <option value="High">بحرانی/بالا</option>
                    <option value="Medium">متوسط</option>
                    <option value="Low">عادی</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold">ابلاغ تسک به کارتابل</button>
            </form>
          )}

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map(t => (
              <div key={t.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3.5 shadow-sm relative">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono p-1 rounded bg-slate-100 dark:bg-slate-800">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    اولویت: {t.priority === 'High' ? 'فوری' : 'عادی'}
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.title}</h4>
                
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>ارجاع به: <strong className="text-slate-700 dark:text-slate-300">{t.assignedEngineer}</strong></span>
                  <span className="font-mono">{t.startDate} - {t.dueDate}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400">تعداد دفعات بازکاری:</span>
                    <strong className="text-xs text-slate-800 dark:text-slate-200">{t.reworkCount} بار</strong>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400">شاخص راندمان آنلاین:</span>
                    <strong className="text-xs text-emerald-500 font-mono">{t.efficiencyScore}%</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className={`text-xs ${
                    t.status === 'Completed' ? 'text-emerald-500 font-bold' :
                    t.status === 'Delayed' ? 'text-red-500 font-bold' :
                    'text-blue-500 animate-pulse'
                  }`}>
                    وضعیت: {
                      t.status === 'Completed' ? 'مختومه شده' :
                      t.status === 'Delayed' ? 'دارای تاخیر زمانی' : 'در حال انجام طراح عمومی'
                    }
                  </span>
                  
                  <div className="flex gap-1">
                    <button 
                      onClick={() => {
                        const newStatus = t.status === 'In Progress' ? 'Completed' : 'In Progress';
                        setTasks(tasks.map(x => x.id === t.id ? { ...x, status: newStatus as any } : x));
                        alert('وضعیت تسک محاسباتی بروزرسانی شد.');
                      }}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      تغییر وضعیت
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Module 8: Shop Drawings
    case 'shop-drawings': {
      return (
        <div className="space-y-6" id="module-shop-drawings">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 border rounded-xl shadow-sm">
            <div className="flex gap-2">
              <button
                onClick={() => setDisciplineFilter('ALL')}
                className={`px-3 py-1 text-xs rounded-full font-bold transition ${disciplineFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                تسهیلات سازه‌ای و عمومی
              </button>
              <button
                onClick={() => setDisciplineFilter('Structure')}
                className={`px-3 py-1 text-xs rounded-full font-bold transition ${disciplineFilter === 'Structure' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                سازه (Structure)
              </button>
              <button
                onClick={() => setDisciplineFilter('Piping')}
                className={`px-3 py-1 text-xs rounded-full font-bold transition ${disciplineFilter === 'Piping' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                تاسیسات و لوله‌کشی
              </button>
            </div>
            
            <button
              onClick={() => handleExportSim('نقشه‌های کارگاهی شاپ')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>اکسپورت شاپ‌ها</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <th className="py-3 px-4">کد نقشه (Drawing No)</th>
                  <th className="py-3 px-4">عنوان نقشه کارگاهی</th>
                  <th className="py-3 px-4">بخش تخصصی</th>
                  <th className="py-3 px-4">مقياس ترسیم</th>
                  <th className="py-3 px-4">مهندس محاسب</th>
                  <th className="py-3 px-4">نسخه</th>
                  <th className="py-3 px-4">وضعیت تایید کارگاهی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {shopDrawings
                  .filter(sd => disciplineFilter === 'ALL' || sd.discipline === disciplineFilter)
                  .map(sd => (
                    <tr key={sd.id} className="hover:bg-slate-50 dark:hover:bg-slate-855 transition">
                      <td className="py-3 px-4 font-mono text-blue-600 font-bold">{sd.drawingNo}</td>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{sd.title}</td>
                      <td className="py-3 px-4">{sd.discipline}</td>
                      <td className="py-3 px-4 font-mono">{sd.scale}</td>
                      <td className="py-3 px-4">{sd.engineer}</td>
                      <td className="py-3 px-4 font-mono">ریویژن {sd.rev}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sd.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                          sd.status === 'Approved as Noted' ? 'bg-indigo-500/10 text-indigo-600' :
                          'bg-amber-500/10 text-amber-600'
                        }`}>
                          {sd.status === 'Approved' ? 'مصوب - مجوز اجرا غلیظ' :
                           sd.status === 'Approved as Noted' ? 'مصوب با یادداشت اصلاحی' : 'دارای مغایرت فنی'}
                        </span>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Module 9: As-Built Drawings
    case 'asbuilt-drawings': {
      return (
        <div className="space-y-6" id="module-asbuilt">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">نقشه‌های نهایی ازبیلت پروژه (As-Built Archive)</h3>
            <p className="text-xs text-slate-400">آرشیو نقشه‌های وضع موجود اجرا شده در فونداسیون و پایپینگ جهت مستندسازی نهایی نیروگاه</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {asbuiltDrawings.map(ab => (
              <div key={ab.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-400">{ab.drawingNo}</span>
                  <span className="px-2 py-0.2 bg-emerald-500/10 text-emerald-600 text-[10px] rounded font-bold font-mono">AS-BUILT CONFIRMED</span>
                </div>

                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{ab.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2 rounded">{ab.notes}</p>

                <div className="flex justify-between text-[11px] text-slate-400 items-center">
                  <span>تأیید کننده نهایی: <strong>{ab.approvedBy}</strong></span>
                  <span className="font-mono">{ab.issueDate}</span>
                </div>
                
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-500"> تاییدیه فیزیکی و صحرایی کارگاه</span>
                  <input
                    type="checkbox"
                    checked={ab.siteVerified}
                    readOnly
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Module 10: RFI Management
    case 'rfi': {
      return (
        <div className="space-y-6" id="module-rfi">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">مدیریت درخواست اطلاعات (RFI Interface)</h3>
              <p className="text-xs text-slate-400">ثبت و ردیابی مغایرت‌ها و ابهام‌های بین نقشه‌های پایه و اجرا به همراه ددلاین‌ها</p>
            </div>
            
            <button
              onClick={() => {
                const added = {
                  id: `RFI-${rfis.length + 401}`,
                  rfiNo: `UA-PP-RFI-CIV-${rfis.length + 106}`,
                  subject: 'ابهام در نقشه تراز رولپلاک های پایینگ بویلر واحد ۲ کارگاه',
                  discipline: 'تاسیسات و مکانیک',
                  raisedBy: 'مهندس جعفر احمدیار',
                  assignedTo: 'مهندس سارا کریمی',
                  responseDeadline: '1405/03/25',
                  status: 'Open' as const,
                  priority: 'A' as const
                };
                setRfis([added, ...rfis]);
                alert('درخواست اطلاعات (RFI) جدید ثبت و پیام اطلاع‌رسانی برای پاسخگو صادر شد.');
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ثبت RFI جدید</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <th className="py-3 px-4">کد رهگیری RFI</th>
                  <th className="py-3 px-4">موضوع ابهام فنی</th>
                  <th className="py-3 px-4">رشته تخصصی</th>
                  <th className="py-3 px-4">ثبت‌کننده</th>
                  <th className="py-3 px-4">پاسخگو</th>
                  <th className="py-3 px-4">مهلت پاسخ</th>
                  <th className="py-3 px-4">سطح فوریت</th>
                  <th className="py-3 px-4">وضعیت پرونده</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rfis.map(r => (
                  <tr key={r.id} className="hover:bg-slate-55 dark:hover:bg-slate-855 transition">
                    <td className="py-3 px-4 font-mono text-blue-600 font-bold">{r.rfiNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{r.subject}</td>
                    <td className="py-3 px-4">{r.discipline}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{r.raisedBy}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{r.assignedTo}</td>
                    <td className="py-3 px-4 font-mono">{r.responseDeadline}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        r.priority === 'A' ? 'bg-red-500/10 text-red-500' : 
                        r.priority === 'B' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        کلاس {r.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'Open' ? 'bg-blue-500/10 text-blue-500' : 
                        r.status === 'Overdue' ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {r.status === 'Open' ? 'در انتظار بررسی' : 
                         r.status === 'Overdue' ? 'مهلت منقضی شده' : 'پاسخ داده شده'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Module 11: NCR Management
    case 'ncr': {
      return (
        <div className="space-y-6" id="module-ncr">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">گزارش عدم انطباق کیفی فیزیکی (NCR List)</h3>
              <p className="text-xs text-slate-400">مستندسازی رواداری و عیوب کارگاهی به همراه علل ریشه‌ای (Root Cause) و دستور العمل PWHT</p>
            </div>
            
            <button
              onClick={() => {
                const added = {
                  id: `NCR-${ncrs.length + 501}`,
                  ncrNo: `UA-PP-NCR-QC-09${ncrs.length + 1}`,
                  description: 'عدم تطابق عیار مقاومت بتن ۲۸ روزه فونداسیون شلتر شماره ۳ با مشخصات قرارداد',
                  rootCause: 'کنترل رطوبت نادرست در دپوی ماسه پیمانکار و اختلاط با آب سيمان نامناسب.',
                  correctiveAction: 'انجام تست خرد کردن مغزه (Core Test). در صورت عدم تایید مقاومت، تخریب و بتن ریزی مجدد.',
                  severity: 'Major' as const,
                  qaqcEngineer: 'مهندس فرهاد احمدی',
                  status: 'Open' as const,
                  raisedDate: '1405/03/14'
                };
                setNcrs([added, ...ncrs]);
                alert('گزارش گزارش عدم انطباق (NCR) با موفقیت ثبت کیفی شد.');
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>ثبت گزارش مغایرت NCR</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {ncrs.map(n => (
              <div key={n.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 shadow-sm">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-600 font-mono">{n.ncrNo}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      n.severity === 'Critical' ? 'bg-red-600 text-white' :
                      n.severity === 'Major' ? 'bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      سطح اهمیت: {n.severity === 'Critical' ? 'بحرانی فاجعه‌بار' : n.severity === 'Major' ? 'متوسط و بزرگ' : 'جزئی'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">تاریخ ثبت: {n.raisedDate}</span>
                </div>

                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{n.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
                    <span className="block text-[10px] text-orange-600 font-bold mb-1">علت بروز ریشه‌ای (Root Cause):</span>
                    <p className="text-slate-700 dark:text-slate-300">{n.rootCause}</p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50">
                    <span className="block text-[10px] text-emerald-600 font-bold mb-1">اقدام اصلاحی (Corrective Action):</span>
                    <p className="text-slate-700 dark:text-slate-300">{n.correctiveAction}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500">بازرس کیفی بازبین: <strong className="text-slate-700 dark:text-slate-300">{n.qaqcEngineer}</strong></span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newStatus = n.status === 'Open' ? 'Closed' : 'Open';
                        setNcrs(ncrs.map(x => x.id === n.id ? { ...x, status: newStatus as any } : x));
                        alert('وضعیت پرونده بازرسی کیفی ویرایش یافت.');
                      }}
                      className="px-2.5 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 border rounded text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                    >
                      {n.status === 'Open' ? 'تایید و بستن پرونده (Close)' : 'بازگشایی مجدد پرونده'}
                    </button>
                    <span className={`px-3 py-1 rounded text-xs font-bold ${n.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'}`}>
                      {n.status === 'Closed' ? 'بسته شد (مختومه)' : 'پرونده باز است'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Module 12: DCC Control (Document Control)
    case 'tech-office-docs':
    case 'tech-office':
    case 'documents': {
      return (
        <div className="space-y-6" id="module-dcc">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">بایگانی و پرونده‌سازی واحد DCC (Document Control Center)</h3>
            <p className="text-xs text-slate-400">کلاسه اسناد به صورت زنده، تاریخچه ترانسمیتال‌ها و دسترسی به فایل‌های پی‌دی‌اف نقشه‌کشی</p>
          </div>
          
          <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>تعداد کل اسناد و نقشه‌های کارگاهی ثبت شده: <strong>{documents.length + shopDrawings.length + asbuiltDrawings.length} مدرک</strong></span>
            <button onClick={() => alert('مخزن DCC با دیتابیس همگام‌سازی شد.')} className="text-blue-500 hover:underline font-bold">همگام‌سازی مجدد</button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <th className="py-3 px-4">کد اختصاصی DCC</th>
                  <th className="py-3 px-4">عنوان سند رسمی</th>
                  <th className="py-3 px-4">نوع</th>
                  <th className="py-3 px-4">ورژن</th>
                  <th className="py-3 px-4">تاریخ اضافه شدن</th>
                  <th className="py-3 px-4">عملیات اسناد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-855 transition">
                    <td className="py-3 px-4 font-mono text-blue-600 font-bold">{doc.docNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{doc.title}</td>
                    <td className="py-3 px-4">{doc.type}</td>
                    <td className="py-3 px-4 font-mono font-bold">R{doc.rev}</td>
                    <td className="py-3 px-4 font-mono">{doc.dateAdded}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => alert(`دانلود پی دی اف رسمی سند ${doc.docNo} آغاز شد.`)}
                        className="text-xs text-blue-500 hover:underline font-bold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>دانلود مدرک اصلی</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Module 13: Project Control
    case 'proj-control': {
      return (
        <div className="space-y-6" id="module-project-control">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">داشبورد کنترل پروژه کارگاهی نیروگاه (MSP & Primavera)</h3>
            <p className="text-xs text-slate-400">پایش راندمان پیشرفت، مغایرت‌های مالی و پایداری لوپ برنامه زمان‌بندی کلان</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
            
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-between flex flex-col h-28">
              <span className="text-[10px] font-bold text-slate-500">شاخص کلی SPI (سبد تجمعی زمان)</span>
              <span className="text-2xl font-black text-emerald-500">۱.۰۲ SPI</span>
              <p className="text-[10px] text-slate-400">۲٪ جلوتر از برنامه مایلستون مصوب</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-between flex flex-col h-28">
              <span className="text-[10px] font-bold text-slate-500">شاخص کلی CPI (سبد تجمعی بودجه)</span>
              <span className="text-2xl font-black text-amber-500">۰.۹۵ CPI</span>
              <p className="text-[10px] text-slate-400">انحراف جزئی بودجه به علت متریال ارزی</p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-between flex flex-col h-28">
              <span className="text-[10px] font-bold text-slate-500">نرمال انحراف هزینه (Cost Variance)</span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">۲۴.۸- میلیارد</span>
              <p className="text-[10px] text-slate-400">تامین شده از وجوه ضمانتی قرارداد</p>
            </div>

          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">مدیریت مایلستون‌های فونداسیون ژنراتور بزرگ نیروگاه</h4>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">فاز پی کنی و بتن مگر</span>
                  <span className="text-[10px] text-slate-400">موعد پایان: ۱۴۰۵/۰۲/۰۲</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold font-mono">طی شده (۱۰۰٪)</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">فاز آرماتوربندی و نصب انکر بولت‌های اصلی</span>
                  <span className="text-[10px] text-slate-400">موعد پایان: ۱۴۰۵/۰۳/۰۵</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold font-mono">در حال بازبینی رواداری (۸۵٪)</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-100 block">فاز بتن ریزی حجیم و مراقبت بتن فونداسیون ژنراتور</span>
                  <span className="text-[10px] text-slate-400">موعد پایان: ۱۴۰۵/۰۴/۱۰</span>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold font-mono">آغاز نشده (۰٪)</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Module 14: Quality Assurance and Quality Control (QA/QC)
    case 'qaqc': {
      return (
        <div className="space-y-6" id="module-qa-qc">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">اناق مانیتورینگ کیفیت بتن و تست‌های تخریب‌ناپذیر جوش (QA/QC Central)</h3>
            <p className="text-xs text-slate-400">مدیریت گزارش‌های آزمون مخرب، کورگیری و التراسونیک ساپورت‌های بویلر</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">مجموعه بازرسی‌های کیفیت جوش (Weld Testing)</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950">
                  <span>تست آزمایشگاهی امواج آلتراسونیک (UT) در روت بویلر ۱</span>
                  <strong className="text-emerald-500 font-bold">قبول (Pass)</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950">
                  <span>تست مایع نافذ (PT) روی بدنه مخازن استوریج سوخت</span>
                  <strong className="text-emerald-500 font-bold">قبول (Pass)</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950">
                  <span>آزمون عیارسنجی رادیوگرافی (RT) روی لوله‌های فشار مپنا ۲</span>
                  <strong className="text-red-500 font-bold">مردود - ارجاع به NCR-501</strong>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">کنترل مقاومت نمونه گیری‌های بتن (Concrete Cube Test)</h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950">
                  <span>نمونه گیر شماره ۵ - بتن فونداسیون - عیار ۳۵۰ (تست ۷ روزه)</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-mono">۲۴.۵ MPa (تایید)</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950">
                  <span>نمونه گیر شماره ۶ - سقف گالری برق - عیار ۴۰۰ (تست ۲۸ روزه)</span>
                  <strong className="text-amber-500 font-mono">۲۸.۲ MPa (بررسی مجدد)</strong>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 dark:bg-slate-950">
                  <span>نمونه گیر شماره ۷ - بتن ریزی ستون ها - عیار ۳۵۰ (تست ۳ روزه)</span>
                  <strong className="text-slate-800 dark:text-slate-200 font-mono">۱۶.۸ MPa (تایید)</strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      );
    }

    // Module 15: Material Approval
    case 'materials': {
      return (
        <div className="space-y-6" id="module-materials">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">بررسی و تأییدیه متریال (MIV / MAR Submittal Logs)</h3>
              <p className="text-xs text-slate-400">تأییدیه کیفی، تست ریپورت زوب و بازرسی فنی متریال‌های ساخت قبل از ورود به کارگاه</p>
            </div>
            
            <button
              onClick={() => {
                const added = {
                  id: `MA-${materials.length + 201}`,
                  submittalNo: `UA-PP-MAR-0${materials.length + 454}`,
                  materialName: 'شیرهای کنترل تدریجی نیوماتیک فلو کلاس ۳۰۰ پایپینگ',
                  manufacturer: 'سامسون فرانسه',
                  countryOfOrigin: 'فرانسه',
                  subcontractor: 'دفتر فنی عمران آذرستان',
                  status: 'Pending' as const,
                  dateSubmitted: '1405/03/12'
                };
                setMaterials([added, ...materials]);
                alert('سابمیتال تأیید متریال جدید پیوست و ثبت شد.');
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ثبت سابمیتال جدید متریال</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <th className="py-3 px-4">شناسه سابمیتال MAR</th>
                  <th className="py-3 px-4">شرح متریال اقلام</th>
                  <th className="py-3 px-4">سازنده / برند</th>
                  <th className="py-3 px-4">کشور سازنده</th>
                  <th className="py-3 px-4">پیمانکار تامین</th>
                  <th className="py-3 px-4">تاریخ ارسال</th>
                  <th className="py-3 px-4">وضعیت بررسی فنی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {materials.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-855 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{m.submittalNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{m.materialName}</td>
                    <td className="py-3 px-4">{m.manufacturer}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{m.countryOfOrigin}</td>
                    <td className="py-3 px-4">{m.subcontractor}</td>
                    <td className="py-3 px-4 font-mono">{m.dateSubmitted}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                        m.status === 'Approved with Comments' ? 'bg-indigo-500/10 text-indigo-600' :
                        m.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-600 animate-pulse'
                      }`}>
                        {m.status === 'Approved' ? 'مصوب و مجاز' :
                         m.status === 'Approved with Comments' ? 'تایید مشروط به تست کاربری' :
                         m.status === 'Rejected' ? 'مردود و غیر منسجم' : 'در حال ارزیابی فنی'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Module 16: Warehouse Ledger
    case 'warehouse': {
      return (
        <div className="space-y-6" id="module-warehouse">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">موجودی انبار متریال کارگاهی نیروگاه (Warehouse Book)</h3>
              <p className="text-xs text-slate-400">پایش کدهای انبارداری، آجر عایق، لوله‌ها، فلنج‌ها و کنترل حداقل موجودی تریگر</p>
            </div>
            
            <button
              onClick={() => handleExportSim('موجودی کالاها')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border rounded-lg text-xs font-bold hover:bg-slate-200 transition text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>خروجی موجودی انبار</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <th className="py-3 px-4">کد کالا (Item Code)</th>
                  <th className="py-3 px-4">شرح کالا</th>
                  <th className="py-3 px-4">دسته‌بندی انبار</th>
                  <th className="py-3 px-4">موجودی فعلی</th>
                  <th className="py-3 px-4">واحد شمارش</th>
                  <th className="py-3 px-4">محل فیزیکی استقرار انبار</th>
                  <th className="py-3 px-4">وضعیت هشدار تقاضا</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {warehouse.map(item => {
                  const isLow = item.qty < item.minQty;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">{item.itemCode}</td>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{item.name}</td>
                      <td className="py-3 px-4">{item.category}</td>
                      <td className="py-3 px-4 font-mono font-bold">{item.qty}</td>
                      <td className="py-3 px-4">{item.unit}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{item.location}</td>
                      <td className="py-3 px-4">
                        {isLow ? (
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-bold animate-pulse">هشدار شارژ مجدد</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px]">موجودی پایدار</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Module 17: Procurement/Purchasing
    case 'procurement': {
      return (
        <div className="space-y-6" id="module-procurement">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">تدارکات کالا و مدیریت پیش‌فاکتورها (Procurement & PO Logs)</h3>
              <p className="text-xs text-slate-400">رهگیری درخواست‌های خرید کالا (PR) و فاکتورهای صادر شده تامین‌کنندگان نیروگاهی</p>
            </div>
            
            <button
              onClick={() => {
                const added = {
                  id: `PR-${procurements.length + 901}`,
                  prNo: `UA-PP-PR-010${procurements.length + 1}`,
                  itemDescription: 'خرید تجهیز کابل مسی ارت نیروگاه ترکیبی به متراژ ۲ کیلومتر',
                  requestedBy: 'واحد برق کارگاه عمران آذرستان',
                  estimatedCost: 3200000000,
                  supplier: 'صنایع سیم و کابل سازی مغان',
                  status: 'Draft' as const,
                  dateRequested: '1405/03/14'
                };
                setProcurements([added, ...procurements]);
                alert('درخواست خرید جدید پیش‌نویس (PR) درج شد.');
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ثبت درخواست خرید جدید</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <th className="py-3 px-4">کد رهگیری PR</th>
                  <th className="py-3 px-4">شرح خدمات و کالا درخواستی</th>
                  <th className="py-3 px-4">درخواست کننده مقتضی</th>
                  <th className="py-3 px-4">هزینه تخمینی (IRR)</th>
                  <th className="py-3 px-4">تامین‌کننده / فروشنده</th>
                  <th className="py-3 px-4">تاریخ ارسال کارگاه</th>
                  <th className="py-3 px-4">وضعیت فاکتور / خرید</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {procurements.map(pr => (
                  <tr key={pr.id} className="hover:bg-slate-50 dark:hover:bg-slate-855 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 dark:text-slate-400">{pr.prNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">{pr.itemDescription}</td>
                    <td className="py-3 px-4">{pr.requestedBy}</td>
                    <td className="py-3 px-4 font-mono font-bold">{pr.estimatedCost.toLocaleString('fa-IR')} ریال</td>
                    <td className="py-3 px-4">{pr.supplier}</td>
                    <td className="py-3 px-4 font-mono">{pr.dateRequested}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pr.status === 'PO Issued' ? 'bg-emerald-500/10 text-emerald-600' :
                        pr.status === 'Approved' ? 'bg-blue-500/10 text-blue-600' :
                        pr.status === 'Sent for Offer' ? 'bg-indigo-500/10 text-indigo-650 text-indigo-505' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {pr.status === 'PO Issued' ? 'انجام شد (صادر شده)' :
                         pr.status === 'Approved' ? 'مورد تایید مالی' :
                         pr.status === 'Sent for Offer' ? 'دریافت استعلام قیمت' : 'پیش‌نویس'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Module 18: Daily Reports (Gozarshe Roozane)
    case 'daily-reports': {
      return (
        <div className="space-y-6" id="module-daily-reports">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">ثبت گزارش‌های روزانه کارگاه (Daily Construction Logs)</h3>
              <p className="text-xs text-slate-400">ثبت نیروی انسانی پیمانکار، شرایط جوی و ترازهای بتن‌ریزی روز طراحان</p>
            </div>
            
            <button
              onClick={() => {
                const added = {
                  id: `DR-150${dailyReports.length + 1}`,
                  reportDate: '1405/03/16',
                  preparedBy: 'مهندس جعفر احمدیار',
                  weatherCondition: 'صاف تابان، هوای فرعی داغ ۳۹ درجه سلسیوس',
                  contractorWorkers: 250,
                  concreteVolume: 420,
                  safetyIncidents: 'فاقد هرگونه سانحه جانی و حادثه کیفی.',
                  keyActivities: '۱. تداوم کاربست پوشش ضدآب عایق ستون های ۱ الی ۶. ۲. قالب برداری فاز ۲ خروجی بویلر مپنا.'
                };
                setDailyReports([added, ...dailyReports]);
                alert('گزارش کاری روزانه کارگاه با موفقیت به مستندات اضافه شد.');
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ثبت جدید فعالیت‌های امروز</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyReports.map(rep => (
              <div key={rep.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 shadow-sm text-xs">
                
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2 rounded">
                  <span className="font-bold font-mono text-slate-700 dark:text-slate-300">گزارش روز: {rep.reportDate}</span>
                  <span className="text-[10px] text-slate-400">تهیه کننده: {rep.preparedBy}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div className="p-2 border rounded bg-slate-50/50 dark:bg-slate-950/20">
                    <span className="block text-[10px] text-slate-400">شرایط آسمان:</span>
                    <strong>{rep.weatherCondition}</strong>
                  </div>
                  <div className="p-2 border rounded bg-slate-50/50 dark:bg-slate-950/20">
                    <span className="block text-[10px] text-slate-400">نیروی کار پیمانکاران:</span>
                    <strong className="font-mono">{rep.contractorWorkers} نفر کارشناس/کارگر</strong>
                  </div>
                  <div className="p-2 border rounded bg-slate-50/50 dark:bg-slate-950/20 col-span-2">
                    <span className="block text-[10px] text-slate-400">حجم بتن‌ریزی تجمعی امروز:</span>
                    <strong className="font-mono text-blue-600 dark:text-blue-400">{rep.concreteVolume} متر مکعب بتن عیار بالا</strong>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-slate-500 block">شرح تفصیلی اقدامات و جبهه‌های کاری فعال:</span>
                  <p className="text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/30 p-2 rounded whitespace-pre-wrap leading-relaxed">{rep.keyActivities}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-red-500">
                  <strong>پایش واحد HSE:</strong> {rep.safetyIncidents}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Module 19: KPI Engine Formulas
    case 'kpi-engine': {
      return (
        <div className="space-y-6" id="module-kpi-formulas">
          <KpiEngineWidget />

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">فرمول‌نویسی ارزیابی کیفیت و زمان (EPC EPC Project Standards)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              محاسبه عیار عملکردی و رتبه‌بندی مهندسین بر اساس تعادل بین تاییدهای موفق، بازکاری‌ها (Rework Count) و سرعت زمانبندی MSP اعمال می‌شود. شاخص‌ها طبق فرمول‌های زیر در View دیتابیس پردازش می‌شوند:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="block font-bold text-blue-600">۱. شاخص کیفیت (Quality Index)</span>
                <p className="text-slate-600 dark:text-slate-400">افت کیفیت ناشی از اصلاحات زیاد شاپ در کارگاه:</p>
                <div className="p-2 bg-white dark:bg-slate-900 rounded font-black text-center text-slate-800 dark:text-slate-200">
                  QI = BaseQuality - (ReworkCount × 5)
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="block font-bold text-amber-500">۲. شاخص راندمان زمانی (Efficiency Index)</span>
                <p className="text-slate-600 dark:text-slate-400">میزان پایداری و سرعت تحویل نسبت به ددلاین مصوب:</p>
                <div className="p-2 bg-white dark:bg-slate-900 rounded font-black text-center text-slate-800 dark:text-slate-200">
                  EI = BaseEfficiency × (PlannedDays ÷ ActualDays)
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Module 20: Performance Evaluation Rankings
    case 'performance': {
      return (
        <div className="space-y-6" id="module-engineers-ranks">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">رتبه‌بندی عملکرد تیم فنی نیروگاه (Performance Evaluation)</h3>
            <p className="text-xs text-slate-400">رتبه‌بندی کیفی و کارایی پرسنل جهت تایید پایه‌های تشویقی عمران آذرستان</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600">
                  <th className="py-3 px-4">رتبه</th>
                  <th className="py-3 px-4">نام همکار</th>
                  <th className="py-3 px-4">دپارتمان</th>
                  <th className="py-3 px-4 text-center">شاخص بازکاری (RI)</th>
                  <th className="py-3 px-4 text-center">شاخص کیفیت (QI)</th>
                  <th className="py-3 px-4 text-center">شاخص راندمان (EI)</th>
                  <th className="py-3 px-4 text-center">رده کیفی کلان</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition font-medium">
                  <td className="py-3 px-4 font-mono font-bold text-amber-500">#۱</td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">مهندس سارا کریمی</td>
                  <td className="py-3 px-4">دفتر فنی کلان کارگاه</td>
                  <td className="py-3 px-4 font-mono text-center">۱.۰</td>
                  <td className="py-3 px-4 font-mono text-center text-emerald-500">۸۷.۰%</td>
                  <td className="py-3 px-4 font-mono text-center text-emerald-500">۱۰۲.۶%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">A++ ممتاز کارگاه</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-855 transition font-medium">
                  <td className="py-3 px-4 font-mono font-bold text-slate-400">#۲</td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">مهندس جعفر احمدیار</td>
                  <td className="py-3 px-4">بخش اجرایی فونداسیون</td>
                  <td className="py-3 px-4 font-mono text-center">۰.۰</td>
                  <td className="py-3 px-4 font-mono text-center text-emerald-505 text-emerald-600">۹۵.۰%</td>
                  <td className="py-3 px-4 font-mono text-center">۹۷.۰%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold">A عالی</span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 dark:hover:bg-slate-855 transition font-medium">
                  <td className="py-3 px-4 font-mono font-bold text-amber-700">#۳</td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">مهندس حمید موسوی</td>
                  <td className="py-3 px-4">کنترل پروژه و زمان</td>
                  <td className="py-3 px-4 font-mono text-center">۳.۰</td>
                  <td className="py-3 px-4 font-mono text-center text-amber-500">۵۰.۰%</td>
                  <td className="py-3 px-4 font-mono text-center text-red-500">۴۶.۶%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">B خوب</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Custom Blueprints, C# backend API, databases schema export archival
    case 'blueprints': {
      return (
        <div className="space-y-6" id="module-backend-blueprints">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">مرکز فناوری اطلاعات عمران آذرستان - صادرات کدهای بک‌اند و بانک داده</h3>
            <p className="text-xs text-slate-400">کدهای سورس شی‌گرای C# ASP.NET Core 8 و کدهای راه‌انداز SQL Server و مستندات IIS و BPMN</p>
          </div>

          <div className="space-y-6">
            {blueprintAssets.map((asset, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[9px] uppercase">{asset.category}</span>
                      <span>{asset.title}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-sans">{asset.description}</p>
                    <span className="text-[10px] text-slate-400 font-mono">نام فایل: {asset.filename}</span>
                  </div>
                  
                  <button
                    onClick={() => handleCopyCode(asset.code, idx)}
                    className="px-3 py-1 bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-bold font-sans transition flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedIndex === idx ? 'کپی شد!' : 'کپی کل متن سورس'}</span>
                  </button>
                </div>

                <div className="p-4 bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-[300px]" dir="ltr">
                  <pre className="whitespace-pre-wrap">{asset.code}</pre>
                </div>

              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'glossary': {
      return (
        <Glossary />
      );
    }

    default:
      return <div className="p-4 text-center text-slate-500">ماژول مورد نظر معتبر نیست.</div>;
  }
}
