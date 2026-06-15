export interface AppUser {
  id: string;
  username: string;
  fullName: string;
  position: string;
  department: string;
  role: string;
  isActive: boolean;
  email: string;
}

export interface AppRole {
  id: string;
  name: string;
  persianName: string;
  permissions: string[];
  description: string;
}

export interface WorkflowDefinition {
  id: string;
  title: string;
  creator: string;
  createdAt: string;
  currentStep: WorkflowStepName;
  status: 'Approved' | 'Rejected' | 'In Progress' | 'Returned';
  description: string;
  history: WorkflowHistory[];
}

export type WorkflowStepName = 
  | 'Create Request'
  | 'Manager Review'
  | 'Senior Engineer'
  | 'Engineer'
  | 'QA/QC Review'
  | 'Document Control'
  | 'Project Control'
  | 'Final Approval';

export interface WorkflowHistory {
  date: string;
  user: string;
  action: 'Approve' | 'Reject' | 'Return' | 'Escalate' | 'Delegate';
  step: WorkflowStepName;
  comment: string;
}

export interface EngineeringTask {
  id: string;
  title: string;
  assignedEngineer: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Completed' | 'In Progress' | 'Delayed' | 'Under Review';
  startDate: string;
  dueDate: string;
  reworkCount: number;
  qualityScore: number; // 0-100
  efficiencyScore: number; // 0-100
}

export interface ShopDrawing {
  id: string;
  drawingNo: string;
  title: string;
  discipline: 'Structure' | 'Architecture' | 'Mechanical' | 'Electrical' | 'Piping';
  rev: string;
  engineer: string;
  status: 'Approved' | 'Approved as Noted' | 'Revised & Resubmit' | 'Void';
  scale: string;
}

export interface AsBuiltDrawing {
  id: string;
  drawingNo: string;
  title: string;
  rev: string;
  approvedBy: string;
  siteVerified: boolean;
  issueDate: string;
  notes: string;
}

export interface RfiRecord {
  id: string;
  rfiNo: string;
  subject: string;
  discipline: string;
  raisedBy: string;
  assignedTo: string;
  responseDeadline: string;
  status: 'Open' | 'Closed' | 'Overdue';
  priority: 'A' | 'B' | 'C';
}

export interface NcrRecord {
  id: string;
  ncrNo: string;
  description: string;
  rootCause: string;
  correctiveAction: string;
  severity: 'Critical' | 'Major' | 'Minor';
  qaqcEngineer: string;
  status: 'Open' | 'Closed' | 'Under Investigation';
  raisedDate: string;
}

export interface DocumentRecord {
  id: string;
  docNo: string;
  title: string;
  type: 'Procedure' | 'Specification' | 'Drawing' | 'Report' | 'Minutes';
  category: string;
  rev: string;
  confidentiality: 'Public' | 'Confidential' | 'Strictly Confidential';
  dateAdded: string;
}

export interface ProjectControlMetric {
  id: string;
  projectName: string;
  plannedProgress: number; // percentage
  actualProgress: number; // percentage
  cpi: number; // Cost Performance Index
  spi: number; // Schedule Performance Index
  budget: number; // billion Rials
  costVariance: number;
}

export interface MaterialApproval {
  id: string;
  submittalNo: string;
  materialName: string;
  manufacturer: string;
  countryOfOrigin: string;
  subcontractor: string;
  status: 'Approved' | 'Approved with Comments' | 'Rejected' | 'Pending';
  dateSubmitted: string;
}

export interface WarehouseItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  qty: number;
  unit: string;
  location: string;
  minQty: number;
}

export interface ProcurementRequest {
  id: string;
  prNo: string;
  itemDescription: string;
  requestedBy: string;
  estimatedCost: number; // IRR
  supplier: string;
  status: 'Draft' | 'Sent for Offer' | 'Approved' | 'PO Issued';
  dateRequested: string;
}

export interface DailyReport {
  id: string;
  reportDate: string;
  preparedBy: string;
  weatherCondition: string;
  contractorWorkers: number;
  concreteVolume: number; // cubic meters
  safetyIncidents: string;
  keyActivities: string;
}

export interface BlueprintAsset {
  filename: string;
  category: 'C#' | 'SQL' | 'BPMN' | 'Config' | 'Doc';
  title: string;
  description: string;
  code: string;
}
