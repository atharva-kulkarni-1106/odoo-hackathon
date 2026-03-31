import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Database, UserPlus } from 'lucide-react';

export default function DashboardAdmin() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [clearedExpenses, setClearedExpenses] = useState([]);
  const [showDB, setShowDB] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE', managerId: '' });

  useEffect(() => {
    fetchUsers();
    fetchExpenses();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('/users');
    setUsers(res.data);
  };

  const fetchExpenses = async () => {
    const res = await axios.get('/expenses');
    // Admin acts as Corporate Finance
    setExpenses(res.data.filter(e => e.status === 'PENDING_FINANCE'));
    setClearedExpenses(res.data.filter(e => e.status === 'APPROVED' || e.status === 'REJECTED'));
  };

  const handleAdminApprove = async (id) => {
    try {
      await axios.post(`/expenses/${id}/approve`, { comments: 'Final payout authorized unconditionally by Corporate Finance.' });
      alert('Payout successfully authorized and cleared!');
      fetchExpenses();
    } catch (err) {
      alert('System Error: ' + (err.response?.data?.error || err.message));
      console.error(err);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users', formData);
      alert('User created successfully');
      fetchUsers();
      setFormData({ name: '', email: '', password: '', role: 'EMPLOYEE', managerId: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating user');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-card p-6 border-indigo-500/20 border-t-2 border-t-indigo-500">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Total System Users</h3>
            <p className="text-4xl font-extrabold gradient-text">{users.length}</p>
         </div>
         <div className="glass-card p-6 border-emerald-500/20 border-t-2 border-t-emerald-500">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Active Company</h3>
            <p className="text-2xl font-extrabold text-slate-200 mt-2">{user.company?.name || 'Local Instance'}</p>
         </div>
         <div className="glass-card p-6 border-purple-500/20 border-t-2 border-t-purple-500">
            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">AI Engine Status</h3>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
               <p className="text-xl font-bold text-slate-200">Online & Active</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Creation Form */}
        <div className="glass-panel p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><UserPlus className="text-indigo-400"/> Provision User</h2>
          <form onSubmit={createUser} className="space-y-4">
            <input type="text" placeholder="Full Name" required className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors" onChange={e => setFormData({...formData, name: e.target.value})} value={formData.name} />
            <input type="email" placeholder="Email Address" required className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors" onChange={e => setFormData({...formData, email: e.target.value})} value={formData.email} />
            <input type="password" placeholder="Temporary Password" required className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors" onChange={e => setFormData({...formData, password: e.target.value})} value={formData.password} />
            
            <select className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors text-white" onChange={e => setFormData({...formData, role: e.target.value})} value={formData.role}>
              <option value="EMPLOYEE">Employee Role</option>
              <option value="MANAGER">Manager Role</option>
              <option value="ADMIN">Admin Role</option>
            </select>
            
            {formData.role === 'EMPLOYEE' && (
              <select className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-colors text-white" onChange={e => setFormData({...formData, managerId: e.target.value})} value={formData.managerId}>
                <option value="">Assign to Manager (Optional)</option>
                {users.filter(u => u.role === 'MANAGER' || u.role === 'ADMIN').map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                ))}
              </select>
            )}
            
            <button className="w-full neon-button mt-4 flex justify-center items-center gap-2"><Database size={18}/> Commit to Database</button>
          </form>
        </div>

        {/* User Roster */}
        <div className="lg:col-span-2 glass-panel p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="text-purple-400"/> Organizational Roster</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400 text-sm">
                  <th className="pb-4 font-semibold">Employee</th>
                  <th className="pb-4 font-semibold">System Role</th>
                  <th className="pb-4 font-semibold">Assigned Manager</th>
                  <th className="pb-4 font-semibold text-right">Added</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4">
                       <p className="font-bold text-slate-200">{u.name}</p>
                       <p className="text-xs text-indigo-400 font-mono mt-1">{u.email}</p>
                    </td>
                    <td className="py-4">
                       <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                          u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          u.role === 'MANAGER' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                       }`}>{u.role}</span>
                    </td>
                    <td className="py-4 text-sm text-slate-400">{u.managerId ? u.managerId.name : '-'}</td>
                    <td className="py-4 text-sm text-slate-500 text-right">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Corporate Finance Approval Queue (Admin Only) */}
      <div className="glass-panel p-8 mt-8 border-t-2 border-t-emerald-500/50">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Database className="text-emerald-400"/> 
          Corporate Finance Payout Queue
        </h2>
        {expenses.length === 0 ? (
           <p className="text-slate-400 italic font-medium bg-slate-800/20 p-4 rounded-xl text-center border border-slate-700/30">No pending finance approvals currently in the system.</p>
        ) : (
           <div className="space-y-4">
             {expenses.map(e => (
               <div key={e._id} className="border border-slate-700/50 bg-slate-800/40 p-6 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:bg-slate-800/60 transition-colors">
                 <div className="flex-1 w-full">
                   <div className="flex items-center gap-3">
                     <p className="text-xl font-bold text-emerald-400">{e.amount} {e.currency}</p>
                     <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md ${
                       (e.aiInsights?.fraudScore || 0) > 30 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                     }`}>
                       AI Fraud Risk: {e.aiInsights?.fraudScore || 0}%
                     </span>
                     <span className="text-xs text-slate-500 font-mono">ID: {e._id.substring(e._id.length - 6)}</span>
                   </div>
                   <p className="text-sm text-slate-300 font-medium mt-3">[{e.category}] {e.description}</p>
                   
                   <div className="mt-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                     <p className="text-xs text-indigo-400 font-mono uppercase tracking-wider mb-1">Corporate Finance Summary:</p>
                     <p className="text-sm text-slate-400 italic">"{e.aiInsights?.expenseStory || 'Standard verified transaction. No unusual behavioral patterns or anomalies reported by local AI heuristic scanner.'}"</p>
                     <p className="text-xs font-bold text-purple-400 mt-2">Smart Decision: {e.aiInsights?.smartSuggestion || 'APPROVE'}</p>
                   </div>
                 </div>
                 <button onClick={() => handleAdminApprove(e._id)} className="w-full lg:w-auto shrink-0 bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-6 py-4 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
                   Final Approve & Payout
                 </button>
               </div>
             ))}
           </div>
        )}
      </div>

      {/* Settled Ledger (Admin Only) */}
      <div className="glass-panel p-8 mt-8 border-t-2 border-t-slate-600/50">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Database className="text-slate-400"/> 
          Historical Payout Ledger
        </h2>
        {clearedExpenses.length === 0 ? (
           <p className="text-slate-400 italic font-medium bg-slate-800/20 p-4 rounded-xl text-center border border-slate-700/30">No settled transactions exist in the corporate ledger.</p>
        ) : (
           <div className="space-y-4">
             {clearedExpenses.map(e => (
               <div key={e._id} className="border border-slate-700/50 bg-slate-800/20 p-4 rounded-xl flex justify-between items-center transition-colors">
                 <div>
                   <p className="text-lg font-bold text-slate-300">{e.amount} {e.currency}</p>
                   <p className="text-sm text-slate-400 mt-1">[{e.category}] {e.description}</p>
                 </div>
                 <span className={`px-4 py-2 text-xs font-bold rounded-lg uppercase ${
                   e.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                 }`}>
                   {e.status}
                 </span>
               </div>
             ))}
           </div>
        )}
      </div>

      {/* Database Viewer Toggle */}
      <div className="mt-12 mb-12 text-center">
         <button onClick={() => setShowDB(!showDB)} className="text-slate-500 hover:text-emerald-400 font-mono text-sm transition-colors border-b border-dashed border-slate-500 pb-1">
            {showDB ? "[ DEACTIVATE DATABASE TERMINAL ]" : "[ ACCESS RAW DATABASE TERMINAL ]"}
         </button>
      </div>

      {/* Raw MongoDB Terminal */}
      {showDB && (
         <div className="glass-panel p-6 mt-4 border border-emerald-500/30 bg-[#0a0f16] shadow-[0_0_30px_rgba(16,185,129,0.1)] mb-12 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <h3 className="text-emerald-500 font-mono font-bold tracking-widest text-sm uppercase">Connected: memory-mongodb://127.0.0.1</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div>
                   <p className="text-indigo-400 font-mono text-xs mb-2">admin@system:~$ db.users.find().pretty()</p>
                   <div className="bg-black/80 p-5 rounded-lg overflow-auto h-[400px] custom-scroll border border-indigo-500/20 shadow-inner">
                      <pre className="font-mono text-[10px] text-indigo-300/80 leading-relaxed">{JSON.stringify(users, null, 2)}</pre>
                   </div>
               </div>
               <div>
                   <p className="text-emerald-400 font-mono text-xs mb-2">admin@system:~$ db.expenses.find().pretty()</p>
                   <div className="bg-black/80 p-5 rounded-lg overflow-auto h-[400px] custom-scroll border border-emerald-500/20 shadow-inner">
                      <pre className="font-mono text-[10px] text-emerald-300/80 leading-relaxed">{
                         JSON.stringify(
                           [...expenses, ...clearedExpenses],
                           null, 2
                         )
                      }</pre>
                   </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
}
