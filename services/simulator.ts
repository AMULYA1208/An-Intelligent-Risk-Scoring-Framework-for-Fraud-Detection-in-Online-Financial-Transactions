import { Transaction, RiskLevel, TransactionStatus, DecisionType, TransactionCategory, HospitalBill, ConfidenceSignals } from '../types';
import { calculateRisk } from './scoring';

const NAMES = ["James Wilson", "Sarah Parker", "Michael Chen", "Emma Rodriguez", "David Kim", "Sophia Al-Fayed", "Lucas Jensen", "Olivia Smith", "Robert Brown"];
const LOCATIONS = ["New York, USA", "London, UK", "Singapore, SG", "Dubai, UAE", "Berlin, DE", "Tokyo, JP", "Sydney, AU", "Paris, FR"];
const CATEGORIES: TransactionCategory[] = ["Merchant", "Hospital", "Groceries", "Entertainment", "Travel", "Utilities", "Financial"];

const evaluateConfidenceSignals = (amount: number, isCrossBorder: boolean, category: TransactionCategory): ConfidenceSignals => {
  let behavioralMatch = Math.floor(Math.random() * 40) + 60; 
  if (amount > 10000) behavioralMatch -= 15;

  const deviceReputation = Math.random() > 0.1 ? (Math.floor(Math.random() * 30) + 70) : (Math.floor(Math.random() * 40) + 20);

  let networkScore = Math.random() > 0.9 ? 30 : 95;
  if (isCrossBorder) networkScore -= 20;

  let temporalScore = Math.floor(Math.random() * 30) + 70;
  if (category === 'Travel' || category === 'Entertainment') {
    temporalScore = Math.random() > 0.8 ? 40 : 85;
  }

  const overallConfidence = (
    (behavioralMatch * 0.3) +
    (deviceReputation * 0.3) +
    (networkScore * 0.2) +
    (temporalScore * 0.2)
  );

  return {
    behavioralMatch: Math.max(0, Math.min(100, behavioralMatch)),
    deviceReputation: Math.max(0, Math.min(100, deviceReputation)),
    networkScore: Math.max(0, Math.min(100, networkScore)),
    temporalScore: Math.max(0, Math.min(100, temporalScore)),
    overallConfidence: Math.round(overallConfidence)
  };
};

export const generateTransaction = (forceHighRiskHospital = false): Transaction => {
  const id = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const userId = `USR-${Math.floor(1000 + Math.random() * 9000)}`;
  const userName = NAMES[Math.floor(Math.random() * NAMES.length)];
  const senderLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const receiverLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const category = forceHighRiskHospital ? "Hospital" : CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const amount = forceHighRiskHospital ? 25000 + Math.random() * 15000 : Math.random() * 15000;
  
  const { score, level, reasons } = calculateRisk(amount, senderLocation, receiverLocation, category, 0);
  
  const isCrossBorder = senderLocation.split(',')[1] !== receiverLocation.split(',')[1];
  const confidenceSignals = evaluateConfidenceSignals(amount, isCrossBorder, category);
  
  let status: TransactionStatus;
  let decisionType: DecisionType = DecisionType.AUTO;

  // Hospital category ALWAYS goes to verification queue to showcase the neon alerts
  if (category === 'Hospital') {
    status = TransactionStatus.PENDING_MEDICAL;
    decisionType = DecisionType.ADMIN;
  } else if (level === RiskLevel.LOW) {
    status = TransactionStatus.AUTO_APPROVED;
    decisionType = DecisionType.AUTO;
  } else if (level === RiskLevel.MEDIUM) {
    if (confidenceSignals.overallConfidence >= 70) {
      status = TransactionStatus.AUTO_APPROVED;
    } else {
      status = TransactionStatus.AUTO_REJECTED;
    }
    decisionType = DecisionType.AUTO;
  } else { // HIGH RISK
    status = TransactionStatus.PENDING_FRAUD;
    decisionType = DecisionType.ADMIN;
  }

  let userBill: HospitalBill | undefined = undefined;
  let hospitalBill: HospitalBill | undefined = undefined;

  if (category === "Hospital" && (status === TransactionStatus.PENDING_MEDICAL)) {
    const billNum = `HB-${Math.floor(100000 + Math.random() * 900000)}`;
    const billDate = new Date().toISOString().split('T')[0];
    const uploadTime = new Date(Date.now() - 1000 * 60 * 15).toISOString();
    const payRef = `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    userBill = {
      patientName: userName,
      hospitalName: "Global Health Center",
      billNumber: billNum,
      amount: Math.floor(amount),
      date: billDate,
      paymentReference: payRef,
      uploadedBy: 'USER',
      uploadTimestamp: uploadTime
    };

    // Increased mismatch probability to 40% (random > 0.6) for better visibility
    const isMismatch = Math.random() > 0.6;
    hospitalBill = {
      patientName: userName,
      hospitalName: "Global Health Center",
      billNumber: isMismatch ? `HB-ERR-${Math.floor(Math.random() * 999)}` : billNum,
      amount: isMismatch ? Math.floor(amount * 1.12) : Math.floor(amount),
      date: billDate,
      paymentReference: payRef,
      uploadedBy: 'HOSPITAL',
      uploadTimestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    };
  }

  return {
    id,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    amount,
    senderLocation,
    receiverLocation,
    category,
    riskScore: score,
    riskLevel: level,
    suspicionReasons: reasons,
    decisionType,
    status,
    confidenceSignals,
    userBill,
    hospitalBill
  };
};

export const getInitialData = (): Transaction[] => [];
