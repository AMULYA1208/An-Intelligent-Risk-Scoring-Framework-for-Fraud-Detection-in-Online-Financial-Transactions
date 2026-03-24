import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { Transaction, RiskLevel, TransactionStatus } from '../types';

interface AnalyticsProps {
  transactions: Transaction[];
}

const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  // Process Data for Risk Distribution
  const riskDist = [
    { name: 'Low', value: transactions.filter(t => t.riskLevel === RiskLevel.LOW).length, color: '#10b981' },
    { name: 'Medium', value: transactions.filter(t => t.riskLevel === RiskLevel.MEDIUM).length, color: '#f59e0b' },
    { name: 'High', value: transactions.filter(t => t.riskLevel === RiskLevel.HIGH).length, color: '#ef4444' }
  ];

  // Process Data for Transaction Outcomes (Genuine vs Fraudulent)
  const genuineCount = transactions.filter(t => 
    t.status === TransactionStatus.AUTO_APPROVED || t.status === TransactionStatus.ADMIN_APPROVED
  ).length;
  
  const fraudCount = transactions.filter(t => 
    t.status === TransactionStatus.AUTO_REJECTED || t.status === TransactionStatus.ADMIN_REJECTED
  ).length;

  const pendingCount = transactions.filter(t => 
    t.status === TransactionStatus.PENDING_MEDICAL || t.status === TransactionStatus.PENDING_FRAUD
  ).length;

  const outcomeData = [
    { name: 'Genuine', value: genuineCount, color: '#3b82f6' },
    { name: 'Fraudulent', value: fraudCount, color: '#ef4444' },
    { name: 'Under Review', value: pendingCount, color: '#f59e0b' }
  ];

  // Calculate Fraud Ratio (Fraud / Total Resolved)
  const resolvedTotal = genuineCount + fraudCount;
  const fraudRatio = resolvedTotal > 0 ? (fraudCount / resolvedTotal) * 100 : 0;

  const categoryCounts = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const timeData = transactions.slice().reverse().map(tx => ({
    time: new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount: tx.amount,
    score: tx.riskScore
  }));

  const customTooltipStyle = {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px'
  };

  const customItemStyle = {
    color: '#f8fafc',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const
  };

  const customLabelStyle = {
    color: '#94a3b8',
    fontSize: '10px',
    marginBottom: '4px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Risk Score Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={customTooltipStyle}
                  itemStyle={customItemStyle}
                  labelStyle={customLabelStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {riskDist.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud vs Genuine Outcome Ratio */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <div className="text-4xl font-black text-rose-500">{fraudRatio.toFixed(1)}%</div>
          </div>
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Security Outcome Ratio</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={outcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={70}
                    stroke="none"
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-outcome-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={customTooltipStyle}
                    itemStyle={customItemStyle}
                    labelStyle={customLabelStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Detection Efficiency</p>
              <div className="text-2xl font-black text-rose-500 font-mono">
                {fraudCount} : {genuineCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                {fraudRatio > 0 ? `${fraudRatio.toFixed(2)}% Fraud-to-Genuine Ratio` : 'No fraudulent activity detected'}
              </p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Category Density</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#475569" fontSize={10} width={80} />
                <Tooltip 
                  cursor={{ fill: '#1e293b' }} 
                  contentStyle={customTooltipStyle}
                  itemStyle={customItemStyle}
                  labelStyle={customLabelStyle}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction Volume / Amount Trend */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl lg:col-span-3">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Neural Risk Drift & Velocity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip 
                  contentStyle={customTooltipStyle}
                  itemStyle={customItemStyle}
                  labelStyle={customLabelStyle}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
