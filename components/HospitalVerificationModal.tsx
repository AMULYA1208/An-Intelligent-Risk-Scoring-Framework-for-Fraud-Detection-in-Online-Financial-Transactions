
import React from 'react';
import { Transaction, TransactionStatus, HospitalBill } from '../types';
import { ICONS } from '../constants';
import { CheckCircle, Building2, AlertCircle, FileText, Fingerprint } from 'lucide-react';

interface HospitalVerificationModalProps {
  transaction: Transaction;
  onDecision: (status: TransactionStatus) => void;
  onUpdateTransaction: (tx: Transaction) => void;
  onClose: () => void;
}

const DataPanel: React.FC<{ title: string; bill?: HospitalBill; roleColor: string; icon: React.ReactNode }> = ({ title, bill, roleColor, icon }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
        <span className={`p-1 rounded ${roleColor} bg-opacity-10 text-opacity-100`}>{icon}</span> {title}
      </h3>
      
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        {bill ? (
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Patient Name</span>
              <span className="text-sm font-bold text-slate-200">{bill.patientName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Hospital Name</span>
              <span className="text-sm font-bold text-slate-200">{bill.hospitalName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Bill Number</span>
              <span className="text-sm font-mono font-bold text-blue-400">{bill.billNumber}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Bill Amount</span>
              <span className="text-sm font-bold text-emerald-400">${bill.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Bill Date</span>
              <span className="text-sm font-bold text-slate-200">{bill.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Payment Reference</span>
              <span className="text-xs font-mono font-bold text-slate-400">{bill.paymentReference}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <AlertCircle className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Waiting for Data Submission</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HospitalVerificationModal: React.FC<HospitalVerificationModalProps> = ({ 
  transaction, 
  onDecision, 
  onClose 
}) => {
  const { userBill, hospitalBill } = transaction;

  const fields = [
    { label: 'Patient Name', user: userBill?.patientName || 'N/A', hospital: hospitalBill?.patientName || 'N/A' },
    { label: 'Hospital Name', user: userBill?.hospitalName || 'N/A', hospital: hospitalBill?.hospitalName || 'N/A' },
    { label: 'Bill Number', user: userBill?.billNumber || 'N/A', hospital: hospitalBill?.billNumber || 'N/A' },
    { label: 'Amount', user: userBill ? `$${userBill.amount.toLocaleString()}` : 'N/A', hospital: hospitalBill ? `$${hospitalBill.amount.toLocaleString()}` : 'N/A' },
    { label: 'Date', user: userBill?.date || 'N/A', hospital: hospitalBill?.date || 'N/A' },
    { label: 'Payment Ref', user: userBill?.paymentReference || 'N/A', hospital: hospitalBill?.paymentReference || 'N/A' },
  ];

  const validFields = fields.filter(f => f.user !== 'N/A' && f.hospital !== 'N/A');
  const matchCount = validFields.filter(f => f.user === f.hospital).length;
  const matchScore = validFields.length > 0 ? (matchCount / fields.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-6 bg-amber-500/10 border-b border-amber-500/20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-2 rounded-full animate-pulse-amber text-slate-900">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-100 italic tracking-tight uppercase">Medical Verification Protocol</h2>
              <p className="text-xs text-amber-500 font-mono tracking-wider">SECURE CASE: {transaction.id} • INTEGRITY EVALUATION</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl font-light">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Data Comparison Panels */}
          <div className="grid grid-cols-2 gap-8">
            <DataPanel 
              title="User Submitted Data" 
              bill={userBill} 
              roleColor="text-blue-500" 
              icon={<Fingerprint className="w-4 h-4" />}
            />
            <DataPanel 
              title="Hospital Submitted Data" 
              bill={hospitalBill} 
              roleColor="text-emerald-500" 
              icon={<Building2 className="w-4 h-4" />}
            />
          </div>

          {/* Comparison Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3" /> Field Comparison Analysis
              </h4>
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-bold text-slate-400">Match Score: <span className="text-white">{matchCount}/{fields.length}</span></span>
                 <span className={`text-[10px] font-black px-2 py-0.5 rounded ${matchScore > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                   CONFIDENCE: {matchScore.toFixed(0)}%
                 </span>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                  <tr>
                    <th className="px-5 py-3 border-b border-slate-800">Attribute</th>
                    <th className="px-5 py-3 border-b border-slate-800">Extracted: User Submission</th>
                    <th className="px-5 py-3 border-b border-slate-800">Validated: Hospital Record</th>
                    <th className="px-5 py-3 border-b border-slate-800 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {fields.map((f, i) => {
                    const isMatch = f.user !== 'N/A' && f.hospital !== 'N/A' && f.user === f.hospital;
                    const isMismatch = f.user !== 'N/A' && f.hospital !== 'N/A' && f.user !== f.hospital;
                    const isMissing = f.user === 'N/A' || f.hospital === 'N/A';
                    return (
                      <tr key={i} className="bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
                        <td className="px-5 py-3 font-bold text-slate-400 text-xs">{f.label}</td>
                        <td className="px-5 py-3 text-slate-200 font-mono text-[11px]">{f.user}</td>
                        <td className="px-5 py-3 text-slate-200 font-mono text-[11px]">{f.hospital}</td>
                        <td className="px-5 py-3 text-center">
                          {isMissing ? (
                            <span className="text-[9px] font-black text-slate-600 uppercase">Awaiting</span>
                          ) : isMatch ? (
                            <span className="text-[9px] font-black text-emerald-400 uppercase bg-emerald-400/10 px-2 py-1 rounded">Match</span>
                          ) : (
                            <span className="text-[9px] font-black text-rose-400 uppercase bg-rose-400/10 px-2 py-1 rounded">Mismatch</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between p-6 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
            <div className="flex flex-col">
              <p className="text-slate-500 uppercase text-[9px] font-black tracking-[0.2em] mb-1">Final Integrity Decision</p>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${matchScore > 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></div>
                <p className={`text-xl font-black ${matchScore > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {matchScore === 100 ? 'Verified Integrity' : matchScore > 70 ? 'High Confidence' : 'Risk Detected'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => onDecision(TransactionStatus.ADMIN_REJECTED)}
                className="bg-slate-900 hover:bg-rose-950/40 text-rose-500 border border-rose-500/30 font-black py-3 px-8 rounded-xl transition-all uppercase text-xs tracking-widest"
              >
                REJECT DISBURSEMENT
              </button>
              <button 
                disabled={!userBill || !hospitalBill}
                onClick={() => onDecision(TransactionStatus.ADMIN_APPROVED)}
                className={`font-black py-3 px-8 rounded-xl shadow-2xl transition-all uppercase text-xs tracking-widest border border-transparent ${userBill && hospitalBill ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed border-slate-700'}`}
              >
                CONFIRM & APPROVE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalVerificationModal;
