import React, { useState, useEffect } from 'react';
import { ArrowRight, User, Lock, Check, Cpu, HardDrive, Terminal } from 'lucide-react';

interface SetupProps {
  onComplete: (username: string, password: string) => void;
}

const INSTALL_LOGS = [
  "Initializing Open Door OS Installer...",
  "Mounting root filesystem /dev/sda1...",
  "Probing hardware configuration...",
  "Detected GPU: Simulated WebGL Adapter",
  "Unpacking core system utilities...",
  "Configuring Hyprland window manager...",
  "Generating user locales...",
  "Installing default packages: neofetch, firefox, code...",
  "Setting up network interfaces...",
  "Applying system themes...",
  "Creating user home directory...",
  "Finalizing installation...",
  "System ready."
];

export const Setup: React.FC<SetupProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Step 3: Installation simulation
  useEffect(() => {
    if (step === 3) {
      let currentLog = 0;
      const totalLogs = INSTALL_LOGS.length;
      
      const interval = setInterval(() => {
        if (currentLog < totalLogs) {
          setLogs(prev => [...prev, INSTALL_LOGS[currentLog]]);
          setProgress(((currentLog + 1) / totalLogs) * 100);
          currentLog++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete(username, password);
          }, 1000);
        }
      }, 600); // Speed of installation

      return () => clearInterval(interval);
    }
  }, [step, onComplete, username, password]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else if (step === 2) {
      if(username && password) setStep(3);
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-950 flex items-center justify-center font-sans text-slate-200">
      <div className="w-[600px] h-[400px] bg-slate-900 rounded-xl shadow-2xl border border-slate-800 flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-1/3 bg-slate-950 p-6 flex flex-col justify-between border-r border-slate-800">
           <div>
             <div className="flex items-center gap-2 text-blue-400 font-bold mb-8">
                <Cpu size={20} />
                <span>OD-OS Setup</span>
             </div>
             <div className="space-y-4">
                <div className={`flex items-center gap-3 text-sm ${step >= 1 ? 'text-white' : 'text-slate-600'}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 1 ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700'}`}>1</div>
                   <span>Welcome</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${step >= 2 ? 'text-white' : 'text-slate-600'}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 2 ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700'}`}>2</div>
                   <span>Account</span>
                </div>
                <div className={`flex items-center gap-3 text-sm ${step >= 3 ? 'text-white' : 'text-slate-600'}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 3 ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700'}`}>3</div>
                   <span>Install</span>
                </div>
             </div>
           </div>
           <div className="text-xs text-slate-600">v1.0.0-alpha</div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col">
           {step === 1 && (
             <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-light mb-4">Welcome to Open Door OS</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  You are about to install a next-generation web-based operating system. 
                  This environment is simulated and runs entirely in your browser.
                </p>
                <div className="flex justify-end">
                   <button onClick={() => setStep(2)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors">
                     Start <ArrowRight size={16} />
                   </button>
                </div>
             </div>
           )}

           {step === 2 && (
             <form onSubmit={handleNext} className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-light mb-6">Create your User</h2>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="password"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                   <button type="submit" disabled={!username || !password} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors">
                     Next <ArrowRight size={16} />
                   </button>
                </div>
             </form>
           )}

           {step === 3 && (
             <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                <h2 className="text-lg font-light mb-4 flex items-center gap-2">
                  <HardDrive size={18} className="animate-pulse text-blue-400"/> Installing...
                </h2>
                
                <div className="bg-black rounded-lg p-3 font-mono text-xs text-green-400 h-[200px] overflow-hidden flex flex-col-reverse shadow-inner border border-slate-800">
                   {logs.slice().reverse().map((log, i) => (
                     <div key={i}>{log}</div>
                   ))}
                </div>

                <div className="mt-4">
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};