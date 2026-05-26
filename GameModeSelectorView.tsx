import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, Users, ShieldAlert, Cpu, Award, Zap, RefreshCw, Circle, Radio, Compass, Gamepad2 } from 'lucide-react';
import { GameMode } from '../types';

interface GameModeSelectorViewProps {
  onSelectPage: (page: string) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  credits: number;
  myId?: string;
  myName?: string;
  myAvatar?: string;
  setMatchId?: (id: string | null) => void;
  setPlayerIndex?: (idx: number | null) => void;
}

export default function GameModeSelectorView({
  onSelectPage,
  selectedMode,
  onSelectMode,
  credits,
  myId,
  myName,
  myAvatar,
  setMatchId,
  setPlayerIndex
}: GameModeSelectorViewProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchPulseText, setSearchPulseText] = useState('INITIATING LINK');

  const startMatchmaking = async () => {
    if (selectedMode !== 'ranked') {
      setIsSearching(true);
      setSearchPulseText('CONNECTING TO MATRIX...');
      setTimeout(() => {
        setSearchPulseText(`AUTHENTICATED: ${myName || 'USER_42'}`);
        setTimeout(() => {
          if (setMatchId) setMatchId(null);
          if (setPlayerIndex) setPlayerIndex(null);
          onSelectPage('hud');
          setIsSearching(false);
        }, 1200);
      }, 1000);
      return;
    }

    // Live Multiplayer Ranked play matchmaking
    setIsSearching(true);
    setSearchPulseText('INITIATING PEER SEARCH...');
    try {
      const resp = await fetch('/api/matchmaking/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: myId,
          playerName: myName,
          avatar: myAvatar
        })
      });
      if (!resp.ok) {
        throw new Error('Connection failed');
      }
      const data = await resp.json();
      setSearchPulseText(data.playerIndex === 0 ? 'LOBBY SET. WAITING FOR CONNECT...' : 'LINK ESTABLISHED COMMS OK');
      
      if (setMatchId) setMatchId(data.matchId);
      if (setPlayerIndex) setPlayerIndex(data.playerIndex);

      setTimeout(() => {
        onSelectPage('hud');
        setIsSearching(false);
      }, 1500);
    } catch (e) {
      setSearchPulseText('LINK REJECTED. RETRYING...');
      setTimeout(() => setIsSearching(false), 2000);
    }
  };

  return (
    <div className="relative text-on-surface font-sans px-6 md:px-16 pt-24 pb-12 min-h-[90vh] flex flex-col justify-center max-w-7xl mx-auto z-10 select-none">
      
      {/* Decorative Matrix Background Elements */}
      <div className="absolute top-24 left-8 pointer-events-none opacity-30 select-none hidden md:block">
        <div className="font-mono text-[10px] text-[#00f2ff] space-y-1">
          <div>&gt; INIT HARDWARE HANDSHAKE...</div>
          <div>&gt; AUTHENTICATED COMMAND USER_42</div>
          <div>&gt; SIGNAL CALIBRATION: ONLINE</div>
          <div>&gt; SYSTEM_STABLE [v4.0.2]</div>
        </div>
      </div>

      <div className="absolute bottom-24 right-8 pointer-events-none opacity-20 select-none hidden md:block transform rotate-180">
        <div className="w-40 h-40 border border-primary/20 rounded-full flex items-center justify-center">
          <div className="w-32 h-32 border border-[#00fbfb]/10 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute w-[1.5px] h-20 bg-[#00f2ff] origin-bottom animate-[spin_3s_linear_infinite]" />
        </div>
      </div>

      {/* Header Section */}
      <header className="mb-10 max-w-4xl relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-[2px] bg-primary-container" />
          <span className="font-mono text-[10px] md:text-xs text-primary-container font-extrabold uppercase tracking-widest">
            Command Center // Active Sessions
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-sora font-extrabold text-white leading-none uppercase tracking-tight">
          Select Game Mode
        </h1>
      </header>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* Normal Match Card */}
        <motion.div
          onClick={() => onSelectMode('training')}
          whileHover={{ y: -4 }}
          className={`relative p-6 flex flex-col justify-between min-h-[380px] bg-[#131313]/60 backdrop-blur-md rounded-md border-l-4 cursor-pointer overflow-hidden transition-all duration-300
            ${selectedMode === 'training' 
              ? 'border-l-[#00f2ff] border border-[#00f2ff]/40 shadow-[0_0_25px_rgba(0,242,255,0.15)] bg-primary-container/5' 
              : 'border-l-[#3a494b] border border-white/5 hover:border-r-primary/20'
            }
          `}
        >
          {/* Subtle horizontal scanning line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent opacity-35 animate-[scan_3s_linear_infinite]" />
          
          <div>
            <span className="font-mono text-xs text-[#74f5ff]/60 mb-2 block tracking-wider font-extrabold">01 / TRAINING</span>
            <h2 className="text-2xl font-sora font-extrabold text-[#e1fdff] uppercase tracking-wide">Normal Match</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-2 leading-relaxed opacity-80">
              Casual match against a strategic computer defense matrix (Rival Bot). Practice pathways and hone blocking techniques.
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-6 flex flex-col gap-1 text-[11px] font-mono uppercase tracking-widest text-primary-fixed/80">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" />
                <span>CASUAL MATURING GRID</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>RIVAL SYSTEM BOT</span>
              </div>
            </div>

            <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300
              ${selectedMode === 'training'
                ? 'bg-primary-container/10 border-primary-container text-primary-container shadow-[0_0_15px_rgba(0,242,255,0.4)] animate-pulse'
                : 'bg-white/5 border-white/10 text-on-surface-variant'
              }
            `}>
              <Play className="w-6 h-6 fill-current ml-1" />
            </div>
          </div>
        </motion.div>

        {/* Ranked Play Card */}
        <motion.div
          onClick={() => onSelectMode('ranked')}
          whileHover={{ y: -4 }}
          className={`relative p-6 flex flex-col justify-between min-h-[380px] bg-[#131313]/60 backdrop-blur-md rounded-md border-l-4 cursor-pointer overflow-hidden transition-all duration-300
            ${selectedMode === 'ranked' 
              ? 'border-l-secondary-container border border-secondary-container/40 shadow-[0_0_25px_rgba(182,0,248,0.15)] bg-secondary-container/5' 
              : 'border-l-[#3a494b] border border-white/5 hover:border-r-primary/20'
            }
          `}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary-container to-transparent opacity-35 animate-[scan_3s_linear_infinite_1s]" />
          
          <div>
            <span className="font-mono text-xs text-secondary/60 mb-2 block tracking-wider font-extrabold">02 / COMPETITIVE</span>
            <h2 className="text-2xl font-sora font-extrabold text-[#ebb2ff] uppercase tracking-wide">Ranked Play</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-2 leading-relaxed opacity-80">
              Sweaty matches with rating points (RP). Test limits against higher-tier adaptive intelligence processors.
            </p>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/20 blur-lg rounded-full" />
                <img 
                  alt="Silver III Rank Badge" 
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-contain relative z-10" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaj2ZpV30muYsYR_zC3jjwfbCzCQ_r_8BJh4njnOL1QHw65Wt1C-31UBmG25Jc-RPp0Laq3gWkRo-uUxA1HeNRvepT16TeYbvaifdP9W80VgYImDwQsP9w-AvMDwczanSX0kvJ0lMHjANUCxAXdrSIyt7MAgtxItp8uftm2hNWX8TOQvmEk0PFVuoMJ7sXvjTbKneafD8h8EtJLTRqwWnFO5YfNSPj1XuNv7e1fbd0VWHuz35CB-SJO7Dizs66UiZq7yk7Fwh8zFI" 
                />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold text-secondary block tracking-widest uppercase">Ranked Tier</span>
                <span className="font-sora text-sm font-bold text-white block">SILVER III</span>
                <span className="font-mono text-[11px] text-on-surface-variant">1,450 SR</span>
              </div>
            </div>

            <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300
              ${selectedMode === 'ranked'
                ? 'bg-[#b600f8]/15 border-[#b600f8] text-secondary shadow-[0_0_15px_rgba(182,0,248,0.4)]'
                : 'bg-white/5 border-white/10 text-on-surface-variant'
              }
            `}>
              <Award className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        {/* Same Device Local Card */}
        <motion.div
          onClick={() => onSelectMode('samedevice')}
          whileHover={{ y: -4 }}
          className={`relative p-6 flex flex-col justify-between min-h-[380px] bg-[#131313]/60 backdrop-blur-md rounded-md border-l-4 cursor-pointer overflow-hidden transition-all duration-300
            ${selectedMode === 'samedevice' 
              ? 'border-l-on-surface-variant border border-on-surface-variant/40 shadow-[0_0_25px_rgba(255,255,255,0.08)] bg-white/5' 
              : 'border-l-[#3a494b] border border-white/5 hover:border-r-primary/20'
            }
          `}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#849495] to-transparent opacity-35 animate-[scan_3s_linear_infinite_2s]" />
          
          <div>
            <span className="font-mono text-xs text-on-surface-variant/50 mb-2 block tracking-wider font-extrabold">03 / SOCIAL</span>
            <h2 className="text-2xl font-sora font-extrabold text-[#e5e2e1] uppercase tracking-wide">Same Device</h2>
            <p className="text-xs text-on-surface-variant font-medium mt-2 leading-relaxed opacity-80">
              Proximity local tactical PVP warfare on a single unit. Share screens, pass-and-play, and settle scores instantly.
            </p>
          </div>

          <div className="mt-8">
            <div className="mb-6 flex flex-col gap-1 text-[11px] font-mono uppercase tracking-widest text-on-surface-variant/80">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                <span>LOCAL DUAL COMMANDS</span>
              </div>
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>PASS AND PLAY MODULE</span>
              </div>
            </div>

            <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300
              ${selectedMode === 'samedevice'
                ? 'bg-white/10 border-[#e5e2e1] text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                : 'bg-white/5 border-white/10 text-on-surface-variant'
              }
            `}>
              <Users className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Action panel underneath */}
      <div className="mt-12 flex flex-wrap items-center gap-6 relative z-10 bg-[#131313]/40 p-4 border border-white/5 rounded-md">
        <button 
          id="btn-matchmaking-search"
          onClick={startMatchmaking}
          disabled={isSearching}
          className="group relative px-10 py-4 bg-secondary-container text-on-secondary-container font-mono text-xs font-bold tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(182,0,248,0.4)] disabled:opacity-80"
        >
          {isSearching ? (
            <span className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              {searchPulseText}
            </span>
          ) : (
            <span className="flex items-center gap-3 font-semibold uppercase">
              SEARCH MATCH
              <Radio className="w-4 h-4 text-white animate-pulse" />
            </span>
          )}
        </button>

        <button 
          id="btn-custom-lobby"
          onClick={startMatchmaking}
          className="px-8 py-4 border border-primary-container/20 text-[#74f5ff] hover:bg-primary/5 hover:border-primary-container/40 font-mono text-xs font-bold tracking-[0.15em] transition-all rounded"
        >
          CUSTOM LOBBY
        </button>

        {/* Currency balance readout block */}
        <div className="ml-auto flex items-center border-l border-white/10 pl-6 h-12">
          <div className="flex flex-col items-end">
            <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest leading-none mb-1">Command Credits</span>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-mono text-xs text-[#00f2ff] font-bold">CR</span>
              <span className="text-xl md:text-2xl font-sora font-extrabold text-white">
                {credits.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Server Status Indicators footer */}
      <footer className="mt-12 flex flex-wrap justify-between items-center text-xs text-on-surface-variant font-mono relative z-10 border-t border-white/5 pt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse shadow-[0_0_8px_#00ff00]" />
            <span>SERVER STATUS: <span className="text-primary-fixed block md:inline font-bold">ONLINE</span></span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ENCRYPTED NEURAL OS LINK</span>
          </div>
        </div>
        <div className="text-on-surface-variant/40 mt-2 md:mt-0">
          STRAT9 PROTOCOL V4.0.2 // COMPILER OK
        </div>
      </footer>
    </div>
  );
}
