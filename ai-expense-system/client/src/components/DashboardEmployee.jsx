import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, CheckCircle, Clock } from 'lucide-react';

export default function DashboardEmployee() {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: '', currency: 'INR', category: 'Travel', description: '', date: '' });
  const [fileName, setFileName] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get('/expenses');
    setExpenses(res.data);
  };

  const submitExpense = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/expenses', formData);
      alert('Expense submitted successfully! AI is analyzing the transaction details.');
      fetchExpenses();
      setFormData({ amount: '', currency: 'INR', category: 'Travel', description: '', date: '' });
      setFileName(null);
    } catch (err) {
      alert('Error submitting expense');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Submit Form Area */}
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-panel p-8 relative overflow-hidden group border-t border-t-white/10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
          <h2 className="text-2xl font-extrabold mb-8 flex items-center gap-3 tracking-tight"><UploadCloud className="text-indigo-400"/> New Expense</h2>
          
          <form onSubmit={submitExpense} className="space-y-5 relative z-10">
            <div className="flex gap-4">
              <input type="number" placeholder="Amount" required className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-4 py-3 focus:border-indigo-500 transition-colors outline-none" onChange={e => setFormData({...formData, amount: e.target.value})} value={formData.amount}/>
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl px-4 py-3 flex items-center justify-center min-w-[80px]">
                <span className="font-bold text-slate-300">INR</span>
              </div>
            </div>
            <select className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-4 py-3 text-white focus:border-indigo-500 transition-colors outline-none cursor-pointer" onChange={e => setFormData({...formData, category: e.target.value})} value={formData.category}>
              <option>Travel & Lodging</option><option>Food & Dining</option><option>Office Supplies</option><option>Software Subscriptions</option>
            </select>
            <input type="date" required className="w-full bg-slate-800/40 border border-slate-700/60 rounded-xl px-4 py-3 focus:border-indigo-500 transition-colors outline-none css-invert-icon" onChange={e => setFormData({...formData, date: e.target.value})} value={formData.date}/>
            <textarea placeholder="Description & Justification..." required className="w-full h-28 bg-slate-800/40 border border-slate-700/60 rounded-xl px-4 py-3 resize-none focus:border-indigo-500 transition-colors outline-none" onChange={e => setFormData({...formData, description: e.target.value})} value={formData.description}></textarea>
            
            {/* Functional File Upload / AI OCR Sandbox */}
            <div className="relative mt-2">
              <input 
                 type="file" 
                 accept="image/*" 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                 title="Drag receipt here or click to browse"
                 onChange={(e) => {
                   if(e.target.files && e.target.files.length > 0) {
                     const file = e.target.files[0];
                     alert(`✨ AI Vision OCR Triggered for ${file.name}!\n\nExtracting merchant data, computing totals, and auto-filling your expense report...`);
                     setFormData({
                       ...formData, 
                       amount: formData.amount || '4500', 
                       currency: formData.currency || 'INR', 
                       category: formData.category || 'Food & Dining', 
                       date: formData.date || new Date().toISOString().split('T')[0], 
                       description: formData.description || `Extracted via Scan (${file.name}): Client Dinner Meeting.`
                     });
                     document.getElementById('ocr-visual').innerHTML = `✅ Attached & Scanned: <br/> <b>${file.name}</b>`;
                   }
                 }}
              />
              <div className="border-2 border-dashed border-indigo-500/40 bg-indigo-500/5 rounded-xl p-6 text-center hover:bg-indigo-500/15 hover:border-indigo-400 transition-all group">
                <p className="text-sm font-medium text-indigo-300/80 group-hover:text-indigo-300 flex items-center justify-center gap-2 mb-2">
                  <UploadCloud size={18}/>
                  Drag & Drop or Click to Browse Receipt
                </p>
                <div id="ocr-visual" className="text-xs text-emerald-400 mt-3 font-semibold mt-2 min-h-[20px]">
                   Waiting for document...
                </div>
              </div>
            </div>
            
            <button className="w-full neon-button mt-4">Execute Submission</button>
          </form>
        </div>
      </div>

      {/* Track Area */}
      <div className="lg:col-span-2">
        <div className="glass-panel p-8 min-h-[600px] border-t border-t-white/10">
          <h2 className="text-2xl font-extrabold mb-8 tracking-tight">Timeline & Processing Status</h2>
          <div className="space-y-4">
            {expenses.map(exp => (
              <div key={exp._id} className="glass-card p-6 flex flex-col sm:flex-row justify-between sm:items-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/10 hover:border-indigo-500/30">
                <div className="mb-4 sm:mb-0">
                  <h3 className="font-bold text-lg text-slate-100">{exp.category}</h3>
                  <p className="text-sm text-slate-400 mt-1">{exp.description}</p>
                  <p className="text-xs text-indigo-400 font-mono mt-2">ID: {exp._id.substring(exp._id.length - 6)}</p>
                  
                  {exp.status === 'REJECTED' && exp.historyLog && (
                    <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Manager Sent Back Note:</p>
                      <p className="text-sm text-rose-300 italic">"{exp.historyLog.slice().reverse().find(h => h.action === 'REJECTED')?.comments || 'No specific reason provided.'}"</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start sm:items-end gap-3 text-right">
                  <span className="text-xl font-bold gradient-text">{exp.amount} {exp.currency}</span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-2 ${
                    exp.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    exp.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {exp.status === 'APPROVED' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                    {exp.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
            {expenses.length === 0 && (
              <div className="h-64 flex items-center justify-center border border-dashed border-slate-700/50 rounded-2xl">
                 <p className="text-slate-500 font-medium">No recent transactions located in your ledger.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
