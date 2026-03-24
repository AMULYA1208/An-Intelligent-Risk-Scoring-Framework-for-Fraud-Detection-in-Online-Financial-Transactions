
import React, { useState } from 'react';
import { AdminProfile } from '../types';
import { ICONS, DEFAULT_ADMIN_PASSWORD } from '../constants';

interface ProfileProps {
  admin: AdminProfile;
  onUpdate: (data: AdminProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ admin, onUpdate }) => {
  const [profile, setProfile] = useState(admin);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(profile);
    setMessage('Profile updated successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.old !== DEFAULT_ADMIN_PASSWORD) {
       setError('Incorrect old password.');
       return;
    }
    if (passwords.new !== passwords.confirm) {
       setError('New passwords do not match.');
       return;
    }
    if (passwords.new.length < 8) {
       setError('Password must be at least 8 characters.');
       return;
    }
    
    setMessage('Password changed successfully.');
    setError('');
    setPasswords({ old: '', new: '', confirm: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
          {admin.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{admin.name}</h1>
          <p className="text-slate-500 text-sm">System Administrator • TrustIQ Cluster 01</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Form */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            {ICONS.Profile} Identity Management
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Full Name</label>
              <input 
                type="text" 
                value={profile.name}
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Work Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={e => setProfile({...profile, email: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Contact Number</label>
              <input 
                type="text" 
                value={profile.contact}
                onChange={e => setProfile({...profile, contact: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-500/10">
              SAVE CHANGES
            </button>
          </form>
        </section>

        {/* Password Form */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="text-red-400">●</span> Security Authentication
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Current Password</label>
              <input 
                type="password" 
                value={passwords.old}
                onChange={e => setPasswords({...passwords, old: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">New Password</label>
              <input 
                type="password" 
                value={passwords.new}
                onChange={e => setPasswords({...passwords, new: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase">Confirm New Password</label>
              <input 
                type="password" 
                value={passwords.confirm}
                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
              />
            </div>
            {error && <p className="text-xs text-red-400 bg-red-400/10 p-2 rounded">{error}</p>}
            {message && <p className="text-xs text-emerald-400 bg-emerald-400/10 p-2 rounded">{message}</p>}
            <button className="w-full border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold py-2.5 rounded-lg transition-colors">
              UPDATE SECURITY CREDENTIALS
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
