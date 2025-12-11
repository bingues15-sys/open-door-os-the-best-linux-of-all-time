import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search } from 'lucide-react';
import { AppWindowProps } from '../../types';

export const Browser: React.FC<AppWindowProps> = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [displayUrl, setDisplayUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = displayUrl;
    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target);
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-slate-200 border-b border-slate-300">
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-slate-300 rounded-full text-slate-600">
            <ArrowLeft size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-300 rounded-full text-slate-600">
            <ArrowRight size={16} />
          </button>
          <button 
            className="p-1.5 hover:bg-slate-300 rounded-full text-slate-600"
            onClick={() => {
                setIsLoading(true); 
                const current = url;
                setUrl('');
                setTimeout(() => setUrl(current), 10);
            }}
          >
            <RotateCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        
        <form onSubmit={navigate} className="flex-1 relative">
           <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400">
             <Search size={14} />
           </div>
           <input 
             className="w-full bg-white border border-slate-300 rounded-full py-1 pl-8 pr-4 text-sm focus:outline-none focus:border-blue-400"
             value={displayUrl}
             onChange={(e) => setDisplayUrl(e.target.value)}
           />
        </form>

        <button className="p-1.5 hover:bg-slate-300 rounded-full text-slate-600">
            <Home size={16} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden">
        <iframe 
          src={url} 
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms"
          onLoad={() => setIsLoading(false)}
          title="browser-frame"
        />
        {/* Overlay for sites that refuse connection in iframe */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-sm opacity-0 transition-opacity duration-500 delay-1000">
             <p className="text-slate-400 text-sm">If content doesn't load, it might be blocked by x-frame-options.</p>
        </div>
      </div>
    </div>
  );
};