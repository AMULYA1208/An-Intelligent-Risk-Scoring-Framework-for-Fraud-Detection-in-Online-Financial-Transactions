
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Transaction, 
  TransactionStatus, 
  RiskLevel, 
  AuditLog, 
  AdminProfile
} from './types';
import { ICONS, DEFAULT_ADMIN_PASSWORD } from './constants';
import { ShieldAlert, Activity, Zap, ClipboardList, Stethoscope, Search } from 'lucide-react';
import { generateTransaction } from './services/simulator';
import TransactionTable from './components/TransactionTable';
import DecisionModal from './components/DecisionModal';
import HospitalVerificationModal from './components/HospitalVerificationModal';
import UserHistoryPanel from './components/UserHistoryPanel';
import Analytics from './components/Analytics';
import Profile from './components/Profile';

type ViewMode = 'dashboard' | 'analytics' | 'profile' | 'medicalQueue' | 'fraudQueue';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTrafficRunning, setIsTrafficRunning] = useState(false);
  const [selectedTxForReview, setSelectedTxForReview] = useState<Transaction | null>(null);
  const [selectedUserIdForHistory, setSelectedUserIdForHistory] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Admin User',
    email: 'admin@trustiq.io',
    contact: '+1 800-TRUST-IQ'
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Derived Queues
  const medicalQueue = useMemo(() => 
    transactions.filter(t => t.status === TransactionStatus.PENDING_MEDICAL),
    [transactions]
  );
  const fraudQueue = useMemo(() => 
    transactions.filter(t => t.status === TransactionStatus.PENDING_FRAUD),
    [transactions]
  );

  useEffect(() => {
    let interval: number | undefined;
    if (isTrafficRunning) {
      interval = window.setInterval(() => {
        const newTx = generateTransaction();
        setTransactions(prev => [newTx, ...prev].slice(0, 500));

        // Auto-Popup Triggering Logic
        setSelectedTxForReview(prev => {
          if (prev) return prev; 
          if (newTx.status === TransactionStatus.PENDING_MEDICAL || newTx.status === TransactionStatus.PENDING_FRAUD) {
            return newTx; 
          }
          return null;
        });
      }, 6000);
    }
    return () => window.clearInterval(interval);
  }, [isTrafficRunning]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.password === DEFAULT_ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setTransactions([]); 
      setLoginError('');
    } else {
      setLoginError('Invalid administrator credentials.');
    }
  };

  const handleDecision = (txId: string, status: TransactionStatus) => {
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status } : tx));
    setAuditLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      transactionId: txId,
      decision: status,
      timestamp: new Date().toISOString(),
      adminId: 'ADMIN-01'
    }, ...prev]);
    setSelectedTxForReview(null);
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
    if (selectedTxForReview?.id === updatedTx.id) {
      setSelectedTxForReview(updatedTx);
    }
  };

  const filteredTransactions = useMemo(() => {
    let list = transactions;
    if (currentView === 'medicalQueue') list = medicalQueue;
    if (currentView === 'fraudQueue') list = fraudQueue;

    return list.filter(tx => 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, medicalQueue, fraudQueue, searchQuery, currentView]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950"></div>
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">TrustIQ Fraud Engine</h1>
            <p className="text-slate-500 text-sm mt-1">Authorized Admin Portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Username"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <input 
                type="password" 
                placeholder="Password"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            {loginError && <p className="text-red-400 text-xs text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs">
              SECURE LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col z-50 bg-slate-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/10">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <span className="font-black text-xs tracking-tighter text-blue-100 uppercase">TrustIQ Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {ICONS.Dashboard} Monitor
          </button>
          <button 
            onClick={() => setCurrentView('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${currentView === 'analytics' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {ICONS.Analytics} Intelligence
          </button>
          <button 
            onClick={() => setCurrentView('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${currentView === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {ICONS.Profile} My Profile
          </button>

          <div className="pt-8 space-y-4">
             <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4">Live Control</h3>
             <button 
              onClick={() => setIsTrafficRunning(!isTrafficRunning)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold transition-all border ${isTrafficRunning ? 'bg-red-600 text-white border-red-500' : 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/10'}`}
             >
               <span className="flex items-center gap-2">{isTrafficRunning ? <Activity className="w-4 h-4 animate-spin-slow" /> : <Zap className="w-4 h-4" />} {isTrafficRunning ? 'STOP TRAFFIC' : 'START LIVE TRAFFIC'}</span>
               <div className={`w-2 h-2 rounded-full ${isTrafficRunning ? 'bg-white animate-pulse' : 'bg-white'}`}></div>
             </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors uppercase"
          >
            {ICONS.Logout} Termination
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className={`h-10 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-colors border-b border-white/5 ${isTrafficRunning ? 'bg-emerald-600 text-white' : 'bg-amber-600/10 text-amber-500'}`}>
          {isTrafficRunning ? "Live Monitoring Active — Alpha Protocol Engaged" : "System Idle — Waiting for Live Traffic"}
        </div>

        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md">
          <div className="flex gap-4">
            <button 
              onClick={() => setCurrentView('medicalQueue')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all text-xs font-bold ${currentView === 'medicalQueue' ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
            >
              <Stethoscope className="w-4 h-4" /> Medical Pending
              <span className="bg-black/20 px-2 rounded-md ml-1">{medicalQueue.length}</span>
            </button>
            <button 
              onClick={() => setCurrentView('fraudQueue')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all text-xs font-bold ${currentView === 'fraudQueue' ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
            >
              <ClipboardList className="w-4 h-4" /> Fraud Pending
              <span className="bg-black/20 px-2 rounded-md ml-1">{fraudQueue.length}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
            TRUST-CLUSTER-01
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-950/20">
          {(currentView === 'dashboard' || currentView === 'medicalQueue' || currentView === 'fraudQueue') && (
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                  {currentView === 'dashboard' ? 'Real-Time Transaction Feed' : currentView === 'medicalQueue' ? 'Medical Verification Queue' : 'High-Risk Fraud Queue'}
                </h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Search Cases..." 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredTransactions.length > 0 ? (
                <TransactionTable 
                  transactions={filteredTransactions} 
                  onSelectUser={setSelectedUserIdForHistory}
                  onReview={setSelectedTxForReview}
                />
              ) : (
                <div className="h-64 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-700 gap-4">
                  <Activity className="w-12 h-12 opacity-10" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">
                    {isTrafficRunning ? "Queue Cleared — Monitoring Standby" : "System Idle — Waiting for Live Traffic"}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentView === 'analytics' && <Analytics transactions={transactions} />}
          {currentView === 'profile' && <Profile admin={adminProfile} onUpdate={setAdminProfile} />}
        </div>
      </main>

      {/* Popups & Modals */}
      {selectedTxForReview && (
        selectedTxForReview.status === TransactionStatus.PENDING_MEDICAL ? (
          <HospitalVerificationModal 
            transaction={selectedTxForReview}
            onUpdateTransaction={handleUpdateTransaction}
            onDecision={(status) => handleDecision(selectedTxForReview.id, status)}
            onClose={() => setSelectedTxForReview(null)}
          />
        ) : (
          <DecisionModal 
            transaction={selectedTxForReview}
            onDecision={(status) => handleDecision(selectedTxForReview.id, status)}
            onClose={() => setSelectedTxForReview(null)}
          />
        )
      )}

      {selectedUserIdForHistory && (
        <UserHistoryPanel 
          userId={selectedUserIdForHistory}
          transactions={transactions}
          onClose={() => setSelectedUserIdForHistory(null)}
        />
      )}
    </div>
  );
};

export default App;
