import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login, signup } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', companyName: '', countryName: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Authentication Failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center -mt-24">
      <div className="glass-panel w-full max-w-lg p-10 transform transition-all shadow-indigo-500/10 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center mb-8 gradient-text tracking-tight">
          {isLogin ? 'Access Portal' : 'Initialize Workspace'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-5">
              <input type="text" placeholder="Full Name" required
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-5 py-4 text-white placeholder-slate-400/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="text" placeholder="Company Name" required
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-5 py-4 text-white placeholder-slate-400/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                onChange={e => setFormData({...formData, companyName: e.target.value})} />
              <input type="text" placeholder="Country (e.g. United States, India)" required
                className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-5 py-4 text-white placeholder-slate-400/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                onChange={e => setFormData({...formData, countryName: e.target.value})} />
            </div>
          )}
          <input type="email" placeholder="Email Address" required
            className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-5 py-4 text-white placeholder-slate-400/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required
            className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl px-5 py-4 text-white placeholder-slate-400/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            onChange={e => setFormData({...formData, password: e.target.value})} />
            
          <button type="submit" className="w-full neon-button mt-4 tracking-wide">
            {isLogin ? 'Authenticate' : 'Complete Setup'}
          </button>
        </form>
        <div className="mt-8 text-center border-t border-slate-700/50 pt-6">
          <button onClick={() => setIsLogin(!isLogin)} className="text-slate-400 hover:text-indigo-300 text-sm font-medium transition-colors">
            {isLogin ? "Deploy a new Company instance" : "Return to authentication portal"}
          </button>
        </div>
      </div>
    </div>
  );
}
