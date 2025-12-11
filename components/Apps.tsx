import React, { useState } from 'react';
import { Terminal } from 'lucide-react';
import { Terminal as TerminalApp } from './apps/Terminal';
import { Notepad } from './apps/Notepad';
import { Browser } from './apps/Browser';
import { SocialVerse } from './apps/SocialVerse';
import { Steam } from './apps/Steam';
import { GameRunner } from './apps/GameRunner';
import { AppId, AppConfig, AppWindowProps } from '../types';
import { 
  Monitor, 
  Flame, 
  FileText, 
  Settings as SettingsIcon, 
  Files, 
  MessageSquare, 
  Cpu,
  Users,
  Gamepad2
} from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

// Settings App
const Settings: React.FC<AppWindowProps> = () => (
  <div className="h-full bg-slate-900 text-slate-200 p-6">
    <h2 className="text-2xl font-light mb-6">Settings</h2>
    
    <div className="grid gap-4">
      <div className="p-4 bg-slate-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Monitor className="text-blue-400" />
            <div>
                <h3 className="font-medium">Display</h3>
                <p className="text-sm text-slate-400">1920 x 1080</p>
            </div>
        </div>
        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">Configure</button>
      </div>

      <div className="p-4 bg-slate-800 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Cpu className="text-green-400" />
            <div>
                <h3 className="font-medium">System</h3>
                <p className="text-sm text-slate-400">Open Door OS v1.0 (Alpha)</p>
            </div>
        </div>
        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">Check Updates</button>
      </div>
    </div>
  </div>
);

// File Manager (Mock)
const FileManager: React.FC<AppWindowProps> = () => (
  <div className="h-full bg-slate-900 text-slate-200 flex flex-col">
      <div className="p-2 border-b border-slate-700 flex gap-2">
          <div className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">/home/guest</div>
      </div>
      <div className="flex-1 p-4 grid grid-cols-4 gap-4 content-start">
        {['Documents', 'Downloads', 'Music', 'Pictures', 'project.txt', 'todo.md'].map((file, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer p-2 hover:bg-white/5 rounded-lg">
                <div className={`w-12 h-12 ${file.includes('.') ? 'bg-slate-700' : 'bg-blue-500/20 text-blue-400'} rounded-lg flex items-center justify-center`}>
                    {file.includes('.') ? <FileText size={24} /> : <Files size={24} />}
                </div>
                <span className="text-xs text-slate-300 group-hover:text-white">{file}</span>
            </div>
        ))}
      </div>
  </div>
);

// AI Chat
const AIChat: React.FC<AppWindowProps> = () => {
    const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
        {role: 'ai', text: "Hi! I'm Open Door AI. How can I help you navigate the OS today?"}
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const send = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!input.trim()) return;
        
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, {role: 'user', text: userMsg}]);
        setLoading(true);

        const response = await chatWithAssistant(userMsg);
        setMessages(prev => [...prev, {role: 'ai', text: response}]);
        setLoading(false);
    }

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-200">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-xs text-slate-500 ml-2">Open Door AI is thinking...</div>}
            </div>
            <form onSubmit={send} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
                <input 
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ask Open Door AI..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
            </form>
        </div>
    )
}

export const APPS: Record<AppId, AppConfig> = {
  [AppId.TERMINAL]: {
    id: AppId.TERMINAL,
    title: 'Terminal',
    icon: Terminal,
    component: TerminalApp,
    defaultWidth: 600,
    defaultHeight: 400,
  },
  [AppId.BROWSER]: {
    id: AppId.BROWSER,
    title: 'Firefox',
    icon: Flame,
    component: Browser,
    defaultWidth: 800,
    defaultHeight: 600,
  },
  [AppId.NOTEPAD]: {
    id: AppId.NOTEPAD,
    title: 'Text Editor',
    icon: FileText,
    component: Notepad,
    defaultWidth: 500,
    defaultHeight: 400,
  },
  [AppId.SETTINGS]: {
      id: AppId.SETTINGS,
      title: 'Settings',
      icon: SettingsIcon,
      component: Settings,
      defaultWidth: 700,
      defaultHeight: 500,
  },
  [AppId.FILES]: {
      id: AppId.FILES,
      title: 'Files',
      icon: Files,
      component: FileManager,
      defaultWidth: 600,
      defaultHeight: 400,
  },
  [AppId.CHAT]: {
      id: AppId.CHAT,
      title: 'Open Door AI',
      icon: MessageSquare,
      component: AIChat,
      defaultWidth: 400,
      defaultHeight: 600,
  },
  [AppId.SOCIAL]: {
      id: AppId.SOCIAL,
      title: 'SocialVerse',
      icon: Users,
      component: SocialVerse,
      defaultWidth: 450,
      defaultHeight: 700,
  },
  [AppId.STEAM]: {
      id: AppId.STEAM,
      title: 'Steam',
      icon: Gamepad2,
      component: Steam,
      defaultWidth: 1000,
      defaultHeight: 700,
  },
  [AppId.GAME]: {
      id: AppId.GAME,
      title: 'Game',
      icon: Gamepad2,
      component: GameRunner,
      defaultWidth: 800,
      defaultHeight: 600,
  }
};