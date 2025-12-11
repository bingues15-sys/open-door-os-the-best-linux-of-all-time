import React, { useState, useEffect, useRef } from 'react';
import { AppWindowProps } from '../../types';
import { Target, Crosshair, Trophy, MousePointer2 } from 'lucide-react';

export const GameRunner: React.FC<AppWindowProps> = ({ args }) => {
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  
  // CS2 State
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetPos, setTargetPos] = useState({ top: '50%', left: '50%' });

  // Farming State
  const [crops, setCrops] = useState(0);
  const [gold, setGold] = useState(0);

  const gameId = args?.gameId || 'cs2';
  const gameTitle = args?.title || 'Game';

  useEffect(() => {
    // Fake loading screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Aim Trainer Logic
  useEffect(() => {
    if (gameId === 'cs2' && gameStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft, gameId]);

  const moveTarget = () => {
    const top = Math.floor(Math.random() * 80 + 10) + '%';
    const left = Math.floor(Math.random() * 80 + 10) + '%';
    setTargetPos({ top, left });
  };

  const handleShoot = () => {
    if (timeLeft > 0) {
        setScore(s => s + 100);
        moveTarget();
    }
  };

  const renderLoader = () => (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white gap-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="font-mono text-lg animate-pulse">Launching {gameTitle}...</div>
        <div className="text-xs text-slate-500">Initializing WebGL Context...</div>
    </div>
  );

  if (loading) return renderLoader();

  // RENDER: Aim Trainer (CS2, Cyberpunk)
  if (gameId === 'cs2' || gameId === 'cyberpunk' || gameId === 'h2') {
    return (
      <div className="h-full bg-slate-900 relative overflow-hidden select-none cursor-crosshair font-mono">
        {!gameStarted ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                <h1 className="text-4xl font-bold text-white mb-4 uppercase tracking-widest">{gameTitle}</h1>
                <div className="text-slate-400 mb-8">Aim Trainer Mode</div>
                <button 
                    onClick={() => setGameStarted(true)}
                    className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded clip-path-polygon"
                >
                    ENTER MATCH
                </button>
            </div>
        ) : (
            <>
                {/* HUD */}
                <div className="absolute top-4 left-4 text-white text-2xl font-bold drop-shadow-md">
                    SCORE: {score}
                </div>
                <div className="absolute top-4 right-4 text-yellow-400 text-2xl font-bold drop-shadow-md">
                    TIME: {timeLeft}
                </div>

                {/* Game Over */}
                {timeLeft === 0 && (
                    <div className="absolute inset-0 bg-black/80 z-20 flex flex-col items-center justify-center">
                        <div className="text-6xl font-bold text-white mb-4">MATCH FINISHED</div>
                        <div className="text-2xl text-yellow-400 mb-8">FINAL SCORE: {score}</div>
                        <button 
                            onClick={() => { setTimeLeft(30); setScore(0); }}
                            className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors"
                        >
                            PLAY AGAIN
                        </button>
                    </div>
                )}

                {/* Target */}
                {timeLeft > 0 && (
                    <div 
                        className="absolute w-12 h-12 bg-red-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(239,68,68,0.8)] cursor-pointer active:scale-95 transition-transform"
                        style={{ top: targetPos.top, left: targetPos.left }}
                        onMouseDown={handleShoot}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Target className="text-white w-8 h-8" />
                        </div>
                    </div>
                )}
                
                {/* Background Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-10" 
                     style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
            </>
        )}
      </div>
    );
  }

  // RENDER: Farming Clicker (Stardew, Elden Ring, Dota, Terraria)
  return (
    <div className="h-full bg-green-900 relative overflow-hidden select-none font-sans text-white">
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <div className="relative z-10 flex flex-col h-full">
             <div className="p-4 bg-black/40 flex justify-between items-center border-b border-white/10">
                 <h2 className="font-bold text-lg">{gameTitle}</h2>
                 <div className="flex gap-4">
                     <div className="flex items-center gap-2">
                         <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                         <span>{gold} G</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                         <span>{crops} Harvested</span>
                     </div>
                 </div>
             </div>

             <div className="flex-1 flex items-center justify-center">
                 <button 
                    onClick={() => {
                        setCrops(c => c + 1);
                        setGold(g => g + Math.floor(Math.random() * 5 + 1));
                    }}
                    className="w-48 h-48 bg-green-600 hover:bg-green-500 rounded-xl shadow-[0_10px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[10px] transition-all flex flex-col items-center justify-center gap-2 border-4 border-green-400"
                 >
                     <MousePointer2 size={48} />
                     <span className="font-bold text-xl">HARVEST</span>
                 </button>
             </div>

             <div className="h-32 bg-black/60 border-t border-white/10 p-4 flex gap-4 overflow-x-auto">
                 <div className="w-24 h-full bg-slate-800 rounded flex flex-col items-center justify-center border border-white/5 opacity-50 cursor-not-allowed">
                     <span className="text-xs mb-1">Auto-Harvester</span>
                     <span className="text-yellow-400 font-bold text-xs">500 G</span>
                 </div>
                 <div className="w-24 h-full bg-slate-800 rounded flex flex-col items-center justify-center border border-white/5 opacity-50 cursor-not-allowed">
                     <span className="text-xs mb-1">Fertilizer</span>
                     <span className="text-yellow-400 font-bold text-xs">100 G</span>
                 </div>
             </div>
         </div>
    </div>
  );
};