import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Square, Maximize2, Layers, BringToFront } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  windowState: WindowState;
  isActive: boolean;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onToggleFloat: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({
  windowState,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onToggleFloat,
  onFocus,
  onMove,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Focus on click
    if (!isActive) onFocus(windowState.id);
  };

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging if Floating and not Maximized
    if (windowState.isMaximized || !windowState.isFloating) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - windowState.x,
      y: e.clientY - windowState.y
    });
    onFocus(windowState.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onMove(windowState.id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove, windowState.id]);

  if (windowState.isMinimized) return null;

  // Hyprland Aesthetic:
  // Active: Gradient border
  // Inactive: Dark grey border
  const borderClass = isActive 
    ? "p-[2px] bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_20px_rgba(56,189,248,0.3)]" 
    : "p-[2px] bg-slate-700/50 shadow-xl";

  // Position logic
  const style: React.CSSProperties = windowState.isMaximized 
    ? { top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, borderRadius: 0 } 
    : { 
        top: windowState.y, 
        left: windowState.x, 
        width: windowState.width, 
        height: windowState.height,
        zIndex: windowState.zIndex,
        transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' // Smooth tiling animation
      };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col rounded-xl overflow-hidden ${borderClass}`}
      style={style}
      onMouseDown={handleMouseDown}
    >
      <div className="flex flex-col w-full h-full bg-slate-900 rounded-[10px] overflow-hidden">
        {/* Minimal Title Bar */}
        <div 
          className={`h-8 flex items-center justify-between px-3 select-none border-b border-white/5 ${
            windowState.isFloating ? 'bg-slate-800 cursor-move' : 'bg-slate-900/90 cursor-default'
          }`}
          onMouseDown={handleHeaderMouseDown}
          onDoubleClick={() => onMaximize(windowState.id)}
        >
          <div className="flex items-center gap-2">
             {!windowState.isFloating && (
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Tiled Mode" />
             )}
             <span className={`text-xs font-mono font-bold truncate max-w-[200px] ${isActive ? 'text-blue-400' : 'text-slate-500'}`}>
                {windowState.title}
             </span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFloat(windowState.id); }}
              className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-blue-300 transition-colors"
              title={windowState.isFloating ? "Switch to Tiling" : "Switch to Floating"}
            >
              {windowState.isFloating ? <BringToFront size={12} /> : <Layers size={12} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
              className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-colors"
            >
              <Minus size={12} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
              className="p-1 hover:bg-white/10 rounded text-slate-500 hover:text-white transition-colors"
            >
              {windowState.isMaximized ? <Square size={10} /> : <Maximize2 size={10} />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
              className="p-1 hover:bg-red-500/20 rounded text-slate-500 hover:text-red-400 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-950/50">
          {children}
        </div>
      </div>
    </div>
  );
};