import React, { useState } from 'react';
import { ArrowRight, Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  username: string;
  storedHash: string; // Simple comparison for simulation
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ username, storedHash, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === storedHash) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  // Blurred background effect
  const bgImage = "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1976&auto=format&fit=crop";

  return (
    <div 
      className="w-screen h-screen overflow-hidden bg-cover bg-center font-sans flex items-center justify-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
        
        {/* Avatar */}
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-600 mb-6 shadow-2xl">
           <img 
             src={`https://ui-avatars.com/api/?name=${username}&background=0f172a&color=fff&size=256`} 
             className="w-full h-full rounded-full object-cover border-4 border-slate-900"
             alt="User Avatar"
           />
        </div>

        <h1 className="text-3xl font-light text-white mb-2">{username}</h1>
        <p className="text-slate-400 text-sm mb-8">Welcome back</p>

        <form onSubmit={handleLogin} className="w-full relative">
           <input 
             type="password"
             autoFocus
             className={`w-full bg-slate-900/50 backdrop-blur-md border ${error ? 'border-red-500' : 'border-white/20 focus:border-blue-400'} rounded-full py-3 px-6 text-center text-white placeholder-slate-500 focus:outline-none transition-all shadow-xl`}
             placeholder="Password"
             value={password}
             onChange={e => setPassword(e.target.value)}
           />
           <button 
             type="submit"
             className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
           >
             <ArrowRight size={16} />
           </button>
        </form>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={14} />
            <span>Incorrect password</span>
          </div>
        )}
        
        <div className="absolute bottom-[-100px] text-slate-500 text-xs font-mono">
           Open Door OS • Hyprland Edition
        </div>
      </div>
    </div>
  );
};