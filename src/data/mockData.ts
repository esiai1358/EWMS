import {
  AppUser,
  AppRole,
  WorkflowDefinition,
  EngineeringTask,
  ShopDrawing,
  AsBuiltDrawing,
  RfiRecord,
  NcrRecord,
  DocumentRecord,
  ProjectControlMetric,
  MaterialApproval,
  WarehouseItem,
  ProcurementRequest,
  DailyReport
} from '../types';

export const mockUsers: AppUser[] = [
  {
    id: 'USR-01',
    username: 'm.esmaeili',
    fullName: 'مهندس مهدی اسماعیلی',
    position: 'سرپرست فناوری اطلاعات و ارتباطات',
    department: 'فناوری اطلاعات (ICT)',
    role: 'مدیر کل سیستم / ادمین سیستم',
    isActive: true,
    email: 'esiai1358@gmail.com'
  },
  {
    id: 'USR-02',
    username: 'a.rezaei',
    fullName: 'مهندس علیرضا رضایی',
    position: 'مدیر پروژه نیروگاه برق',
    department: 'مدیریت پروژه',
    role: 'مدیر پروژه',
    isActive: true,
    email: 'a.rezaei@azarestan.com'
  },
  {
    id: 'USR-03',
    username: 's.karimi',
    fullName: 'مهندس سارا کریمی',
    position: 'کارشناس ارشد دفتر فنی',
    department: 'دفتر فنی (Technical Office)',
    role: 'مهندس ارشد',
    isActive: true,
    email: 's.karimi@azarestan.com'
  },
  {
    id: 'USR-04',
    username: 'h.mousavi',
    fullName: 'مهندس حمید موسوی',
    position: 'سرپرست کنترل پروژه',
    department: 'کنترل پروژه',
    role: 'کنترل پروژه',
    isActive: true,
    email: 'h.mousavi@azarestan.com'
  },
  {
    id: 'USR-05',
    username: 'f.ahmadi',
    fullName: 'مهندس فرهاد احمدی',
    position: 'کارشناس تضمین کیفیت (QA/QC)',
    department: 'کنترل و تضمین کیفیت',
    role: 'مسئول QA/QC',
    isActive: true,
    email: 'f.ahmadi@azarestan.com'
  },
  {
    id: 'USR-06',
    username: 'z.hosseini',
    fullName: 'خانم زهرا حسینی',
    position: 'مسئول کنترل اسناد (DCC)',
    department: 'بخش اسناد (DCC)',
    role: 'مدیریت اسناد',
    isActive: true,
    email: 'z.hosseini@azarestan.com'
  },
  {
    id: 'USR-07',
    username: 'j.ahmadyar',
    fullName: 'مهندس جعفر احمدیار',
    position: 'سرپرست کارگاه نیروگاه',
    department: 'بخش اجرایی کارگاه',
    role: 'مهندس کارگاه',
    isActive: true,
    email: 'j.ahmadyar@azarestan.com'
  }
];

export const mockRoles: AppRole[] = [
  {
    id: 'ROL-01',
    name: 'Admin',
    persianName: 'مدیر ارشد سیستم',
    permissions: ['ALL_PERMISSIONS', 'USER_MANAGEMENT', 'WORKFLOW_CONFIG'],
    description: 'دسترسی کامل و بی قید و شرط به تمام ماژول ها و پیکربندی های سیستم'
  },
  {
    id: 'ROL-02',
    name: 'ProjectManager',
    persianName: 'مدیر پروژه',
    permissions: ['VIEW_DASHBOARD', 'APPROVE_WORKFLOW', 'PROJECT_CONTROL_EDIT'],
    description: 'مشاهده گزارش های کلان، تایید نهایی فرآیندها و امضا اسناد مالی و فنی'
  },
  {
    id: 'ROL-03',
    name: 'TechnicalOfficeLead',
    persianName: 'سرپرست دفتر فنی',
    permissions: ['ENGINEERING_EDIT', 'SHOP_DRAWING_CREATE', 'RFI_MANAGE'],
    description: 'تایید مدارک فنی مهندسی، ارسال نقشه های کارگاهی و تعیین تکلیف RFI ها'
  },
  {
    id: 'ROL-04',
    name: 'QaqcInspector',
    persianName: 'بازرس تضمین/کنترل کیفیت',
    permissions: ['NCR_CREATE', 'QA_QC_CHECK', 'MATERIAL_APPROVE_REVIEW'],
    description: 'ثبت و پایش گزارش های عدم انطباق (NCR)، بازرسی جوش و بتن ریزی کارگاه'
  },
  {
    id: 'ROL-05',
    name: 'DccOperator',
    persianName: 'اپراتور کنترل مدارک و اسناد',
    permissions: ['DOCUMENT_UPLOAD', 'TRANSMITTAL_CREATE', 'VERSION_CONTROL'],
    description: 'دریافت، ثبت، طبقه بندی و توزیع مدارک مهندسی به همراه مدیریت ترانسمیتال ها'
  },
  {
    id: 'ROL-06',
    name: 'WarehouseKeeper',
    persianName: 'انباردار کارگاه',
    permissions: ['WAREHOUSE_VIEW', 'MATERIAL_RECEIPT', 'STOCK_CONTROL'],
    description: 'ثبت کالاهای ورودی و خروجی انبار کارگاه نیروگاه و پایش حداقل موجودی'
  }
];

export const mockWorkflows: WorkflowDefinition[] = [
  {
    id: 'WF-723',
    title: 'تأیید نقشه فونداسیون ژنراتور بزرگ واحد مپنا ۱',
    creator: 'مهندس سارا کریمی',
    createdAt: '1405/03/10',
    currentStep: 'QA/QC Review',
    status: 'In Progress',
    description: 'طرح محاسباتی فونداسیون بتنی ژنراتور گازی توربین که توسط طراح ارسال شده و باید از نظر رواداری و عیار بتن ریزی بررسی شود.',
    history: [
      { date: '1405/03/10', user: 'مهندس سارا کریمی', action: 'Approve', step: 'Create Request', comment: 'نقشه پایه تهیه و فرآیند تایید راه اندازی شد.' },
      { date: '1405/03/12', user: 'مهندس علیرضا رضایی', action: 'Approve', step: 'Manager Review', comment: 'بررسی اجمالی مثبت است. جهت کنترل محاسباتی به مهندس ارشد ارجاع شد.' },
      { date: '1405/03/13', user: 'مهندس حمید موسوی', action: 'Approve', step: 'Senior Engineer', comment: 'محاسبه بارهای دینامیکی ژنراتور صحیح است، جهت عیار بتن نیاز به بازرسی کیفی دارد.' }
    ]
  },
  {
    id: 'WF-724',
    title: 'تأیید متریال لوله‌های کربن استیل فشار قوی بویلر بازیاب (HRSG)',
    creator: 'مهندس جعفر احمدیار',
    createdAt: '1405/03/08',
    currentStep: 'Final Approval',
    status: 'Approved',
    description: 'درخواست تایید متریال (MIV) خریداری شده از تامین کننده داخلی برای لوله های آلیاژی اسپک های بویلر نیروگاه.',
    history: [
      { date: '1405/03/08', user: 'مهندس جعفر احمدیار', action: 'Approve', step: 'Create Request', comment: 'مدارک تست ضربه و گواهی نامه ذوب پیوست شده است.' },
      { date: '1405/03/09', user: 'مهندس علیرضا رضایی', action: 'Approve', step: 'Manager Review', comment: 'متریال منطبق بر مدارک فنی خرید است.' },
      { date: '1405/03/10', user: 'مهندس سارا کریمی', action: 'Approve', step: 'Senior Engineer', comment: 'مورد تایید به شرط تست مجدد سختی کالا در کارگاه.' },
      { date: '1405/03/11', user: 'مهندس فرهاد احمدی', action: 'Approve', step: 'QA/QC Review', comment: 'تست آلتراسونیک جوش های نمونه تایید شد.' },
      { date: '1405/03/12', user: 'خانم زهرا حسینی', action: 'Approve', step: 'Document Control', comment: 'شماره اسناد و پرونده سازی تکمیل است.' },
      { date: '1405/03/13', user: 'مهندس حمید موسوی', action: 'Approve', step: 'Project Control', comment: 'تاخیری بر بحران پروژه تحمیل نمیکند.' },
      { date: '1405/03/14', user: 'مهندس علیرضا رضایی', action: 'Approve', step: 'Final Approval', comment: 'تایید نهایی شد. مجوز ترخیص و مصرف در لوپ بویلر صادر گردید.' }
    ]
  },
  {
    id: 'WF-725',
    title: 'بازنگری تغییر مسیر پایپینگ خنک کننده توربین کمکی',
    creator: 'مهندس سارا کریمی',
    createdAt: '1405/03/02',
    currentStep: 'Engineer',
    status: 'Returned',
    description: 'طرح تغییر زاویه ۹۰ لوله کولینگ به ۴۵ درجه به دلیل تداخل با داکت الکتریکال.',
    history: [
      { date: '1405/03/02', user: 'مهندس سارا کریمی', action: 'Approve', step: 'Create Request', comment: 'درخواست تغییر زاویه جهت ممانعت از تداخل تاسیساتی.' },
      { date: '1405/03/03', user: 'مهندس علیرضا رضایی', action: 'Approve', step: 'Manager Review', comment: 'به آتلیه طراحی جهت نقشه اصلاحی ارجاع شود.' },
      { date: '1405/03/05', user: 'مهندس حمید موسوی', action: 'Return', step: 'Senior Engineer', comment: 'طرح برگشت داده شد. زیرا محاسبات افت فشار هوا و دبی جریان آب در زاویه ۴۵ درجه مجددا نیاز به مدل سازی در نرم افزار پایپنت دارد.' }
    ]
  }
];

export const mockTasks: EngineeringTask[] = [
  {
    id: 'TSK-101',
    title: 'طراحی محاسباتی پیستون پمپ چرخشی برج خنک کننده',
    assignedEngineer: 'مهندس سارا کریمی',
    priority: 'High',
    status: 'In Progress',
    startDate: '1405/02/10',
    dueDate: '1405/03/25',
    reworkCount: 1,
    qualityScore: 88,
    efficiencyScore: 92
  },
  {
    id: 'TSK-102',
    title: 'مدل سازی نقشه های پایپینگ سه بعدی واحد بخار نیروگاه ترکیبی',
    assignedEngineer: 'مهندس جعفر احمدیار',
    priority: 'High',
    status: 'Completed',
    startDate: '1405/01/15',
    dueDate: '1405/03/01',
    reworkCount: 0,
    qualityScore: 95,
    efficiencyScore: 97
  },
  {
    id: 'TSK-103',
    title: 'تهیه اسپک فنی پوشش عایق رطوبتی لوله های زیرزمینی کارگاه',
    assignedEngineer: 'مهندس حمید موسوی',
    priority: 'Medium',
    status: 'Delayed',
    startDate: '1405/02/01',
    dueDate: '1405/03/10',
    reworkCount: 3,
    qualityScore: 65,
    efficiencyScore: 50
  },
  {
    id: 'TSK-104',
    title: 'بازرسی آلتراسونیک لوله های بویلر بخش اکونومایزر ۲',
    assignedEngineer: 'مهندس فرهاد احمدی',
    priority: 'High',
    status: 'Under Review',
    startDate: '1405/03/01',
    dueDate: '1405/03/15',
    reworkCount: 2,
    qualityScore: 90,
    efficiencyScore: 82
  }
];

export const mockShopDrawings: ShopDrawing[] = [
  {
    id: 'SD-301',
    drawingNo: 'UA-PP-ST-SD-0012',
    title: 'شاپ ریبارینگ ستون های بتنی اصلی سالن توربین',
    discipline: 'Structure',
    rev: '0',
    engineer: 'مهندس سارا کریمی',
    status: 'Approved',
    scale: '1:50'
  },
  {
    id: 'SD-302',
    drawingNo: 'UA-PP-PI-SD-0415',
    title: 'نقشه کارگاهی لایه گذاری و ساپورت های لوله تغذیه دی اریتور',
    discipline: 'Piping',
    rev: '2',
    engineer: 'مهندس جعفر احمدیار',
    status: 'Approved as Noted',
    scale: '1:100'
  },
  {
    id: 'SD-303',
    drawingNo: 'UA-PP-EL-SD-0701',
    title: 'جانمایی و مسیر کابل های برق فشار قوی ترانسفورماتور پست توزیع',
    discipline: 'Electrical',
    rev: '1',
    engineer: 'مهندس حمید موسوی',
    status: 'Revised & Resubmit',
    scale: '1:200'
  }
];

export const mockAsBuiltDrawings: AsBuiltDrawing[] = [
  {
    id: 'AB-801',
    drawingNo: 'UA-PP-ME-AB-3001',
    title: 'نقشه ازبیل‌ نصب مکانیکی بدنه اگزاست دودکش بویلر',
    rev: 'A',
    approvedBy: 'مهندس علیرضا رضایی',
    siteVerified: true,
    issueDate: '1405/02/20',
    notes: 'تغییر جزئی در محل ساپورت های جوشی شماره ۴ اعمال و نقشه بروز شد.'
  },
  {
    id: 'AB-802',
    drawingNo: 'UA-PP-ST-AB-1205',
    title: 'نقشه ازبیل پی کنی کانال آب خروجی کندانسور به برج خنک کننده',
    rev: '0',
    approvedBy: 'مهندس فرهاد احمدی',
    siteVerified: true,
    issueDate: '1405/03/05',
    notes: 'تراز حفاری نهایی به علت برخورد با سنگ بستر سفت، ۱۰ سانتی متر بالاتر از طرح مصوب قرار گرفت.'
  }
];

export const mockRfis: RfiRecord[] = [
  {
    id: 'RFI-401',
    rfiNo: 'UA-PP-RFI-CIV-105',
    subject: 'مغایرت تراز آکس های فونداسیون کمپرسور گاز خانه شماره ۲ با استراکچر استیل',
    discipline: 'عمران و سازه',
    raisedBy: 'مهندس جعفر احمدیار',
    assignedTo: 'مهندس سارا کریمی',
    responseDeadline: '1405/03/20',
    status: 'Open',
    priority: 'A'
  },
  {
    id: 'RFI-402',
    rfiNo: 'UA-PP-RFI-PIP-224',
    subject: 'عدم تطابق دیتایل عایق کاری شیرهای کنترل در مدارک مشاور با نقشه های شاپ خارجی وندور',
    discipline: 'مکانیک و پایپینگ',
    raisedBy: 'مهندس سارا کریمی',
    assignedTo: 'مهندس علیرضا رضایی',
    responseDeadline: '1405/03/12',
    status: 'Closed',
    priority: 'B'
  },
  {
    id: 'RFI-403',
    rfiNo: 'UA-PP-RFI-INS-331',
    subject: 'نوع سنسور حرارتی پیوسته دمای بیرینگ ژنراتور گاز در مدارک خرید ابزار دقیق بویلر',
    discipline: 'ابزار دقیق و کنترل',
    raisedBy: 'مهندس حمید موسوی',
    assignedTo: 'مهندس فرهاد احمدی',
    responseDeadline: '1405/03/01',
    status: 'Overdue',
    priority: 'C'
  }
];

export const mockNcrs: NcrRecord[] = [
  {
    id: 'NCR-501',
    ncrNo: 'UA-PP-NCR-QC-088',
    description: 'تنش پسماند جوش ریشه لوله های آب تغذیه فراتر از حد مجاز استاندارد ASME Sec IX',
    rootCause: 'پیش گرمایش ناکافی لوله به هنگام جوشکاری و سرعت خنک کاری بالا به دلیل وزش باد شدید در کارگاه.',
    correctiveAction: 'برش جوش معیوب، پیش گرم در دمای ۱۵۰ درجه سلسیوس، عملیات تنش زدایی قطعه (PWHT) به مدت ۱ ساعت.',
    severity: 'Critical',
    qaqcEngineer: 'مهندس فرهاد احمدی',
    status: 'Open',
    raisedDate: '1405/03/02'
  },
  {
    id: 'NCR-502',
    ncrNo: 'UA-PP-NCR-QC-089',
    description: 'استفاده از مصالح سنگی و شن با درصد رس بالاتر از حد مجاز در بتن ریزی سقف گالری برق کارگاه',
    rootCause: 'نداشتن شستشوی مناسب ماسه خروجی از کارگاه ماسه شویی دپو تامین کننده جانبی.',
    correctiveAction: 'نمونه مغزه گیری بتن (کور گیری) جهت تست ۲۸ روزه فشار بتن. شستشوی دپو مصالح باقی مانده.',
    severity: 'Major',
    qaqcEngineer: 'مهندس فرهاد احمدی',
    status: 'Under Investigation',
    raisedDate: '1405/03/11'
  },
  {
    id: 'NCR-503',
    ncrNo: 'UA-PP-NCR-QC-090',
    description: 'عدم ارائه گزارش کالیبراسیون دستگاه های ضخامت سنج رنگ مخازن استوریج سوخت مایع کارگاه',
    rootCause: 'فراموشی اپراتور پیمانکار فرعی و منقضی شدن مدت کالیبراتور خارجی.',
    correctiveAction: 'متوقف کردن فعالیت رنگ آمیزی و ارسال دستگاه به آزمایشگاه مرجع کالیبراسیون جهت اخذ گواهی مجدد.',
    severity: 'Minor',
    qaqcEngineer: 'مهندس فرهاد احمدی',
    status: 'Closed',
    raisedDate: '1405/02/25'
  }
];

export const mockDocuments: DocumentRecord[] = [
  {
    id: 'DOC-601',
    docNo: 'UA-PP-DCC-PRO-4015',
    title: 'روش اجرایی جوشکاری کامپوننت های آلیاژی با متد GTAW+SMAW',
    type: 'Procedure',
    category: 'QA/QC Docs',
    rev: '3',
    confidentiality: 'Confidential',
    dateAdded: '1405/01/20'
  },
  {
    id: 'DOC-602',
    docNo: 'UA-PP-DCC-SPC-0012',
    title: 'مشخصات فنی عمومی خرید و تست تجهیزات اتاق فرمان نیروگاه برق',
    type: 'Specification',
    category: 'Engineering Spec',
    rev: '1',
    confidentiality: 'Strictly Confidential',
    dateAdded: '1405/02/10'
  },
  {
    id: 'DOC-603',
    docNo: 'UA-PP-DCC-MOM-048',
    title: 'صورتجلسه هم راستاسازی تجهیز لرزه گیر بیرینگ پمپ های سانتریفیوژ اصلی',
    type: 'Minutes',
    category: 'Site Meetings',
    rev: '0',
    confidentiality: 'Public',
    dateAdded: '1405/03/05'
  }
];

export const mockMaterialApprovals: MaterialApproval[] = [
  {
    id: 'MA-201',
    submittalNo: 'UA-PP-MAR-0453',
    materialName: 'کابل قدرت XLPE شیلددار هادی مس مقطع ۲۴۰ میلیمتر مربع',
    manufacturer: 'صنایع سیم و کابل ابهر',
    countryOfOrigin: 'ایران',
    subcontractor: 'شرکت نصب نیرو عمران',
    status: 'Approved',
    dateSubmitted: '1405/02/18'
  },
  {
    id: 'MA-202',
    submittalNo: 'UA-PP-MAR-0454',
    materialName: 'الکترودهای فوق قلیایی جوش بویلرهای فشار بالای آلیاژی E9015-B9',
    manufacturer: 'بوهلر ولدینگ آلمان',
    countryOfOrigin: 'آلمان (خرید بازار استوک)',
    subcontractor: 'شرکت آذر آب',
    status: 'Approved with Comments',
    dateSubmitted: '1405/02/28'
  },
  {
    id: 'MA-203',
    submittalNo: 'UA-PP-MAR-0455',
    materialName: 'پمپ تزریق سود سوزآور پکیج شیمیایی بویلر بازیاب حرارت',
    manufacturer: 'میلتون روی فرانسه',
    countryOfOrigin: 'فرانسه',
    subcontractor: 'تجهیزات پترو بویلر',
    status: 'Rejected',
    dateSubmitted: '1405/03/08'
  }
];

export const mockWarehouseItems: WarehouseItem[] = [
  {
    id: 'WH-5001',
    itemCode: 'ITEM-PP-VLV-0442',
    name: 'شیر دروازه ای فولادی کلاس ۶۰۰ با کانکشن فلنجی سایز ۱۲ اینچ',
    category: 'Piping components',
    qty: 12,
    unit: 'عدد',
    location: 'انبار شماره ۳ قطعات سنگین پایپینگ کارگاه نیروگاه برق آذرستان',
    minQty: 4
  },
  {
    id: 'WH-5002',
    itemCode: 'ITEM-PP-ELD-9981',
    name: 'الکترود جوش آرگون E7018 سایز ۳.۲ میلیمتر آما',
    category: 'Consumables',
    qty: 2450,
    unit: 'کیلوگرم',
    location: 'انبار خشک شماره ۱ کارگاه (کنترل رطوبت)',
    minQty: 500
  },
  {
    id: 'WH-5003',
    itemCode: 'ITEM-PP-INS-4451',
    name: 'ترانسمیتر هوشمند اختلاف فشار دیافراگمی HART سری 3051 Rosemount',
    category: 'Instrumentation',
    qty: 8,
    unit: 'دستگاه',
    location: 'انبار ابزار دقیق حساس با دمای کنترل شده اتاق شماره ۲',
    minQty: 10
  }
];

export const mockProcurementRequests: ProcurementRequest[] = [
  {
    id: 'PR-901',
    prNo: 'UA-PP-PR-0098',
    itemDescription: 'خرید مابقی لوله های کربن استیل مانیسمان رده ۸۰ سایز ۸ اینچ فاقد درز طبق اسپک پیوست',
    requestedBy: 'دفتر فنی کارگاه - عمران آذرستان',
    estimatedCost: 14500000000, // Rial
    supplier: 'فولاد صنعت سپاهان',
    status: 'PO Issued',
    dateRequested: '1405/01/22'
  },
  {
    id: 'PR-902',
    prNo: 'UA-PP-PR-0099',
    itemDescription: 'تامین وندور کالیبراسیون شیرهای داحلی ایمنی بویلرهای نیروگاه ترکیبی از مشاور ارشد',
    requestedBy: 'مدیریت کیفیت کارگاه نیروگاه برق کارفرما- مپنا',
    estimatedCost: 4500000000,
    supplier: 'خدمات بازرسی مهندسی تکین کو',
    status: 'Approved',
    dateRequested: '1405/02/15'
  },
  {
    id: 'PR-903',
    prNo: 'UA-PP-PR-0100',
    itemDescription: 'خرید رنگ رویه بر پایه رزین اپوکسی ضد جو زمین به مقدار ۴ تن به همراه حلال مربوطه',
    requestedBy: 'سرپرست بخش اجرایی سازه نیروگاه',
    estimatedCost: 6800000000,
    supplier: 'شرکت رنگ ساز ی الوان',
    status: 'Sent for Offer',
    dateRequested: '1405/03/10'
  }
];

export const mockDailyReports: DailyReport[] = [
  {
    id: 'DR-1501',
    reportDate: '1405/03/14',
    preparedBy: 'مهندس جعفر احمدیار',
    weatherCondition: 'صاف و آفتابی، حداکثر دمای هوا ۳۸ درجه به همراه وزش باد متوسط',
    contractorWorkers: 245,
    concreteVolume: 650,
    safetyIncidents: 'بدون حادثه جانی و مالی. یک مورد گزارش شبه حادثه مربوط به عدم مهار کپسول های فرعی هوابرش.',
    keyActivities: '۱. ادامه بتن ریزی دیوار حائل بلوک ۳ سالن اصلی توربین گازی. ۲. تحویل و تخلیه ۱۲ شاخه لوله استیل ورودی انبار کارگاه. ۳. جوشکاری و شیار زنی ساپورت های بویلر کمکی بازیاب مپنا.'
  },
  {
    id: 'DR-1502',
    reportDate: '1405/03/15',
    preparedBy: 'مهندس جعفر احمدیار',
    weatherCondition: 'نیمه ابری همراه با بارش گرد و غبار محلی سنگین بعدازظهر کارگاه',
    contractorWorkers: 210,
    concreteVolume: 120,
    safetyIncidents: 'بدون حادثه جانی. به علت گرد باد کار در ارتفاع سقف اصلی بویلر برای ۳ ساعت متوقف شد.',
    keyActivities: '۱. اجرای فونداسیون شاسی فن های اکسیژن دهنده در ارتفاع ۶ متری. ۲. مونتاژ تجهیزات مکانیک کابین تصفیه روغن هیدرولیک.'
  }
];

export const mockProjectMetrics: ProjectControlMetric[] = [
  {
    id: 'PROJ-01',
    projectName: 'بخش فونداسیون و ابنیه نیروگاه برق آذرستان',
    plannedProgress: 98,
    actualProgress: 97.4,
    cpi: 1.02,
    spi: 0.99,
    budget: 450,
    costVariance: 9.0
  },
  {
    id: 'PROJ-02',
    projectName: 'پایپینگ بویلر بازیاب حرارتی (HRSG)',
    plannedProgress: 75,
    actualProgress: 68.2,
    cpi: 0.92,
    spi: 0.91,
    budget: 850,
    costVariance: -32.5
  },
  {
    id: 'PROJ-03',
    projectName: 'بخش ترانسفورماتورها و پست فشار قوی توزیع',
    plannedProgress: 42,
    actualProgress: 39.8,
    cpi: 0.97,
    spi: 0.95,
    budget: 620,
    costVariance: -14.2
  },
  {
    id: 'PROJ-04',
    projectName: 'ابزار دقیق و کابل کشی اتاق فرمان اصلی نیروگاه',
    plannedProgress: 15,
    actualProgress: 18.5,
    cpi: 1.15,
    spi: 1.23,
    budget: 380,
    costVariance: 22.8
  }
];
