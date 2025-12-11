import React, { useState, useEffect } from 'react';
import { AppWindowProps } from '../../types';
import { Search, Bell, Download, Monitor, Gamepad2, Star, Play, Settings, CreditCard, ShoppingCart, Check, X } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  image: string;
  playing: boolean;
  hours: number;
  installed: boolean;
  installing?: boolean;
  progress?: number;
}

interface StoreItem {
    id: string;
    title: string;
    price: string;
    priceValue: number;
    image: string;
    tags: string[];
    addedToCart?: boolean;
}

export const Steam: React.FC<AppWindowProps> = () => {
  const [activeTab, setActiveTab] = useState<'store' | 'library' | 'community' | 'profile'>('store');
  const [selectedGameId, setSelectedGameId] = useState<string>('cs2');
  const [wallet, setWallet] = useState(12.50);
  const [cartCount, setCartCount] = useState(0);

  const [libraryGames, setLibraryGames] = useState<Game[]>([
    { id: 'cs2', title: 'Counter-Strike 2', image: 'https://images.unsplash.com/photo-1610041321420-a59553e46672?w=300', installed: true, playing: false, hours: 1240 },
    { id: 'dota2', title: 'Dota 2', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300', installed: true, playing: false, hours: 2500 },
    { id: 'cyberpunk', title: 'Cyberpunk 2077', image: 'https://images.unsplash.com/photo-1533972724312-6eafc8a819b0?w=300', installed: false, playing: false, hours: 45 },
    { id: 'stardew', title: 'Stardew Valley', image: 'https://images.unsplash.com/photo-1628151016005-7925dc529152?w=300', installed: true, playing: false, hours: 80 },
    { id: 'er', title: 'Elden Ring', image: 'https://images.unsplash.com/photo-1599322578678-bc46c050d54c?w=300', installed: false, playing: false, hours: 120 },
  ]);

  const [storeItems, setStoreItems] = useState<StoreItem[]>([
    { id: 'bg3', title: 'Baldur\'s Gate 3', price: '$59.99', priceValue: 59.99, image: 'https://images.unsplash.com/photo-1633511090164-b43840ea1607?w=800', tags: ['RPG', 'Story Rich'] },
    { id: 'h2', title: 'Hades II', price: '$29.99', priceValue: 29.99, image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800', tags: ['Action', 'Roguelike'] },
    { id: 'silksong', title: 'Hollow Knight: Silksong', price: 'TBA', priceValue: 0, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800', tags: ['Metroidvania', 'Indie'] },
    { id: 'terraria', title: 'Terraria', price: '$9.99', priceValue: 9.99, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300', tags: ['Sandbox', 'Survival'] },
    { id: 'mc', title: 'Minecraft', price: '$29.99', priceValue: 29.99, image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=300', tags: ['Sandbox', 'Building'] },
  ]);

  // Simulate download progress
  useEffect(() => {
    const installingGame = libraryGames.find(g => g.installing);
    if (installingGame) {
        const timer = setTimeout(() => {
            setLibraryGames(prev => prev.map(g => {
                if (g.id === installingGame.id) {
                    const newProgress = (g.progress || 0) + 5; // increment progress
                    if (newProgress >= 100) {
                        return { ...g, installing: false, installed: true, progress: 0 };
                    }
                    return { ...g, progress: newProgress };
                }
                return g;
            }));
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [libraryGames]);

  const handleInstall = (id: string) => {
    setLibraryGames(prev => prev.map(g => g.id === id ? { ...g, installing: true, progress: 0 } : g));
  };

  const handlePlay = (id: string) => {
    setLibraryGames(prev => prev.map(g => {
        if (g.id === id) {
            return { ...g, playing: !g.playing };
        }
        // Stop others if single instance logic desired, but let's allow multi-tasking for chaos
        return g;
    }));
  };

  const addToCart = (id: string) => {
    setStoreItems(prev => prev.map(item => item.id === id ? { ...item, addedToCart: true } : item));
    setCartCount(c => c + 1);
  };

  const renderLibrary = () => {
    const selected = libraryGames.find(g => g.id === selectedGameId) || libraryGames[0];

    return (
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-[#1b2838]/90 flex flex-col border-r border-white/5">
           <div className="p-3">
              <div className="relative">
                 <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                 <input className="w-full bg-[#0e141b] text-slate-300 text-xs py-1.5 pl-8 rounded border border-white/5 focus:outline-none focus:border-blue-500" placeholder="Search" />
              </div>
           </div>
           <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
              <div className="text-xs font-bold text-slate-500 px-2 py-1 uppercase tracking-wider mb-1">Favorites</div>
              {libraryGames.slice(0, 2).map(game => (
                  <div 
                    key={game.id} 
                    onClick={() => setSelectedGameId(game.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer mb-0.5 group ${selectedGameId === game.id ? 'bg-blue-500/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                      <img src={game.image} className="w-4 h-4 object-cover" />
                      <span className={`text-sm truncate flex-1 ${game.playing ? 'text-green-400' : ''}`}>{game.title}</span>
                      {game.installing && <Download size={10} className="text-blue-400 animate-bounce" />}
                      {game.playing && <div className="text-[10px] text-green-400 uppercase font-bold">Running</div>}
                  </div>
              ))}
              <div className="text-xs font-bold text-slate-500 px-2 py-1 uppercase tracking-wider mb-1 mt-4">Uncategorized</div>
              {libraryGames.slice(2).map(game => (
                  <div 
                    key={game.id} 
                    onClick={() => setSelectedGameId(game.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer mb-0.5 group ${selectedGameId === game.id ? 'bg-blue-500/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                      <img src={game.image} className="w-4 h-4 object-cover" />
                      <span className={`text-sm truncate flex-1 ${!game.installed ? 'text-slate-500' : ''} ${game.playing ? 'text-green-400' : ''}`}>
                          {game.title}
                      </span>
                      {game.installing && <Download size={10} className="text-blue-400 animate-bounce" />}
                      {game.playing && <div className="text-[10px] text-green-400 uppercase font-bold">Running</div>}
                  </div>
              ))}
           </div>
        </div>

        {/* Game Detail View */}
        <div className="flex-1 bg-[#1b2838] relative flex flex-col overflow-y-auto custom-scrollbar">
            {/* Hero Image Background */}
            <div className="absolute inset-0 h-[400px] opacity-20 pointer-events-none">
                <img src={selected.image} className="w-full h-full object-cover mask-gradient-to-b" style={{maskImage: 'linear-gradient(to bottom, black, transparent)'}} />
            </div>

            <div className="relative z-10 p-8 pt-12">
                <div className="flex items-center gap-4 mb-6">
                    <img src={selected.image} className="w-12 h-12 object-cover shadow-lg" />
                    <h2 className="text-3xl font-bold text-white">{selected.title}</h2>
                </div>

                <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 inline-flex items-center gap-6 mb-8 border border-white/5 min-w-[500px]">
                    {selected.installing ? (
                         <div className="flex-1 w-[160px] flex flex-col justify-center">
                             <div className="flex justify-between text-xs text-blue-300 mb-1">
                                 <span>Downloading...</span>
                                 <span>{selected.progress}%</span>
                             </div>
                             <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${selected.progress}%` }}></div>
                             </div>
                         </div>
                    ) : (
                        <button 
                            onClick={() => selected.installed ? handlePlay(selected.id) : handleInstall(selected.id)}
                            className={`${selected.playing ? 'bg-green-600 hover:bg-green-500' : selected.installed ? 'bg-[#66c0f4] hover:bg-[#419bc9]' : 'bg-slate-700 hover:bg-slate-600'} text-white px-8 py-3 rounded-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all w-[160px] justify-center`}
                        >
                            {selected.playing ? (
                                <>
                                    <X fill="currentColor" size={20} />
                                    STOP
                                </>
                            ) : selected.installed ? (
                                <>
                                    <Play fill="currentColor" size={20} />
                                    PLAY
                                </>
                            ) : (
                                <>
                                    <Download size={20} />
                                    INSTALL
                                </>
                            )}
                        </button>
                    )}
                    
                    <div className="flex flex-col text-sm text-[#8f98a0]">
                        <span>Last played</span>
                        <span className="text-white">{selected.playing ? 'Now' : 'Today'}</span>
                    </div>
                    <div className="flex flex-col text-sm text-[#8f98a0]">
                        <span>Play time</span>
                        <span className="text-white">{selected.hours + (selected.playing ? 0.1 : 0)} hours</span>
                    </div>
                    <div className="flex flex-col text-sm text-[#8f98a0]">
                        <span>Achievements</span>
                        <div className="flex gap-1 mt-1">
                            <div className="w-4 h-4 bg-yellow-600/50 border border-yellow-500 rounded-sm"></div>
                            <div className="w-4 h-4 bg-slate-700 rounded-sm"></div>
                            <div className="w-4 h-4 bg-slate-700 rounded-sm"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-4">
                        <div className="bg-[#10161d] p-4 rounded border border-white/5">
                            <h3 className="text-white font-bold mb-2">Activity</h3>
                            <div className="flex gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center font-bold">GU</div>
                                <div className="bg-[#1b2838] p-3 rounded flex-1">
                                    <div className="text-blue-300 font-bold text-sm">Guest User <span className="text-slate-400 font-normal">earned an achievement</span></div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <img src={selected.image} className="w-8 h-8" />
                                        <div className="text-white text-sm">First Blood</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-[#10161d] p-4 rounded border border-white/5">
                             <h3 className="text-white font-bold mb-2 text-sm uppercase">Friends who play</h3>
                             <div className="flex -space-x-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-8 h-8 rounded border border-[#10161d] bg-slate-700"></div>
                                ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };

  const renderStore = () => (
    <div className="flex-1 bg-[#1b2838] overflow-y-auto custom-scrollbar">
       <div className="max-w-5xl mx-auto p-6">
           {/* Featured Carousel */}
           <div className="mb-8 group cursor-pointer relative">
               <h3 className="text-white text-sm mb-2 font-bold">FEATURED & RECOMMENDED</h3>
               <div className="flex bg-[#0f141a] rounded shadow-xl overflow-hidden h-[350px]">
                   <div className="w-2/3 relative overflow-hidden">
                       <img src={storeItems[0].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                       <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                       </div>
                   </div>
                   <div className="w-1/3 p-4 flex flex-col justify-between bg-gradient-to-b from-[#0f141a] to-[#1b2838]">
                       <div>
                           <h2 className="text-2xl text-white mb-2">{storeItems[0].title}</h2>
                           <div className="flex flex-wrap gap-2 mb-4">
                               {storeItems[0].tags.map(t => (
                                   <span key={t} className="bg-white/10 text-[#c7d5e0] text-xs px-2 py-1 rounded">{t}</span>
                               ))}
                           </div>
                       </div>
                       <div>
                           <div className="text-white text-lg mb-2">{storeItems[0].price}</div>
                           {storeItems[0].addedToCart ? (
                               <button disabled className="bg-green-600/50 text-white w-full py-2 rounded-sm font-bold cursor-not-allowed flex items-center justify-center gap-2">
                                   <Check size={16} /> Added
                               </button>
                           ) : (
                                <button 
                                    onClick={() => addToCart(storeItems[0].id)}
                                    className="bg-[#66c0f4] hover:bg-[#419bc9] text-black hover:text-white w-full py-2 rounded-sm font-bold transition-colors"
                                >
                                    Add to Cart
                                </button>
                           )}
                       </div>
                   </div>
               </div>
           </div>

           {/* Special Offers */}
           <h3 className="text-white text-sm mb-2 font-bold">SPECIAL OFFERS</h3>
           <div className="grid grid-cols-3 gap-4 mb-8">
                {storeItems.slice(1).map((game, i) => (
                    <div key={i} className="bg-[#16202d] group flex flex-col hover:bg-[#1e2a3b] transition-colors relative">
                        <div className="relative overflow-hidden h-40">
                             <img src={game.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <h4 className="text-[#c7d5e0] font-bold truncate mb-2">{game.title}</h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {game.tags.slice(0,2).map(t => <span key={t} className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">{t}</span>)}
                            </div>
                            <div className="mt-auto flex justify-between items-center">
                                <div className="bg-[#4c6b22] text-[#a4d007] text-xs px-2 py-1">-20%</div>
                                <div className="flex gap-2 items-center">
                                    <div className="text-[#c7d5e0] text-sm">{game.price}</div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); if(!game.addedToCart) addToCart(game.id); }}
                                        className={`p-1.5 rounded-sm transition-colors ${game.addedToCart ? 'bg-green-500 text-white' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white'}`}
                                    >
                                        {game.addedToCart ? <Check size={14} /> : <ShoppingCart size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="bg-[#16202d] flex flex-col items-center justify-center text-slate-500 p-4 hover:bg-[#1e2a3b] cursor-pointer min-h-[250px]">
                    <Settings size={32} className="mb-2" />
                    <span>Browse All</span>
                </div>
           </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#171a21] text-[#c7d5e0] font-sans select-none">
      {/* Top Navigation */}
      <div className="h-14 flex items-center px-4 gap-8 bg-[#171a21] text-sm font-bold uppercase tracking-wider shrink-0">
         <div className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 mr-4">
            <Gamepad2 className="text-white" size={28} />
            STEAM
         </div>
         <button 
            onClick={() => setActiveTab('store')}
            className={`hover:text-white transition-colors border-b-4 h-full flex items-center ${activeTab === 'store' ? 'border-[#1a9fff] text-white' : 'border-transparent text-[#c7d5e0]'}`}
         >
             Store
         </button>
         <button 
            onClick={() => setActiveTab('library')}
            className={`hover:text-white transition-colors border-b-4 h-full flex items-center ${activeTab === 'library' ? 'border-[#1a9fff] text-white' : 'border-transparent text-[#c7d5e0]'}`}
         >
             Library
         </button>
         <button className="hover:text-white transition-colors text-[#c7d5e0]">Community</button>
         <button className="hover:text-white transition-colors text-[#c7d5e0]">guest</button>
         
         <div className="ml-auto flex items-center gap-4 text-[#c7d5e0]">
             <div className="bg-[#212c3d] px-3 py-1 rounded-sm flex items-center gap-2 text-xs font-bold text-green-400 cursor-pointer hover:bg-[#2a384d]">
                 <CreditCard size={14} />
                 ${wallet.toFixed(2)}
             </div>
             <button className="relative group">
                 <Bell size={18} className="cursor-pointer hover:text-white" />
                 <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-[#171a21]"></span>
             </button>
             {cartCount > 0 && (
                <div className="bg-green-600 hover:bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold cursor-pointer">
                    Cart ({cartCount})
                </div>
             )}
             <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white text-xs border border-white/20">GU</div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
          {activeTab === 'library' ? renderLibrary() : renderStore()}
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-[#171a21] border-t border-[#262c36] flex items-center justify-between px-4 text-xs text-[#8f98a0] shrink-0">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <Download size={12} />
                  <span>DOWNLOADS</span>
              </div>
              <div className="flex items-center gap-2 hover:text-white cursor-pointer">
                  <Settings size={12} />
                  <span>MANAGE</span>
              </div>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>ONLINE</span>
          </div>
      </div>
    </div>
  );
};