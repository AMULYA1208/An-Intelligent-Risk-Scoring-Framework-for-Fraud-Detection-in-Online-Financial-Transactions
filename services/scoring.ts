
import { RiskLevel, Transaction, TransactionStatus, DecisionType } from '../types';

export const calculateRisk = (
  amount: number, 
  senderLoc: string, 
  receiverLoc: string, 
  category: string,
  userHistoryCount: number
): { score: number; level: RiskLevel; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  // Factor 1: Amount
  if (amount > 10000) {
    score += 45;
    reasons.push("Abnormally high transaction amount");
  } else if (amount > 5000) {
    score += 25;
    reasons.push("High transaction amount");
  }

  // Factor 2: Location Anomaly
  if (senderLoc !== receiverLoc) {
    const isDifferentLocation = !senderLoc.includes(receiverLoc.split(',')[1]);
    if (isDifferentLocation) {
      score += 30;
      reasons.push("Different geographical location detected");
    } else {
      score += 15;
      reasons.push("Geographic distance anomaly");
    }
  }

  // Factor 3: Category Specific
  if (category === 'Hospital' && amount > 20000) {
    score += 40;
    reasons.push("Critical medical expense spike");
  }

  // Factor 4: Velocity (Simulated via random for demo or user history)
  if (userHistoryCount > 5) {
     score += 20;
     reasons.push("Velocity pattern: Rapid repeated transactions");
  }

  // Factor 5: Random noise/behavioral drift
  score += Math.floor(Math.random() * 15);

  // Cap score
  score = Math.min(score, 100);

  let level = RiskLevel.LOW;
  if (score >= 70) level = RiskLevel.HIGH;
  else if (score >= 40) level = RiskLevel.MEDIUM;

  return { score, level, reasons };
};

// Fix: TransactionStatus.PENDING was used but is not defined in the enum.
// Defaulting to PENDING_FRAUD for any non-low risk levels requiring manual review.
export const getAutoDecision = (score: number, level: RiskLevel) => {
  if (level === RiskLevel.LOW) {
    return { status: TransactionStatus.AUTO_APPROVED, type: DecisionType.AUTO };
  }
  return { status: TransactionStatus.PENDING_FRAUD, type: DecisionType.ADMIN };
};
