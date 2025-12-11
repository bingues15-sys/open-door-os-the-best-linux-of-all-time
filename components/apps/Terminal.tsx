import React, { useState, useEffect, useRef } from 'react';
import { executeTerminalCommand } from '../../services/geminiService';
import { AppWindowProps } from '../../types';

interface HistoryItem {
  type: 'command' | 'output';
  content: string;
}

export const Terminal: React.FC<AppWindowProps> = ({ isActive }) => {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', content: 'Open Door OS [Version 1.0.0]' },
    { type: 'output', content: '(c) Open Door Corporation. All rights reserved.\n' },
    { type: 'output', content: 'Type "help" for a list of commands or ask any question.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive) {
      inputRef.current?.focus();
    }
  }, [isActive, history]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input;
    setInput('');
    setLoading(true);

    setHistory(prev => [...prev, { type: 'command', content: cmd }]);

    if (cmd === 'clear') {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      // Collect recent command history for context
      const cmdHistory = history
        .filter(h => h.type === 'command')
        .map(h => h.content);

      const response = await executeTerminalCommand(cmd, cmdHistory);
      setHistory(prev => [...prev, { type: 'output', content: response }]);
    } catch (err) {
      setHistory(prev => [...prev, { type: 'output', content: 'Error executing command.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="h-full w-full bg-slate-950 p-2 font-mono text-sm text-slate-300 overflow-y-auto"
      ref={containerRef}
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((item, i) => (
        <div key={i} className="mb-1 whitespace-pre-wrap break-words">
          {item.type === 'command' ? (
            <div className="flex gap-2 text-white">
              <span className="text-green-400">guest@opendoor:~$</span>
              <span>{item.content}</span>
            </div>
          ) : (
            <div className="text-slate-400">{item.content}</div>
          )}
        </div>
      ))}
      
      {loading && <div className="animate-pulse text-slate-500">Processing...</div>}

      <form onSubmit={handleCommand} className="flex gap-2 mt-1">
        <span className="text-green-400">guest@opendoor:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 p-0"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
};