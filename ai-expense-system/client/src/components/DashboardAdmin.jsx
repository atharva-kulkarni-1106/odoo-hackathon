import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
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
    const res = await API.get('/users'); // ✅ FIXED
    setUsers(res.data);
  };

  const fetchExpenses = async () => {
    const res = await API.get('/expenses'); // ✅ already correct
    setExpenses(res.data.filter(e => e.status === 'PENDING_FINANCE'));
    setClearedExpenses(res.data.filter(e => e.status === 'APPROVED' || e.status === 'REJECTED'));
  };

  const handleAdminApprove = async (id) => {
    try {
      await API.post(`/expenses/${id}/approve`, { // ✅ FIXED
        comments: 'Final payout authorized unconditionally by Corporate Finance.'
      });
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
      await API.post('/users', formData); // ✅ FIXED
      alert('User created successfully');
      fetchUsers();
      setFormData({ name: '', email: '', password: '', role: 'EMPLOYEE', managerId: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating user');
    }
  };

  return (
    <div className="space-y-8">
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
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-xl font-bold text-slate-200">Online & Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <UserPlus className="text-indigo-400"/> Provision User
          </h2>
          <form onSubmit={createUser} className="space-y-4">
            <input type="text" placeholder="Full Name" required
              className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3"
              onChange={e => setFormData({...formData, name: e.target.value})} value={formData.name} />
            <input type="email" placeholder="Email Address" required
              className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3"
              onChange={e => setFormData({...formData, email: e.target.value})} value={formData.email} />
            <input type="password" placeholder="Temporary Password" required
              className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3"
              onChange={e => setFormData({...formData, password: e.target.value})} value={formData.password} />

            <select className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3 text-white"
              onChange={e => setFormData({...formData, role: e.target.value})} value={formData.role}>
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button className="w-full neon-button mt-4">
              Commit to Database
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 glass-panel p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="text-purple-400"/> Organizational Roster
          </h2>

          <table className="w-full">
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
