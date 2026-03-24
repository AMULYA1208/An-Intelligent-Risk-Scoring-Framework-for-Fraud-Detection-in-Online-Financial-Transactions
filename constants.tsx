
import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  BarChart3, 
  UserCircle, 
  LogOut, 
  ShieldAlert, 
  ShieldCheck, 
  Stethoscope, 
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  Clock,
  MapPin,
  CreditCard,
  Ban
} from 'lucide-react';

export const ICONS = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Analytics: <BarChart3 className="w-5 h-5" />,
  Profile: <UserCircle className="w-5 h-5" />,
  Logout: <LogOut className="w-5 h-5" />,
  Traffic: <Activity className="w-5 h-5" />,
  RiskHigh: <ShieldAlert className="w-6 h-6 text-red-500" />,
  RiskLow: <ShieldCheck className="w-6 h-6 text-green-500" />,
  Medical: <Stethoscope className="w-5 h-5" />,
  History: <History className="w-5 h-5" />,
  Alert: <AlertTriangle className="w-4 h-4" />,
  Approved: <CheckCircle2 className="w-4 h-4" />,
  Rejected: <XCircle className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  Filter: <Filter className="w-4 h-4" />,
  ArrowRight: <ArrowRight className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4 text-slate-400" />,
  Map: <MapPin className="w-4 h-4 text-slate-400" />,
  Card: <CreditCard className="w-4 h-4 text-slate-400" />,
  Ban: <Ban className="w-4 h-4" />
};

export const DEFAULT_ADMIN_PASSWORD = 'cmrtc123$';

export const RISK_LEVEL_COLORS = {
  Low: 'text-green-400 bg-green-400/10 border-green-400/20',
  Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  High: 'text-red-400 bg-red-400/10 border-red-400/20'
};

export const STATUS_COLORS = {
  'Auto-Approved': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Auto-Rejected': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  'Admin Approved': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Admin Rejected': 'text-red-400 bg-red-400/10 border-red-400/20',
  'Pending Medical Verification': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Pending Fraud Review': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  // Legacy mappings for safety
  'Approved': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Rejected': 'text-red-400 bg-red-400/10 border-red-400/20',
};
