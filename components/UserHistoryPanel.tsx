
import React from 'react';
import { Transaction } from '../types';
import { ICONS, STATUS_COLORS } from '../constants';

interface UserHistoryPanelProps {
  userId: string;
  transactions: Transaction[];
  onClose: () => void;
}

const UserHistoryPanel: React.FC<UserHistoryPanelProps> = ({ userId, transactions, onClose }) => {
  const userTx = transactions
    .filter(tx => tx.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const userName = userTx[0]?.userName || 'Unknown User';

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-[70] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
        <div>
          <h2 className="text-lg font-bold text-slate-100">{userName}</h2>
          <p className="text-xs text-slate-500 font-mono">{userId}</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl">&times;</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 flex items-center gap-2">
          {ICONS.History} Transaction Chronology
        </h3>
        {userTx.map(tx => (
          <div key={tx.id} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl space-y-3 hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono text-slate-500">{tx.id}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${STATUS_COLORS[tx.status]}`}>
                {tx.status}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-slate-100">${tx.amount.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">{tx.category}</p>
              </div>
              <p className="text-[10px] text-slate-500 text-right">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-900/50 p-2 rounded">
              {ICONS.Map} {tx.senderLocation} <span className="text-slate-700">→</span> {tx.receiverLocation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserHistoryPanel;
