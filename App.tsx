import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Share2, Compass, Trophy, Command, HardDrive, Gamepad2, Layers } from 'lucide-react';
import Particles from './components/Particles';
import HomeView from './components/HomeView';
import GameModeSelectorView from './components/GameModeSelectorView';
import BoardHUD from './components/BoardHUD';
import { GameMode } from './types';

const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHM8Y5UNAdVqBvdQIFSEEg2onSwepqLTFLU1N1WOG6M8U6k8enTNjqqocUPmdF2WuXgwbt2fCr_Dv74XjWMcq2t8zXpnaa1EtbqOs7YV970zFcF5S7rJR80Vht4V0UXV94Im2U93B8H3OCBxMIw4Qzbh5E4vAvm9XakJS7A8y5V6-OJyOWjphYvx0n8-0OgEiVKbETwHBSF28aVAsWQBZAto9J9yzrtoTaF6TzBsdBevfOnhdj-c2FRs7oamdSc8prUClk8riUBxY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuACU5pKM_viRUu-bSZUWCzI1mIVqgLOf1x3LfozBgwljiXD5L1xF8L1Q_UZCAxn8ULBzCUJlLbTdCunIRXgW7nxae2YHHrdtwFJO52obwA7cjbT1dz_OuSIjVf-h7IVYXWaaAzT1ZzRtbr6zPrPZz-e6YhXBGZikfhmjeKGOnbpwW6OuKyGePHBxvuHkYi1zu-8gmp7LP_CH7sNF-Tv7zZdaFQSqLIFCearKC4KmEsLKfOv23VOJmqUO88xRaZ_sqwBwzLvDb8c5jY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyuc38B-TTDy9gVXjymqW7XCfYAQOIGW3T-F_OS4qIXihG75CPT9KRk5L4XXDQZ6dZ4P2EUSVlWGMPQoV3lph_rEHh7N3bx8ENuTPioNoDIMgYq5LU6BD0JA2vkIWUXk-MNpAg7cd46YiCR8BUvm80ZtjXuxMKhRv7-6uFaPfbhZTysklx3egqp3xFyx3zIy1OvB37HxmxtEyL4NUowytP-tuWxs_t61knJcK_Ij-KJwgwutwHpvnv4muHXGE0nwhoayXcsLRngAQ"
];

const PILOT_NAMES = ["CYBER_WOLF", "GHOST_SHELL", "NEURAL_LINK", "QUANTUM_REAPER", "HYDRA_OPERATIVE", "MATRIX_SURGE", "SOLAR_SPECTRE"];

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home'); // 'home', 'play-menu', 'hud'
  const [selectedMode, setSelectedMode] = useState<GameMode>('training');
  const [credits, setCredits] = useState<number>(12450);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [showShareNotification, setShowShareNotification] = useState<boolean>(false);

  // Matchmaking unique identity properties per tab
  const [myId] = useState(() => 'P-' + Math.random().toString(36).substr(2, 6));
  const [myName] = useState(() => {
    const nameStr = PILOT_NAMES[Math.floor(Math.random() * PILOT_NAMES.length)];
    return `${nameStr}_${Math.floor(Math.random() * 900 + 100)}`;
  });
  const [myAvatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);

  // Live match session states
  const [matchId, setMatchId] = useState<string | null>(null);
  const [playerIndex, setPlayerIndex] = useState<number | null>(null);

  const handleUpdateCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
  };

  const triggerShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareNotification(true);
    setTimeout(() => {
      setShowShareNotification(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-primary selection:text-black">
      {/* Dynamic backdrop particles matrix */}
      <Particles />

      {/* STICKY TOP NAVIGATION BAR HEADER */}
      <header className="sticky top-0 w-full bg-[#050505]/75 backdrop-blur-md border-b border-white/5 z-50">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          
          {/* Logo element */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors">
              <Command className="w-4 h-4 text-primary group-hover:rotate-45 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-sora font-extrabold text-[#00f2ff] text-base tracking-widest">
                STRAT9
              </span>
              <span className="font-mono text-[8px] text-on-surface-variant/40 tracking-[0.2em] font-bold uppercase leading-none">
                Tactical OS
              </span>
            </div>
          </div>

          {/* Nav Links Center */}
          <nav className="flex items-center gap-1.5 md:gap-4">
            <button
              id="nav-link-deck"
              onClick={() => setCurrentPage('home')}
              className={`px-3 py-1.5 font-mono text-[10px] md:text-xs font-extrabold uppercase tracking-widest transition-all rounded
                ${currentPage === 'home' 
                  ? 'bg-primary-container/[0.08] text-[#00f2ff] border-b-2 border-b-[#00f2ff]'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                }
              `}
            >
              Command Deck
            </button>
            <button
              id="nav-link-play"
              onClick={() => setCurrentPage('play-menu')}
              className={`px-3 py-1.5 font-mono text-[10px] md:text-xs font-extrabold uppercase tracking-widest transition-all rounded
                ${currentPage === 'play-menu' 
                  ? 'bg-primary-container/[0.08] text-[#00f2ff] border-b-2 border-b-[#00f2ff]'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                }
              `}
            >
              Play Lobby
            </button>
            <button
              id="nav-link-hud"
              onClick={() => setCurrentPage('hud')}
              className={`px-3 py-1.5 font-mono text-[10px] md:text-xs font-extrabold uppercase tracking-widest transition-all rounded
                ${currentPage === 'hud' 
                  ? 'bg-primary-container/[0.08] text-[#00f2ff] border-b-2 border-b-[#00f2ff]'
                  : 'text-on-surface-variant hover:text-white hover:bg-white/5'
                }
              `}
            >
              Tactical HUD
            </button>
          </nav>

          {/* Quick status controls on navigation right side */}
          <div className="flex items-center gap-3.5 md:gap-5">
            
            {/* Audio Toggle button */}
            <button 
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-1.5 bg-[#131313] hover:bg-[#201f1f] rounded border border-white/5 transition-colors group text-on-surface-variant hover:text-white"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Share link button */}
            <button 
              onClick={triggerShareLink}
              className="p-1.5 bg-[#131313] hover:bg-[#201f1f] rounded border border-white/5 transition-colors group text-on-surface-variant hover:text-white relative"
            >
              <Share2 className="w-4 h-4" />
              <AnimatePresence>
                {showShareNotification && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute right-0 top-10 w-44 bg-[#0e0e0e] border border-primary/20 text-primary-container font-mono text-[9px] uppercase font-bold p-2 text-center rounded shadow-xl pointer-events-none"
                  >
                    LINK SECURED TO CLIPBOARD
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div className="h-6 w-[1.5px] bg-white/10 hidden sm:block" />

            {/* Account Profile Card inside launcher header */}
            <div className="flex items-center gap-3 bg-[#131313]/90 border border-white/5 rounded pl-3 pr-2.5 py-1 z-30 select-none">
              <div className="text-right hidden sm:block leading-none">
                <span className="font-mono text-[9px] text-[#00f2ff] font-extrabold uppercase tracking-widest block mb-0.5">SECURE USER</span>
                <span className="font-sora text-[11px] font-bold text-white block">{myName}</span>
              </div>
              
              <div className="w-8 h-8 rounded-full border border-primary/30 p-0.5 overflow-hidden bg-primary/15 relative">
                <img 
                  alt="My User profile" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                  src={myAvatar} 
                />
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* ROUTING CONTAINER FOR EACH OF THE SEAMLESS SCREEN PRESETS */}
      <div className="relative w-full">
        {currentPage === 'home' && (
          <HomeView 
            onSelectPage={setCurrentPage} 
            onSelectMode={setSelectedMode} 
            credits={credits} 
          />
        )}

        {currentPage === 'play-menu' && (
          <GameModeSelectorView 
            onSelectPage={setCurrentPage} 
            selectedMode={selectedMode} 
            onSelectMode={setSelectedMode} 
            credits={credits} 
            myId={myId}
            myName={myName}
            myAvatar={myAvatar}
            setMatchId={setMatchId}
            setPlayerIndex={setPlayerIndex}
          />
        )}

        {currentPage === 'hud' && (
          <BoardHUD 
            onBackToMenu={() => setCurrentPage('play-menu')} 
            gameMode={selectedMode} 
            onUpdateCredits={handleUpdateCredits} 
            myId={myId}
            myName={myName}
            myAvatar={myAvatar}
            matchId={matchId}
            playerIndex={playerIndex}
          />
        )}
      </div>
    </div>
  );
}
