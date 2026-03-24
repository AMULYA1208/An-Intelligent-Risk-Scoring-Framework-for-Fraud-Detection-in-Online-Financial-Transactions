
import React from 'react';
import { Transaction, TransactionStatus, RiskLevel } from '../types';
import { ICONS, RISK_LEVEL_COLORS } from '../constants';
import { Cpu, Fingerprint, Globe, Clock, ShieldAlert } from 'lucide-react';

interface DecisionModalProps {
  transaction: Transaction;
  onDecision: (status: TransactionStatus) => void;
  onClose: () => void;
}

const SignalItem: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-2">
      <div className="text-slate-500">{icon}</div>
      <span className="text-[11px] text-slate-400 font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${value > 70 ? 'bg-emerald-500' : value > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-slate-300 w-6 text-right">{value}%</span>
    </div>
  </div>
);

const DecisionModal: React.FC<DecisionModalProps> = ({ transaction, onDecision, onClose }) => {
  const { confidenceSignals, riskLevel } = transaction;
  const isHighRisk = riskLevel === RiskLevel.HIGH;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className={`p-6 border-b border-slate-800 flex justify-between items-center ${isHighRisk ? 'bg-rose-500/5' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`${isHighRisk ? 'bg-rose-500/20' : 'bg-orange-500/20'} p-2 rounded-lg`}>
              {isHighRisk ? <ShieldAlert className="w-6 h-6 text-rose-500" /> : ICONS.RiskHigh}
            </div>
            <div>
              <h2 className={`text-lg font-bold ${isHighRisk ? 'text-rose-100' : 'text-slate-100'}`}>
                {isHighRisk ? 'High-Risk Fraud Alert' : 'Fraud Review Required'}
              </h2>
              <p className="text-xs text-slate-400">Transaction ID: {transaction.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <span className="text-2xl">&times;</span>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-[10px] uppercase text-slate-500 mb-1">User Identity</p>
              <p className="text-sm font-medium text-slate-200">{transaction.userName}</p>
              <p className="text-[11px] text-slate-400 font-mono">ID: {transaction.userId}</p>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
              <p className="text-[10px] uppercase text-slate-500 mb-1">Financial Data</p>
              <p className="text-sm font-bold text-slate-200">${transaction.amount.toLocaleString()}</p>
              <p className="text-[11px] text-blue-400 font-bold uppercase">{transaction.category}</p>
            </div>
          </div>

          {/* Conditional Rendering: Only show Matrix if NOT High Risk */}
          {!isHighRisk && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Fingerprint className="w-3 h-3" /> Internal Confidence Matrix
                </h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${confidenceSignals.overallConfidence > 70 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  OVERALL: {confidenceSignals.overallConfidence}%
                </span>
              </div>
              <div className="space-y-1">
                <SignalItem icon={<Fingerprint className="w-3 h-3" />} label="Behavioral Consistency" value={confidenceSignals.behavioralMatch} />
                <SignalItem icon={<Cpu className="w-3 h-3" />} label="Device Reputation" value={confidenceSignals.deviceReputation} />
                <SignalItem icon={<Globe className="w-3 h-3" />} label="Network Intelligence" value={confidenceSignals.networkScore} />
                <SignalItem icon={<Clock className="w-3 h-3" />} label="Time/GPS Context" value={confidenceSignals.temporalScore} />
              </div>
            </div>
          )}

          <div className={`${isHighRisk ? 'bg-rose-950/20 border-rose-500/30' : 'bg-slate-800/50 border-slate-700'} p-4 rounded-lg border`}>
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Security Assessment</p>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${RISK_LEVEL_COLORS[transaction.riskLevel]}`}>
                SCORE: {transaction.riskScore}
              </span>
            </div>
            <ul className="space-y-2.5">
              {transaction.suspicionReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-rose-200 leading-tight">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)] flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button 
              onClick={() => onDecision(TransactionStatus.ADMIN_REJECTED)}
              className="flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-600 text-white font-black py-3 px-4 rounded-lg transition-all text-xs uppercase tracking-widest shadow-lg shadow-rose-900/20"
            >
              {ICONS.Rejected} REJECT
            </button>
            <button 
              onClick={() => onDecision(TransactionStatus.ADMIN_APPROVED)}
              className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black py-3 px-4 rounded-lg transition-all text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/20"
            >
              {ICONS.Approved} APPROVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionModal;
