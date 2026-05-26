import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Grid, Shield, Brain, Swords, ShoppingCart, Award, Zap, ChevronRight, Share2, Volume2, Gamepad2 } from 'lucide-react';
import { GameMode } from '../types';

interface HomeViewProps {
  onSelectPage: (page: string) => void;
  onSelectMode: (mode: GameMode) => void;
  credits: number;
}

export default function HomeView({ onSelectPage, onSelectMode, credits }: HomeViewProps) {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'stats'>('info');
  const [animateTimer, setAnimateTimer] = useState('04:22');

  // Hero tactical board layout constants
  const p1Pos = 4; // E1
  const p2Pos = 76; // E9
  const wallIndices = [12, 13, 14, 22, 58, 66, 67, 68];

  // Match timer simulation
  useEffect(() => {
    let secondsLeft = 262; // 4:22
    const interval = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        setAnimateTimer(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        secondsLeft = 262;
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleModeClick = (mode: GameMode) => {
    onSelectMode(mode);
    onSelectPage('hud');
  };

  return (
    <div className="relative text-on-background font-sans overflow-x-hidden pb-12">
      {/* Decorative Floating scanline overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-[0.06]">
        <div className="w-full h-1 bg-primary blur-sm animate-[scanline_8s_linear_infinite]" />
      </div>

      {/* Section 1: Hero Campaign */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 md:px-16 py-16">
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 via-transparent to-transparent z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 text-center mb-8 max-w-3xl"
        >
          <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary-fixed text-xs font-semibold tracking-widest rounded mb-3">
            TACTICAL NEURAL DOMINATION
          </span>
          <h1 className="text-4xl md:text-6xl font-sora font-extrabold tracking-tight text-primary drop-shadow-[0_0_15px_rgba(0,242,255,0.4)] uppercase">
            Master The Grid
          </h1>
          <p className="mt-3 text-sm md:text-base text-on-surface-variant font-medium tracking-[0.2em] uppercase leading-relaxed max-w-2xl mx-auto">
            9X9 Tactical Domination. Every move is a trap. Every wall is a weapon.
          </p>
        </motion.div>

        {/* Hero Interactive Board Component */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 w-full max-w-[480px] aspect-square bg-[#131313]/70 backdrop-blur-md p-4 rounded-lg border border-primary/20 shadow-[0_0_40px_rgba(0,242,255,0.1)] group flex flex-col items-center justify-center hover:border-primary/40 transition-colors"
        >
          {/* Virtual Grid Header */}
          <div className="absolute -top-10 left-4 right-4 flex justify-between px-2 font-mono text-[10px] text-primary/40 font-semibold uppercase tracking-widest">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].map((char) => (
              <span key={char} className="w-[11.1%] text-center">{char}</span>
            ))}
          </div>

          <div className="absolute -left-10 top-4 bottom-4 flex flex-col justify-between py-2 font-mono text-[10px] text-primary/40 font-semibold">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <span key={num} className="h-[11.1%] flex items-center">{num}</span>
            ))}
          </div>

          {/* Actual cells container */}
          <div className="grid grid-cols-9 grid-rows-9 gap-[3px] w-full h-full bg-[#050505]/80 p-2 rounded border border-white/5">
            {Array.from({ length: 81 }).map((_, i) => {
              const isP1 = i === p1Pos;
              const isP2 = i === p2Pos;
              const isWall = wallIndices.includes(i);
              
              return (
                <div
                  key={i}
                  id={`hero-cell-${i}`}
                  onMouseEnter={() => setHoveredCell(i)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`relative aspect-square border border-white/5 transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden group/cell
                    ${isWall ? 'bg-primary/20 shadow-[0_0_8px_rgba(0,242,255,0.3)] animate-pulse' : 'hover:bg-primary/5'}
                  `}
                >
                  {/* Glowing background hint */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover/cell:opacity-100 transition-opacity" />

                  {isP1 && (
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-4/5 h-4/5 rounded bg-primary-container shadow-[0_0_15px_#00f2ff] z-10"
                    />
                  )}

                  {isP2 && (
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                      className="w-4/5 h-4/5 rounded bg-secondary shadow-[0_0_15px_#bc13fe] z-10"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative z-20 mt-12 flex flex-wrap justify-center gap-4 max-w-4xl"
        >
          <button 
            id="hero-play-training"
            onClick={() => handleModeClick('training')}
            className="px-8 py-4 bg-secondary text-on-secondary font-mono text-xs font-bold tracking-[0.2em] border border-secondary shadow-[0_0_20px_rgba(188,19,254,0.4)] hover:shadow-[0_0_30px_rgba(188,19,254,0.6)] hover:bg-primary hover:border-primary hover:text-on-primary hover:scale-[1.03] transition-all duration-300"
          >
            TRAINING MATCH
          </button>
          
          <button 
            id="hero-play-ranked"
            onClick={() => handleModeClick('ranked')}
            className="px-8 py-4 bg-transparent border-2 border-primary text-primary font-mono text-xs font-bold tracking-[0.2em] shadow-[0_0_15px_rgba(0,242,255,0.15)] hover:shadow-[0_0_35px_rgba(0,242,255,0.4)] hover:bg-primary hover:text-on-primary hover:scale-[1.03] transition-all duration-300"
          >
            RANKED LEAGUE
          </button>

          <button 
            id="hero-play-local"
            onClick={() => handleModeClick('samedevice')}
            className="px-8 py-4 bg-[#131313] border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary font-mono text-xs font-bold tracking-[0.2em] hover:scale-[1.03] transition-all duration-300"
          >
            SAME DEVICE (PVP)
          </button>
        </motion.div>
      </section>

      {/* Section 2: System Mechanics */}
      <section id="system-mechanics-section" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-24 h-[3px] bg-secondary shadow-[0_0_12px_#bc13fe] mb-6" />
          <h2 className="text-3xl font-sora font-extrabold tracking-tight text-white uppercase">
            SYSTEM MECHANICS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#131313]/40 backdrop-blur-md p-8 border-l-4 border-l-primary border border-white/5 rounded-r hover:border-l-secondary transition-all"
          >
            <div className="text-primary mb-6">
              <Grid className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-sora font-bold text-primary mb-3">STRATEGIC MOVEMENT</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Navigate the 81-cell matrix. Every step determines your options. Predict route intersections to intercept the opponent before they reach your baseline.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#131313]/40 backdrop-blur-md p-8 border-l-4 border-l-primary border border-white/5 rounded-r hover:border-l-secondary transition-all"
          >
            <div className="text-primary mb-6">
              <Shield className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-sora font-bold text-primary mb-3">BARRICADE PLACEMENT</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Deploy holographic barricades to block pathways. Create complex corridors to funnel enemies, but preserve budget: each player has exactly 10 charges per match.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-[#131313]/40 backdrop-blur-md p-8 border-l-4 border-l-primary border border-white/5 rounded-r hover:border-l-secondary transition-all"
          >
            <div className="text-primary mb-6">
              <Brain className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-sora font-bold text-primary mb-3">TACTICAL MIND GAMES</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Victory is achieved in the mind. Bait your adversary into placing their barricades early, leaving them helpless as you slide through the gaps to absolute baseline victory.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Live Match Preview */}
      <section className="py-20 bg-[#0e0e0e]/50 border-y border-white/5">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="bg-[#131313]/50 backdrop-blur-md p-6 md:p-10 border border-primary/20 rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              {/* Player 1 details */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono text-xs text-primary font-bold tracking-widest uppercase">PLAYER 01</p>
                  <p className="text-lg md:text-2xl font-sora font-semibold text-primary">CYBER_WOLF</p>
                </div>
                <div className="w-14 h-14 rounded-lg border-2 border-primary p-0.5 overflow-hidden bg-[#201f1f]">
                  <img 
                    alt="Cyber Wolf Logo" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTPuSaneG3ZMEBzHReqFtmGWz5vqMha80EUh5FReJCcWJzUI-iIZMc7eMKXndHwnXmYn6Ie05h5lYZuq2tuz1Zikn-570KL5ord-IkM8bys49D9WEUwfIbo5NtpRon61ihJ2zzlbff_CUDN5liIvvGSFE4XqC4POJyj_cIectg3TvqcgS7RDCZuK5WbecAjCXUCb23IdRLbV1uBS1Imeq5xmIHJ9VypWL-nn491jV1oR6XeTxkfdcV8GEznfwL5Iup0rEcOUcVOeE" 
                  />
                </div>
              </div>

              {/* Match timer block */}
              <div className="flex flex-col items-center">
                <div className="font-mono text-xs text-secondary tracking-widest uppercase mb-1">MATCH TIMER</div>
                <div className="font-sora text-3xl font-extrabold text-primary bg-primary/5 px-6 py-2 rounded border border-primary/10 tracking-[0.1em] shadow-[0_0_20px_rgba(0,242,255,0.1)]">
                  {animateTimer}
                </div>
              </div>

              {/* Player 2 details */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg border-2 border-secondary p-0.5 overflow-hidden bg-[#201f1f]">
                  <img 
                    alt="Neural Link Logo" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5QFyZRmmINx04wGbBwEKRLiyjRLuuVvWd-fx2uRSCqLV8dApPdi88Yd_VHRUxt37Frf53543cjBrhCT7qAzgL5idYw6VjXaQo2hVMSNFuOW4x4p8yIyDbZm7Lnkx7g43b_eVp7eA-96b9HQUnBynyuMYj-c4kbvP7WJqHHmjhNGJ5HrruZGZChaZ0pLVBjPRrtO1EzFjhTBpRlM3omU_9DZmtERicnWYpfh7XBQPuXKVg3jHtRWbqwiS6pysmypWF-oKw5o2y2HI"
                  />
                </div>
                <div className="text-left">
                  <p className="font-mono text-xs text-secondary font-bold tracking-widest uppercase">PLAYER 02</p>
                  <p className="text-lg md:text-2xl font-sora font-semibold text-secondary">NEURAL_LINK</p>
                </div>
              </div>
            </div>

            {/* Static Simulated Gameplay Grid */}
            <div className="relative w-full max-w-[500px] mx-auto aspect-square bg-[#0e0e0e]/90 border border-primary/10 rounded overflow-hidden p-3 grid grid-cols-9 grid-rows-9 gap-1 shadow-[0_0_25px_rgba(0,242,255,0.05)]">
              {/* Path display vector */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
                <path 
                  className="opacity-50" 
                  d="M 50 10 L 50 20 L 39 20 L 39 40 L 61 40 L 61 60 L 50 60 L 50 82" 
                  fill="none" 
                  stroke="#00f2ff" 
                  strokeDasharray="2,2" 
                  strokeWidth="0.7" 
                />
              </svg>

              {Array.from({ length: 81 }).map((_, i) => {
                let badgeContent = null;
                let bgStyle = 'bg-[#1c1b1b]/30';

                // Specific preset cells for preview
                if (i === 13) {
                  badgeContent = <div className="w-full h-full bg-primary/40 shadow-[0_0_8px_#00f2ff]" />;
                } else if (i === 22) {
                  badgeContent = <div className="w-full h-full bg-primary/40 shadow-[0_0_8px_#00f2ff]" />;
                } else if (i === 58) {
                  badgeContent = <div className="w-full h-full bg-secondary/40 shadow-[0_0_8px_#bc13fe]" />;
                } else if (i === 40) {
                  badgeContent = <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#00f2ff]" />;
                } else if (i === 60) {
                  badgeContent = <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_10px_#bc13fe]" />;
                }

                return (
                  <div key={i} className={`border border-white/5 flex items-center justify-center relative ${bgStyle}`}>
                    {badgeContent}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Ranked Divisions Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-sora font-extrabold tracking-widest text-[#00f2ff] text-center mb-12 uppercase drop-shadow-[0_0_10px_rgba(0,242,255,0.2)]">
          RANKED DIVISIONS
        </h2>
        
        {/* Divisions slider */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
          {[
            { name: 'BRONZE', color: '#cd7f32', points: '240', glow: 'rgba(205,127,50,0.25)' },
            { name: 'SILVER', color: '#c0c0c0', points: '1,200', glow: 'rgba(192,192,192,0.25)' },
            { name: 'GOLD', color: '#ffd700', points: '2,850', glow: 'rgba(255,215,0,0.25)' },
            { name: 'PLATINUM', color: '#e5e4e2', points: '4,500', glow: 'rgba(229,228,226,0.25)' },
            { name: 'DIAMOND', color: '#00f2ff', points: '6,200', glow: 'rgba(0,242,255,0.25)' },
            { name: 'MASTER', color: '#bc13fe', points: '10,000+', glow: 'rgba(188,19,254,0.25)' },
          ].map((div) => (
            <motion.div
              key={div.name}
              whileHover={{ scale: 1.02 }}
              className="min-w-[280px] snap-center bg-[#131313]/60 backdrop-blur-md p-6 relative rounded-md border border-white/5 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-hidden"
              style={{ borderLeft: `4px solid ${div.color}` }}
            >
              <div 
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300" 
                style={{ background: `linear-gradient(90deg, ${div.glow}, transparent)` }}
              />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider" style={{ color: div.color }}>DIVISION</span>
                  <h4 className="text-2xl font-sora font-extrabold uppercase mt-1 mb-6" style={{ color: div.color }}>{div.name}</h4>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-mono text-[10px] text-on-surface-variant font-bold tracking-widest">MINIMUM RP</p>
                    <p className="text-2xl font-sora font-bold text-white mt-1">{div.points}</p>
                  </div>
                  <Award className="w-10 h-10" style={{ color: div.color }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Commanders Leaderboard & climb ranks promotion */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Leaders */}
          <div className="bg-[#131313]/50 backdrop-blur-md p-6 rounded-lg border border-primary/10">
            <div className="flex justify-between items-center mb-6">
              <h5 className="font-mono text-xs font-bold tracking-[0.15em] text-[#00f2ff] uppercase">TOP COMMANDERS</h5>
              <span className="font-mono text-[11px] text-on-surface-variant bg-white/5 px-2 py-1 rounded">SEASON 09</span>
            </div>

            <div className="space-y-3">
              {[
                { rank: '01', name: 'XENO_SLAYER', points: '14,202 RP', active: true },
                { rank: '02', name: 'VOID_WALKER', points: '13,980 RP', active: false },
                { rank: '03', name: 'NEON_REBEL', points: '13,440 RP', active: false },
              ].map((entry) => (
                <div 
                  key={entry.rank}
                  className={`flex justify-between items-center p-3 rounded transition-colors
                    ${entry.active ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-white/5 border-l-2 border-transparent'}
                  `}
                >
                  <div className="flex gap-4 items-center">
                    <span className={`font-mono text-xs font-bold ${entry.active ? 'text-primary' : 'text-on-surface-variant'}`}>{entry.rank}</span>
                    <span className="font-sora text-sm font-semibold text-white tracking-wide">{entry.name}</span>
                  </div>
                  <span className={`font-mono text-xs font-bold ${entry.active ? 'text-primary' : 'text-on-surface-variant'}`}>{entry.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Climb ranks promo */}
          <div className="relative overflow-hidden rounded-lg group border border-white/10 flex flex-col justify-end min-h-[220px]">
            <img 
              alt="Competitive Play Backdrop" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700 pointer-events-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8EmoN4IpPadqH56symL-pXJwdb_ilAVlYBgnrdHLqUBVjJ1IGCIkU9pgg94RRTcJAnAVGb3zwV4-0eHLTAVqDFCU-QLwuvf2z5WTxhvA4_gd40VL2BO1GfhDhU_F3jIna_TV_TzLJzY6m5rmTknYU5xG6KwuBj1nNiqv4qCED0yr9TaPH-N6qriYkFmTUEYYgSuzjAFC1c_Fzxa8Vrjr2FM7yFhW1e4FQHwYtATw5MErMF_bPqgWIR0oob0_oUpqLC0MlLRQD2cI" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
            
            <div className="relative z-20 p-6 md:p-8">
              <h4 className="text-xl md:text-2xl font-sora font-bold text-primary mb-2">CLIMB THE RANKS</h4>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-4 max-w-md">
                Earn exclusive season rewards, unlock glowing matrix chassis, and immortalize your command in the global ladder.
              </p>
              <button className="px-4 py-2 bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary font-mono text-[10px] tracking-[0.15em] font-bold transition-all uppercase rounded">
                VIEW GLOBAL STATS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Tournaments & Cosmetics Shop */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-[#0e0e0e]/30 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Live Tournament card */}
          <div className="bg-[#131313]/60 backdrop-blur-md p-8 border border-secondary/35 rounded-lg relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-secondary text-on-secondary font-mono text-[10px] font-bold tracking-widest uppercase mb-6 rounded-sm">
                LIVE TOURNAMENT
              </span>
              <h3 className="text-2xl md:text-4xl font-sora font-extrabold text-[#00f2ff] tracking-tight mb-3">CYBER CHASSIS OPEN</h3>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-6 max-w-lg">
                Enter the premier competitive championship. Outmaneuver other elite operators, defend your baseline, and register your team for the qualifiers.
              </p>
              
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                  <span className="text-on-surface-variant font-medium">PRIZE POOL</span>
                  <span className="text-primary font-bold tracking-wider">$50,000 USD</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2 text-xs">
                  <span className="text-on-surface-variant font-medium">START DATE</span>
                  <span className="text-primary font-bold tracking-wider">OCT 24, 2024</span>
                </div>
              </div>
            </div>

            <button className="w-full relative z-10 py-3 bg-transparent border-2 border-secondary text-secondary hover:bg-secondary hover:text-on-secondary font-mono text-xs font-bold tracking-[0.2em] transition-all rounded-sm uppercase">
              REGISTER NOW
            </button>
            
            {/* Ambient purple background gradient mesh */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
          </div>

          {/* Cosmetics Shop Preview */}
          <div className="bg-[#131313]/60 backdrop-blur-md p-8 border border-primary/25 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-sora font-extrabold text-primary">ARMORY & SKINS</h3>
                <ShoppingCart className="w-5 h-5 text-secondary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Product 1 */}
                <div className="bg-[#201f1f]/50 border border-transparent hover:border-primary p-4 rounded flex flex-col items-center text-center cursor-pointer group transition-all">
                  <img 
                    alt="Neon Grid Skin Preview" 
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain mb-3 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtuQoE1OcPSeyKdBMW-9DgjYm5rzOrhb15izzd7CVGtyp-5gBbQT88bFSJIBcbog31XuoMGHQsKvuIK_dvUgzOOEB9-5yIr4f6SAqWitaKIbn0yxHmzK6XGENY76EZtWSneUVCZt2cO03Rx1fVqVDlSOd7dUJV_L9_zC5yOtzioKkMPNqIZBseWmQl5ipGwECpFfzSjZEIZJI2JBczsO-ZM1tVZWQFt1_EK1e5BakWGx3hDH0qZm0W_cUyvn1dWC0Cr7yK_7npv-4"
                  />
                  <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">NEON GRID SKIN</span>
                  <span className="font-mono text-xs text-on-surface-variant font-bold mt-1">1200 CR</span>
                </div>

                {/* Product 2 */}
                <div className="bg-[#201f1f]/50 border border-transparent hover:border-primary p-4 rounded flex flex-col items-center text-center cursor-pointer group transition-all">
                  <img 
                    alt="Void Core Skin Preview" 
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 md:w-24 md:h-24 object-contain mb-3 opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzfv6_MuR8y8DJzS2nmGnUxbVX4NJpv7jP--R1rQNMMjOiNXzUaKS2G8RCShMhudAvaYKXgUv0rvM1O2htB9SVXCctAeiufvuikcxMbtEiW1PBQI3I0uFcLMXdPJWfj8su0hnCSOI50t-GHqY4FWbGesFKieUY8h-ZwsmokHes0H6Ex8JDAvn970U3KRFwxVEORQQMNr-Seslkvl72OuyvX4ZW4dUepK3MUv01QUdiJ_aCAFu0QlYnPC4oBnbnJsK5wWUgR0OjwCA"
                  />
                  <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">VOID CORE AVATAR</span>
                  <span className="font-mono text-xs text-on-surface-variant font-bold mt-1">2500 CR</span>
                </div>
              </div>
            </div>

            <button 
              id="goto-shop-btn"
              onClick={() => onSelectPage('play-menu')}
              className="mt-8 w-full py-3 bg-primary text-on-primary hover:bg-[#74f5ff] font-mono text-xs font-bold tracking-[0.2em] shadow-[0_0_15px_rgba(0,242,255,0.25)] hover:scale-[1.01] transition-transform uppercase rounded"
            >
              GO TO WORKSHOP
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
