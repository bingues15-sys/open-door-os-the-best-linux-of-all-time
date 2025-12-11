import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { APPS } from './Apps';
import { AppId, WindowState } from '../types';
import { Search } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const Desktop: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(10);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hyprland-esque Wallpaper (Anime Scenery / Digital Art)
  const bgImage = "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=1976&auto=format&fit=crop";

  // Tiling Constants
  const GAP = 10;
  const MARGIN = 10;
  const TOP_BAR_HEIGHT = 48; // Taskbar height + margin

  // Layout Engine: Master/Stack
  const calculateLayout = useCallback((currentWindows: WindowState[]) => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    
    // Separate tiled and floating windows
    const tiledWindows = currentWindows.filter(w => !w.isMinimized && !w.isFloating);
    const otherWindows = currentWindows.filter(w => w.isMinimized || w.isFloating);

    if (tiledWindows.length === 0) return currentWindows;

    const availableW = screenW - (2 * MARGIN);
    const availableH = screenH - TOP_BAR_HEIGHT - MARGIN;
    const startX = MARGIN;
    const startY = TOP_BAR_HEIGHT;

    const updatedTiledWindows = tiledWindows.map((w, index) => {
      let newW = w;
      
      if (tiledWindows.length === 1) {
        // Single Window: Full Screen (with gaps)
        newW = {
          ...w,
          x: startX,
          y: startY,
          width: availableW,
          height: availableH
        };
      } else {
        // Master / Stack Layout
        const masterWidth = (availableW / 2) - (GAP / 2);
        const stackWidth = (availableW / 2) - (GAP / 2);
        const stackX = startX + masterWidth + GAP;

        if (index === 0) {
          // Master Window (Left)
          newW = {
            ...w,
            x: startX,
            y: startY,
            width: masterWidth,
            height: availableH
          };
        } else {
          // Stack Windows (Right)
          const stackCount = tiledWindows.length - 1;
          const stackIndex = index - 1;
          const stackHeight = (availableH - ((stackCount - 1) * GAP)) / stackCount;
          const stackY = startY + (stackIndex * (stackHeight + GAP));

          newW = {
            ...w,
            x: stackX,
            y: stackY,
            width: stackWidth,
            height: stackHeight
          };
        }
      }
      return newW;
    });

    const finalWindows = currentWindows.map(w => {
      const updated = updatedTiledWindows.find(uw => uw.id === w.id);
      return updated || w;
    });

    return finalWindows;
  }, []);

  // Re-layout on resize
  useEffect(() => {
    const handleResize = () => {
      setWindows(prev => calculateLayout(prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateLayout]);

  const launchApp = (appId: AppId) => {
    const appConfig = APPS[appId];
    
    // New windows start as Tiled by default (Hyprland style)
    const newWindow: WindowState = {
      id: generateId(),
      appId,
      title: appConfig.title,
      x: 0,
      y: 0,
      width: appConfig.defaultWidth,
      height: appConfig.defaultHeight,
      zIndex: maxZIndex + 1,
      isMinimized: false,
      isMaximized: false,
      isFloating: false, 
    };
    
    setWindows(prev => calculateLayout([...prev, newWindow]));
    setActiveWindowId(newWindow.id);
    setMaxZIndex(maxZIndex + 1);
    setStartMenuOpen(false);
    setSearchQuery('');
  };

  const closeWindow = (id: string) => {
    const remaining = windows.filter(w => w.id !== id);
    setWindows(calculateLayout(remaining));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const focusWindow = (id: string) => {
    if (activeWindowId === id) return;
    const newZ = maxZIndex + 1;
    setMaxZIndex(newZ);
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: newZ } : w));
    setActiveWindowId(id);
  };

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  const toggleFloat = (id: string) => {
    const updated = windows.map(w => w.id === id ? { ...w, isFloating: !w.isFloating } : w);
    setWindows(calculateLayout(updated));
  };

  const minimizeWindow = (id: string) => {
     const updated = windows.map(w => w.id === id ? { ...w, isMinimized: true } : w);
     setWindows(calculateLayout(updated));
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(windows.map(w => {
      if (w.id === id && w.isFloating) {
        return { ...w, x, y };
      }
      return w;
    }));
  };

  // Close start menu on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && startMenuOpen) {
            setStartMenuOpen(false);
        }
        if (e.key === 'Meta') {
            setStartMenuOpen(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startMenuOpen]);

  const filteredApps = Object.values(APPS).filter(app => 
      app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center font-sans select-none"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div 
        className="absolute inset-0" 
        onMouseDown={() => {
            setActiveWindowId(null);
            setStartMenuOpen(false);
        }} 
      />

      {windows.map(win => {
        const AppComp = APPS[win.appId].component;
        return (
          <Window
            key={win.id}
            windowState={win}
            isActive={activeWindowId === win.id}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximize}
            onToggleFloat={toggleFloat}
            onFocus={focusWindow}
            onMove={moveWindow}
          >
            <AppComp windowId={win.id} isActive={activeWindowId === win.id} />
          </Window>
        );
      })}

      {startMenuOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-100">
              <div 
                className="w-[500px] bg-slate-900/95 border border-blue-500/30 rounded-xl p-4 shadow-2xl flex flex-col gap-4"
                onClick={e => e.stopPropagation()}
              >
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto pr-1">
                      {filteredApps.length > 0 ? (
                          filteredApps.map((app, index) => (
                              <button 
                                key={app.id}
                                onClick={() => launchApp(app.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors group text-left ${index === 0 ? 'bg-slate-800' : ''}`}
                              >
                                  <app.icon size={20} className="text-slate-400 group-hover:text-white" />
                                  <span className="font-mono text-sm text-slate-300 group-hover:text-white">{app.title}</span>
                              </button>
                          ))
                      ) : (
                          <div className="p-4 text-center text-slate-500 font-mono text-sm">No results found</div>
                      )}
                  </div>
              </div>
          </div>
      )}

      <Taskbar 
        openApps={windows.map(w => w.appId)}
        activeAppId={activeWindowId ? windows.find(w => w.id === activeWindowId)?.appId || null : null}
        onLaunch={launchApp}
        onToggleStart={() => setStartMenuOpen(!startMenuOpen)}
      />
    </div>
  );
}