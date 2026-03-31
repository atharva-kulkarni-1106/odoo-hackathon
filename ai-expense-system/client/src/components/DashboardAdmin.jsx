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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    managerId: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchExpenses();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users'); // ✅ correct
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await API.get('/expenses'); // ✅ correct
      setExpenses(res.data.filter(e => e.status === 'PENDING_FINANCE'));
      setClearedExpenses(res.data.filter(e => e.status === 'APPROVED' || e.status === 'REJECTED'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminApprove = async (id) => {
    try {
      await API.post(`/expenses/${id}/approve`, {
        comments: 'Final payout authorized by Corporate Finance.'
      });
      alert('Payout approved!');
      fetchExpenses();
    } catch (err) {
      alert(err.response?.data?.error || 'Error approving');
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users', formData); // ✅ correct
      alert('User created successfully');
      fetchUsers();

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'EMPLOYEE',
        managerId: ''
      });

    } catch (err) {
      alert(err.response?.data?.error || 'Error creating user');
    }
  };

  return (
    <div className="space-y-8">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3>Total Users</h3>
          <p className="text-3xl">{users.length}</p>
        </div>

        <div className="glass-card p-6">
          <h3>Company</h3>
          <p>{user.company?.name || 'Local'}</p>
        </div>

        <div className="glass-card p-6">
          <h3>Status</h3>
          <p>AI Running</p>
        </div>
      </div>

      {/* Create User */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="glass-panel p-6">
          <h2>Create User</h2>

          <form onSubmit={createUser} className="space-y-4">

            <input
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />

            <select
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button type="submit">
              Create User
            </button>

          </form>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h2>Users</h2>

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
