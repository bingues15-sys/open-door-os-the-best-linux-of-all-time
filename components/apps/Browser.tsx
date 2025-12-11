import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Menu, Search, Lock, Star, Plus, X, Globe, Mic, Camera } from 'lucide-react';
import { AppWindowProps } from '../../types';

// Mock Search Results for Simulation
const MOCK_RESULTS = [
  { title: "Open Door OS - The Future of Web Desktops", url: "https://opendoor.os", desc: "Experience a seamless, Linux-inspired operating system directly in your browser. Powered by React and AI." },
  { title: "React - The Library for Web and Native User Interfaces", url: "https://react.dev", desc: "React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video." },
  { title: "Tailwind CSS - Rapidly build modern websites", url: "https://tailwindcss.com", desc: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces without leaving your HTML." },
  { title: "Vite | Next Generation Frontend Tooling", url: "https://vitejs.dev", desc: "Get ready for a development environment that can finally keep up with you. Instant Server Start. Lightning Fast HMR." },
  { title: "TypeScript: JavaScript With Syntax For Types", url: "https://www.typescriptlang.org", desc: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale." },
  { title: "Hyprland - The dynamic tiling Wayland compositor", url: "https://hyprland.org", desc: "Hyprland is a dynamic tiling Wayland compositor based on wlroots that doesn't sacrifice on its looks." },
  { title: "Steam: The Ultimate Online Game Platform", url: "https://store.steampowered.com", desc: "Steam is the ultimate destination for playing, discussing, and creating games." },
];

const GoogleHome: React.FC<{ onSearch: (q: string) => void }> = ({ onSearch }) => {
  const [q, setQ] = useState('');
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white text-slate-800">
       <div className="flex flex-col items-center w-full max-w-[584px] px-4 -mt-32">
          <h1 className="text-[90px] font-bold tracking-tighter mb-8 select-none">
            <span className="text-[#4285f4]">G</span>
            <span className="text-[#ea4335]">o</span>
            <span className="text-[#fbbc05]">o</span>
            <span className="text-[#4285f4]">g</span>
            <span className="text-[#34a853]">l</span>
            <span className="text-[#ea4335]">e</span>
          </h1>
          
          <form 
            className="w-full relative group"
            onSubmit={(e) => { e.preventDefault(); onSearch(q); }}
          >
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
                className="w-full border border-slate-200 rounded-full py-3 px-12 text-base focus:outline-none focus:shadow-md hover:shadow-sm transition-shadow"
                value={q}
                onChange={e => setQ(e.target.value)}
                autoFocus
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3 text-slate-500">
                <Mic size={20} className="cursor-pointer hover:text-[#4285f4]" />
                <Camera size={20} className="cursor-pointer hover:text-[#4285f4]" />
             </div>
          </form>

          <div className="flex gap-3 mt-8">
             <button onClick={() => onSearch(q)} className="bg-[#f8f9fa] border border-[#f8f9fa] hover:border-[#dadce0] hover:shadow-sm px-4 py-2 text-sm rounded text-[#3c4043] font-medium">
               Google Search
             </button>
             <button className="bg-[#f8f9fa] border border-[#f8f9fa] hover:border-[#dadce0] hover:shadow-sm px-4 py-2 text-sm rounded text-[#3c4043] font-medium">
               I'm Feeling Lucky
             </button>
          </div>
       </div>
    </div>
  );
};

const GoogleResults: React.FC<{ query: string; onSearch: (q: string) => void }> = ({ query, onSearch }) => {
  const [q, setQ] = useState(query);
  
  // Simple "search" simulation
  const results = query 
    ? MOCK_RESULTS.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) || 
        r.desc.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_RESULTS;

  // If no results, show generic ones
  const displayResults = results.length > 0 ? results : MOCK_RESULTS.slice(0, 3);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 overflow-y-auto">
       {/* Header */}
       <div className="border-b border-slate-100 p-6 pb-0 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-8 mb-4">
            <h1 className="text-2xl font-bold tracking-tighter cursor-pointer select-none" onClick={() => onSearch('')}>
                <span className="text-[#4285f4]">G</span>
                <span className="text-[#ea4335]">o</span>
                <span className="text-[#fbbc05]">o</span>
                <span className="text-[#4285f4]">g</span>
                <span className="text-[#34a853]">l</span>
                <span className="text-[#ea4335]">e</span>
            </h1>
            <form 
                className="flex-1 max-w-[690px] relative"
                onSubmit={(e) => { e.preventDefault(); onSearch(q); }}
            >
                <input 
                    className="w-full border border-slate-200 rounded-full py-2.5 px-5 text-base shadow-sm focus:outline-none focus:shadow-md hover:shadow-md transition-shadow"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4285f4] cursor-pointer" size={20} onClick={() => onSearch(q)} />
            </form>
            <div className="ml-auto w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">G</div>
          </div>
          <div className="flex gap-6 text-sm text-[#5f6368] ml-[150px]">
             <div className="pb-3 border-b-2 border-[#1a73e8] text-[#1a73e8] font-medium cursor-pointer">All</div>
             <div className="pb-3 hover:text-[#1a73e8] cursor-pointer">Images</div>
             <div className="pb-3 hover:text-[#1a73e8] cursor-pointer">Videos</div>
             <div className="pb-3 hover:text-[#1a73e8] cursor-pointer">News</div>
             <div className="pb-3 hover:text-[#1a73e8] cursor-pointer">Maps</div>
          </div>
       </div>

       {/* Results */}
       <div className="px-[180px] py-6 max-w-[800px]">
          <div className="text-sm text-[#70757a] mb-4">
             About {displayResults.length * 145000} results (0.42 seconds)
          </div>

          {displayResults.map((result, i) => (
             <div key={i} className="mb-8 font-sans">
                <div className="group cursor-pointer mb-1">
                   <div className="text-sm text-[#202124] flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center p-1">
                         <img src={`https://www.google.com/s2/favicons?domain=${result.url}`} className="w-4 h-4" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                      <div className="flex flex-col">
                         <span className="font-medium truncate">{new URL(result.url).hostname}</span>
                         <span className="text-xs text-[#5f6368] truncate">{result.url}</span>
                      </div>
                   </div>
                   <h3 className="text-xl text-[#1a0dab] group-hover:underline truncate visited:text-[#609]">{result.title}</h3>
                </div>
                <div className="text-sm text-[#4d5156] leading-relaxed">
                   {result.desc}
                </div>
             </div>
          ))}
          
          {results.length === 0 && (
              <div className="text-sm text-[#4d5156]">
                  <p>Your search - <span className="font-bold">{query}</span> - did not match any documents.</p>
                  <p className="mt-4">Suggestions:</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Make sure that all words are spelled correctly.</li>
                      <li>Try different keywords.</li>
                      <li>Try more general keywords.</li>
                  </ul>
              </div>
          )}
       </div>
    </div>
  );
};

export const Browser: React.FC<AppWindowProps> = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [displayUrl, setDisplayUrl] = useState('https://www.google.com');
  const [isLoading, setIsLoading] = useState(false);

  const isGoogleHome = url === 'https://www.google.com' || url === 'google.com' || url === 'about:blank' || url === '';
  const isGoogleSearch = url.startsWith('https://www.google.com/search');

  // Sync display URL when internal URL changes programmatically
  useEffect(() => {
    setDisplayUrl(url);
  }, [url]);

  const navigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = displayUrl;
    
    // Check if it's a search query or a URL
    if (!target.includes('.') || target.includes(' ')) {
        handleGoogleSearch(target);
        return;
    }

    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target);
    setIsLoading(true);
  };

  const handleGoogleSearch = (query: string) => {
      if (!query.trim()) {
          setUrl('https://www.google.com');
      } else {
          setUrl(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
      }
      setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#1C1B22] text-white">
      {/* Firefox Tab Strip */}
      <div className="flex items-end px-2 pt-2 gap-2 bg-[#0C0C0D] border-b border-[#1C1B22]">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#2B2A33] rounded-t-lg text-sm max-w-[200px] flex-1 relative group shadow-md text-white">
           <Globe size={14} className="text-blue-400"/>
           <span className="truncate flex-1 font-medium text-xs">
               {isGoogleHome ? 'Google' : isGoogleSearch ? `${new URLSearchParams(url.split('?')[1]).get('q')} - Google Search` : url}
           </span>
           <button className="opacity-0 group-hover:opacity-100 hover:bg-white/20 p-0.5 rounded-full transition-opacity">
              <X size={12}/>
           </button>
           <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t-lg"></div>
        </div>
        <div className="p-2 hover:bg-white/10 rounded-lg mb-1 cursor-pointer text-slate-400 hover:text-white transition-colors">
           <Plus size={16} />
        </div>
      </div>

      {/* Firefox Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-[#1C1B22] border-b border-black/20 shadow-md">
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-300 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-300 transition-colors">
            <ArrowRight size={16} />
          </button>
          <button 
            className="p-1.5 hover:bg-white/10 rounded-md text-slate-300 transition-colors"
            onClick={() => {
                setIsLoading(true); 
                const current = url;
                if (!isGoogleHome && !isGoogleSearch) {
                    setUrl('');
                    setTimeout(() => setUrl(current), 10);
                } else {
                    setIsLoading(false);
                }
            }}
          >
            <RotateCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        
        <form onSubmit={navigate} className="flex-1 relative group">
           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
             {url.startsWith('https') ? <Lock size={12} className="text-green-500"/> : <Search size={14} />}
           </div>
           <input 
             className="w-full bg-[#2B2A33] hover:bg-[#42414D] focus:bg-[#42414D] border-none rounded-md py-2 pl-9 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
             value={displayUrl}
             onChange={(e) => setDisplayUrl(e.target.value)}
             placeholder="Search with Google or enter address"
           />
           <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1 hover:bg-white/10 rounded">
              <Star size={14} />
           </div>
        </form>

        <button className="p-1.5 hover:bg-white/10 rounded-md text-slate-300 transition-colors ml-1">
            <Menu size={18} />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {isGoogleHome ? (
            <GoogleHome onSearch={handleGoogleSearch} />
        ) : isGoogleSearch ? (
            <GoogleResults 
                query={new URLSearchParams(url.split('?')[1]).get('q') || ''} 
                onSearch={handleGoogleSearch}
            />
        ) : (
            <>
                <iframe 
                src={url} 
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms"
                onLoad={() => setIsLoading(false)}
                title="browser-frame"
                />
                {/* Overlay for sites that refuse connection in iframe */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col items-center justify-center bg-[#1C1B22]/50 backdrop-blur-sm opacity-0 transition-opacity duration-500 delay-1000 animate-in fade-in">
                    <div className="bg-[#2B2A33] p-4 rounded-lg shadow-xl border border-white/10 text-center">
                        <p className="text-slate-200 text-sm font-bold mb-1">Content Blocked</p>
                        <p className="text-slate-400 text-xs">This website prevents embedding.</p>
                        <button onClick={() => window.open(url, '_blank')} className="mt-2 text-blue-400 text-xs hover:underline">
                            Open in new tab
                        </button>
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};