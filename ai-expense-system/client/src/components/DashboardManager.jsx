import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, Bot, BookOpen, Smile, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function DashboardManager() {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get('/expenses');
    // Show all pending expenses to ensure queue populates robustly
    setExpenses(res.data.filter(e => e.status === 'PENDING_MANAGER'));
  };

  const handleAction = async (id, action) => {
    try {
      let comments = action === 'approve' ? 'Manager fully verified and approved.' : '';
      if (action === 'reject') {
        comments = window.prompt("Please explain to the employee why this expense is being sent back:");
        if (!comments) return; // Exit if the manager clicks cancel
      }
      await axios.post(`/expenses/${id}/${action}`, { comments });
      fetchExpenses();
      setSelectedExp(null);
    } catch (err) {
      alert(`Error processing ${action}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Queue Area */}
      <div className="lg:col-span-1 border-r border-slate-700/50 pr-6 overflow-y-auto h-[75vh] custom-scroll">
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-3">Pending Approvals</h2>
        <div className="space-y-4">
          {expenses.map(exp => (
            <div 
              key={exp._id} 
              onClick={() => setSelectedExp(exp)}
              className={`glass-card p-5 cursor-pointer transform transition-all ${selectedExp?._id === exp._id ? 'border-indigo-400 bg-indigo-500/10 scale-[1.02]' : 'hover:bg-slate-800/40'}`}
            >
              <div className="flex justify-between items-start mb-2">
                 <p className="font-bold text-slate-100">{exp.userId.name}</p>
                 <p className="gradient-text font-bold">{exp.amount} {exp.currency}</p>
              </div>
              <p className="text-xs text-slate-400 mb-3">{exp.category}</p>
              
              {/* AI Badges Mini */}
              <div className="flex gap-2">
                {exp.aiInsights?.isSuspicious ? (
                   <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-md text-[10px] uppercase font-bold flex items-center gap-1"><ShieldAlert size={12}/> Fraud Flag</span>
                ) : (
                   <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md text-[10px] uppercase font-bold flex items-center gap-1"><CheckCircle size={12}/> Clean</span>
                )}
                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold flex items-center gap-1 ${exp.aiInsights?.smartSuggestion === 'APPROVE' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  <Bot size={12}/> AI: {exp.aiInsights?.smartSuggestion}
                </span>
              </div>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-slate-500 italic">Queue is empty. Great job!</p>}
        </div>
      </div>

      {/* Detail Area */}
      <div className="lg:col-span-2 pl-4">
        {selectedExp ? (
          <div className="glass-panel p-8 h-full relative overflow-hidden animate-[fadeIn_0.3s_ease-out_forwards]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-start mb-8 border-b border-slate-700/50 pb-6">
               <div>
                  <h2 className="text-3xl font-extrabold">{selectedExp.userId.name}</h2>
                  <p className="text-indigo-400 font-mono mt-1 text-sm">{selectedExp.userId.email}</p>
               </div>
               <div className="text-right">
                  <h2 className="text-4xl font-extrabold gradient-text">{selectedExp.amount} {selectedExp.currency}</h2>
                  <p className="text-sm text-slate-400 mt-1">Converted value: {selectedExp.convertedAmount.toFixed(2)} USD</p>
               </div>
            </div>

            {/* AI Insights Container */}
            <h3 className="text-xl font-bold mb-4 text-slate-200">AI Intelligent Analysis</h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className={`p-5 rounded-2xl border ${selectedExp.aiInsights?.isSuspicious ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                     <ShieldAlert size={18} className={selectedExp.aiInsights?.isSuspicious ? 'text-red-400' : 'text-emerald-400'}/>
                     <span className={`font-bold ${selectedExp.aiInsights?.isSuspicious ? 'text-red-400' : 'text-emerald-400'}`}>Fraud Detection</span>
                  </div>
                  <p className="text-sm text-slate-300">{selectedExp.aiInsights?.fraudReason || 'No anomalies detected matching known fraud patterns.'}</p>
               </div>

               <div className="p-5 rounded-2xl border bg-indigo-500/10 border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-2">
                     <Bot size={18} className="text-indigo-400"/>
                     <span className="font-bold text-indigo-400">Smart Suggestion: {selectedExp.aiInsights?.smartSuggestion}</span>
                  </div>
                  <p className="text-sm text-slate-300">{selectedExp.aiInsights?.suggestionReason}</p>
               </div>
               
               <div className="p-5 rounded-2xl border bg-slate-800/50 border-slate-700 col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                     <BookOpen size={18} className="text-purple-400"/>
                     <span className="font-bold text-purple-400">Contextual Story</span>
                  </div>
                  <p className="text-sm text-slate-300 italic">"{selectedExp.aiInsights?.story}"</p>
               </div>

               {selectedExp.aiInsights?.moodWarning && (
                  <div className="p-4 rounded-2xl border bg-amber-500/10 border-amber-500/30 col-span-2 flex items-center gap-3">
                     <Smile size={24} className="text-amber-400"/>
                     <p className="text-sm text-amber-300 font-medium">Informal language detected in justification. Manual screening advised.</p>
                  </div>
               )}
            </div>

            {Number(selectedExp.amount) >= 10000 && (
              <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-[0_4px_25px_rgba(245,158,11,0.15)]">
                <div className="p-2 bg-amber-500/20 rounded-lg shrink-0">
                  <AlertCircle className="text-amber-400 w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-amber-400 tracking-wide uppercase text-sm">Corporate Finance Policy Alert</p>
                  <p className="text-sm text-amber-200 mt-1 font-medium leading-relaxed">
                    This reported expense strictly exceeds <b>10,000 {selectedExp.currency}</b>. Please carefully review the context and AI patterns below to ensure compliance.
                  </p>
                </div>
              </div>
            )}

            <h3 className="text-xl font-bold mb-4 text-slate-200">Employee Justification</h3>
            <div className="p-5 bg-slate-900/50 rounded-xl border border-slate-700 mb-8">
               <p className="text-slate-300 leading-relaxed">{selectedExp.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
               <button onClick={() => handleAction(selectedExp._id, 'approve')} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20">
                  <CheckCircle size={20}/> Approve Component
               </button>
               <button onClick={() => handleAction(selectedExp._id, 'reject')} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-rose-600/20">
                  <XCircle size={20}/> Send Back
               </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
             <Bot size={64} className="mb-6 text-indigo-400 opacity-50"/>
             <h2 className="text-xl font-bold">Select an item from the queue</h2>
             <p className="text-slate-400 mt-2">AI analysis logic will populate here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
