import React, { useState, useEffect } from 'react';
import { AppId, AppConfig } from '../types';
import { Wifi, Battery, Volume2, Power, Calendar, Clock, Cpu, LayoutGrid } from 'lucide-react';
import { APPS } from './Apps';

interface TaskbarProps {
  openApps: string[];
  activeAppId: string | null;
  onLaunch: (appId: AppId) => void;
  onToggleStart: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ activeAppId, onToggleStart }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-2 left-2 right-2 flex justify-between items-start z-50 pointer-events-none font-mono text-sm">
      
      {/* Left: Workspaces & Launcher */}
      <div className="flex gap-2 pointer-events-auto">
        <button 
          onClick={onToggleStart}
          className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-blue-400 hover:text-white px-3 py-1.5 rounded-full transition-all hover:bg-slate-800 flex items-center gap-2"
        >
          <LayoutGrid size={16} />
        </button>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 px-2 py-1.5 rounded-full flex gap-1">
           {[1, 2, 3, 4, 5].map(i => (
             <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${i === 1 ? 'w-6 bg-blue-500' : 'bg-slate-600'}`}
             />
           ))}
        </div>
      </div>

      {/* Center: Window Title or Date */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-slate-300 px-4 py-1.5 rounded-full pointer-events-auto">
         {activeAppId ? APPS[activeAppId as AppId]?.title : time.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>

      {/* Right: System Modules */}
      <div className="flex gap-2 pointer-events-auto">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-full flex items-center gap-3">
             <div className="flex items-center gap-1.5 text-green-400">
                 <Cpu size={14} />
                 <span className="text-xs">12%</span>
             </div>
             <div className="w-px h-3 bg-white/10" />
             <div className="flex items-center gap-1.5 text-purple-400">
                 <span className="text-xs font-bold">RAM</span>
                 <span className="text-xs">2.4G</span>
             </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-slate-300 px-3 py-1.5 rounded-full flex items-center gap-3">
             <Wifi size={16} />
             <Volume2 size={16} />
             <Battery size={16} />
             <div className="w-px h-3 bg-white/10" />
             <div className="flex items-center gap-2">
                 <Clock size={14} className="text-blue-400" />
                 <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
             </div>
        </div>

        <button className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-full transition-colors">
            <Power size={16} />
        </button>
      </div>
    </div>
  );
};