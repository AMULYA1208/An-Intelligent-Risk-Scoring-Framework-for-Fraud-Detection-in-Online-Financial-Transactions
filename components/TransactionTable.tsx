import React from 'react';
import { Transaction, TransactionStatus, RiskLevel } from '../types';
import { ICONS, RISK_LEVEL_COLORS, STATUS_COLORS } from '../constants';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectUser: (userId: string) => void;
  onReview: (tx: Transaction) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onSelectUser, onReview }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/50">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-950/50 sticky top-0 z-10">
          <tr className="text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 font-semibold">Transaction ID</th>
            <th className="px-4 py-3 font-semibold">Time</th>
            <th className="px-4 py-3 font-semibold">User</th>
            <th className="px-4 py-3 font-semibold text-right">Amount</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Risk Score</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {transactions.map((tx) => {
            const isPendingMedical = tx.status === TransactionStatus.PENDING_MEDICAL;
            const isPendingFraud = tx.status === TransactionStatus.PENDING_FRAUD;
            const isHighRisk = tx.riskLevel === RiskLevel.HIGH;

            let rowClass = "hover:bg-slate-800/30 transition-colors group";
            
            // Apply neon blinking classes based on priority
            if (isPendingMedical && isHighRisk) {
              rowClass += " animate-blink-critical";
            } else if (isPendingMedical || isPendingFraud) {
              rowClass += " animate-blink-pending";
            }

            return (
              <tr key={tx.id} className={rowClass}>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-xs text-slate-100">{tx.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={() => onSelectUser(tx.userId)}
                    className="flex flex-col text-left hover:text-blue-400 transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-100">{tx.userName}</span>
                    <span className="text-xs text-slate-500">{tx.userId}</span>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-mono font-medium text-slate-100">
                    ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {tx.category}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${RISK_LEVEL_COLORS[tx.riskLevel]}`}>
                      {tx.riskLevel} {tx.riskScore}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${STATUS_COLORS[tx.status as keyof typeof STATUS_COLORS]}`}>
                    {tx.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {tx.status === TransactionStatus.PENDING_MEDICAL || tx.status === TransactionStatus.PENDING_FRAUD ? (
                    <button 
                      onClick={() => onReview(tx)}
                      className="text-[11px] font-bold text-blue-400 hover:text-blue-300 border border-blue-400/30 px-2 py-1 rounded bg-blue-400/10"
                    >
                      REVIEW
                    </button>
                  ) : (
                    <span className="text-slate-600 text-[10px]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-20 text-center text-slate-500">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;