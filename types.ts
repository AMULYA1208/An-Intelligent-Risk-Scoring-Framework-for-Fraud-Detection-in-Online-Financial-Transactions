
export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum TransactionStatus {
  AUTO_APPROVED = 'Auto-Approved',
  AUTO_REJECTED = 'Auto-Rejected',
  PENDING_MEDICAL = 'Pending Medical Verification',
  PENDING_FRAUD = 'Pending Fraud Review',
  ADMIN_APPROVED = 'Admin Approved',
  ADMIN_REJECTED = 'Admin Rejected'
}

export enum DecisionType {
  AUTO = 'Auto',
  ADMIN = 'Admin'
}

export type TransactionCategory = 
  | 'Merchant' 
  | 'Hospital' 
  | 'Groceries' 
  | 'Entertainment' 
  | 'Travel' 
  | 'Utilities' 
  | 'Financial';

export interface ConfidenceSignals {
  behavioralMatch: number;      // Scroll speed, click patterns
  deviceReputation: number;     // Hardware ID safety score
  networkScore: number;         // ISP/Proxy/VPN safety score
  temporalScore: number;        // Time-of-day vs GPS state score
  overallConfidence: number;    // Weighted average
}

export interface HospitalBill {
  patientName: string;
  hospitalName: string;
  billNumber: string;
  amount: number;
  date: string;
  paymentReference: string;
  documentData?: string; 
  fileName?: string;
  uploadedBy: 'USER' | 'HOSPITAL';
  uploadTimestamp?: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  amount: number;
  senderLocation: string;
  receiverLocation: string;
  category: TransactionCategory;
  riskScore: number;
  riskLevel: RiskLevel;
  suspicionReasons: string[];
  decisionType: DecisionType;
  status: TransactionStatus;
  confidenceSignals: ConfidenceSignals;
  userBill?: HospitalBill;
  hospitalBill?: HospitalBill;
}

export interface AuditLog {
  id: string;
  transactionId: string;
  decision: TransactionStatus;
  timestamp: string;
  adminId: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  contact: string;
}
