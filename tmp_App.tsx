import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=de99ccdb"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=de99ccdb"; const useState = __vite__cjsImport1_react["useState"];
import { motion, AnimatePresence } from "/node_modules/.vite/deps/motion_react.js?v=8a2f54cc";
import { Volume2, VolumeX, Share2, Command } from "/node_modules/.vite/deps/lucide-react.js?v=b030f5e9";
import Particles from "/src/components/Particles.tsx";
import HomeView from "/src/components/HomeView.tsx";
import GameModeSelectorView from "/src/components/GameModeSelectorView.tsx";
import BoardHUD from "/src/components/BoardHUD.tsx";
const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBHM8Y5UNAdVqBvdQIFSEEg2onSwepqLTFLU1N1WOG6M8U6k8enTNjqqocUPmdF2WuXgwbt2fCr_Dv74XjWMcq2t8zXpnaa1EtbqOs7YV970zFcF5S7rJR80Vht4V0UXV94Im2U93B8H3OCBxMIw4Qzbh5E4vAvm9XakJS7A8y5V6-OJyOWjphYvx0n8-0OgEiVKbETwHBSF28aVAsWQBZAto9J9yzrtoTaF6TzBsdBevfOnhdj-c2FRs7oamdSc8prUClk8riUBxY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuACU5pKM_viRUu-bSZUWCzI1mIVqgLOf1x3LfozBgwljiXD5L1xF8L1Q_UZCAxn8ULBzCUJlLbTdCunIRXgW7nxae2YHHrdtwFJO52obwA7cjbT1dz_OuSIjVf-h7IVYXWaaAzT1ZzRtbr6zPrPZz-e6YhXBGZikfhmjeKGOnbpwW6OuKyGePHBxvuHkYi1zu-8gmp7LP_CH7sNF-Tv7zZdaFQSqLIFCearKC4KmEsLKfOv23VOJmqUO88xRaZ_sqwBwzLvDb8c5jY",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyuc38B-TTDy9gVXjymqW7XCfYAQOIGW3T-F_OS4qIXihG75CPT9KRk5L4XXDQZ6dZ4P2EUSVlWGMPQoV3lph_rEHh7N3bx8ENuTPioNoDIMgYq5LU6BD0JA2vkIWUXk-MNpAg7cd46YiCR8BUvm80ZtjXuxMKhRv7-6uFaPfbhZTysklx3egqp3xFyx3zIy1OvB37HxmxtEyL4NUowytP-tuWxs_t61knJcK_Ij-KJwgwutwHpvnv4muHXGE0nwhoayXcsLRngAQ"
];
const PILOT_NAMES = ["CYBER_WOLF", "GHOST_SHELL", "NEURAL_LINK", "QUANTUM_REAPER", "HYDRA_OPERATIVE", "MATRIX_SURGE", "SOLAR_SPECTRE"];
export default function App() {
  _s();
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMode, setSelectedMode] = useState("training");
  const [credits, setCredits] = useState(12450);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);
  const [myId] = useState(() => "P-" + Math.random().toString(36).substr(2, 6));
  const [myName] = useState(() => {
    const nameStr = PILOT_NAMES[Math.floor(Math.random() * PILOT_NAMES.length)];
    return `${nameStr}_${Math.floor(Math.random() * 900 + 100)}`;
  });
  const [myAvatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  const [matchId, setMatchId] = useState(null);
  const [playerIndex, setPlayerIndex] = useState(null);
  const handleUpdateCredits = (amount) => {
    setCredits((prev) => prev + amount);
  };
  const triggerShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareNotification(true);
    setTimeout(() => {
      setShowShareNotification(false);
    }, 2500);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-primary selection:text-black", children: [
    /* @__PURE__ */ jsxDEV(Particles, {}, void 0, false, {
      fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
      lineNumber: 52,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("header", { className: "sticky top-0 w-full bg-[#050505]/75 backdrop-blur-md border-b border-white/5 z-50", children: /* @__PURE__ */ jsxDEV("div", { className: "max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV(
        "div",
        {
          onClick: () => setCurrentPage("home"),
          className: "flex items-center gap-2 cursor-pointer group",
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors", children: /* @__PURE__ */ jsxDEV(Command, { className: "w-4 h-4 text-primary group-hover:rotate-45 transition-transform" }, void 0, false, {
              fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
              lineNumber: 64,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
              lineNumber: 63,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsxDEV("span", { className: "font-sora font-extrabold text-[#00f2ff] text-base tracking-widest", children: "STRAT9" }, void 0, false, {
                fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
                lineNumber: 67,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-[8px] text-on-surface-variant/40 tracking-[0.2em] font-bold uppercase leading-none", children: "Tactical OS" }, void 0, false, {
                fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
                lineNumber: 70,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
              lineNumber: 66,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
          lineNumber: 59,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("nav", { className: "flex items-center gap-1.5 md:gap-4", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "nav-link-deck",
            onClick: () => setCurrentPage("home"),
            className: `px-3 py-1.5 font-mono text-[10px] md:text-xs font-extrabold uppercase tracking-widest transition-all rounded
                ${currentPage === "home" ? "bg-primary-container/[0.08] text-[#00f2ff] border-b-2 border-b-[#00f2ff]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}
              `,
            children: "Command Deck"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
            lineNumber: 78,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "nav-link-play",
            onClick: () => setCurrentPage("play-menu"),
            className: `px-3 py-1.5 font-mono text-[10px] md:text-xs font-extrabold uppercase tracking-widest transition-all rounded
                ${currentPage === "play-menu" ? "bg-primary-container/[0.08] text-[#00f2ff] border-b-2 border-b-[#00f2ff]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}
              `,
            children: "Play Lobby"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
            lineNumber: 90,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            id: "nav-link-hud",
            onClick: () => setCurrentPage("hud"),
            className: `px-3 py-1.5 font-mono text-[10px] md:text-xs font-extrabold uppercase tracking-widest transition-all rounded
                ${currentPage === "hud" ? "bg-primary-container/[0.08] text-[#00f2ff] border-b-2 border-b-[#00f2ff]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}
              `,
            children: "Tactical HUD"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
            lineNumber: 102,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
        lineNumber: 77,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3.5 md:gap-5", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: () => setIsAudioMuted(!isAudioMuted),
            className: "p-1.5 bg-[#131313] hover:bg-[#201f1f] rounded border border-white/5 transition-colors group text-on-surface-variant hover:text-white",
            children: isAudioMuted ? /* @__PURE__ */ jsxDEV(VolumeX, { className: "w-4 h-4" }, void 0, false, {
              fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
              lineNumber: 124,
              columnNumber: 31
            }, this) : /* @__PURE__ */ jsxDEV(Volume2, { className: "w-4 h-4" }, void 0, false, {
              fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
              lineNumber: 124,
              columnNumber: 65
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
            lineNumber: 120,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: triggerShareLink,
            className: "p-1.5 bg-[#131313] hover:bg-[#201f1f] rounded border border-white/5 transition-colors group text-on-surface-variant hover:text-white relative",
            children: [
              /* @__PURE__ */ jsxDEV(Share2, { className: "w-4 h-4" }, void 0, false, {
                fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
                lineNumber: 132,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV(AnimatePresence, { children: showShareNotification && /* @__PURE__ */ jsxDEV(
                motion.div,
                {
                  initial: { opacity: 0, y: 10, scale: 0.9 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: 10, scale: 0.9 },
                  className: "absolute right-0 top-10 w-44 bg-[#0e0e0e] border border-primary/20 text-primary-container font-mono text-[9px] uppercase font-bold p-2 text-center rounded shadow-xl pointer-events-none",
                  children: "LINK SECURED TO CLIPBOARD"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
                  lineNumber: 135,
                  columnNumber: 17
                },
                this
              ) }, void 0, false, {
                fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
                lineNumber: 133,
                columnNumber: 15
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
            lineNumber: 128,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: "h-6 w-[1.5px] bg-white/10 hidden sm:block" }, void 0, false, {
          fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
          lineNumber: 147,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-3 bg-[#131313]/90 border border-white/5 rounded pl-3 pr-2.5 py-1 z-30 select-none", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "text-right hidden sm:block leading-none", children: [
            /* @__PURE__ */ jsxDEV("span", { className: "font-mono text-[9px] text-[#00f2ff] font-extrabold uppercase tracking-widest block mb-0.5", children: "SECURE USER" }, void 0, false, {
              fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
              lineNumber: 152,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "font-sora text-[11px] font-bold text-white block", children: myName }, void 0, false, {
              fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
              lineNumber: 153,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
            lineNumber: 151,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-8 h-8 rounded-full border border-primary/30 p-0.5 overflow-hidden bg-primary/15 relative", children: /* @__PURE__ */ jsxDEV(
            "img",
            {
              alt: "My User profile",
              referrerPolicy: "no-referrer",
              className: "w-full h-full object-cover rounded-full",
              src: myAvatar
            },
            void 0,
            false,
            {
              fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
              lineNumber: 157,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
            lineNumber: 156,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
          lineNumber: 150,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
      lineNumber: 56,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
      lineNumber: 55,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "relative w-full", children: [
      currentPage === "home" && /* @__PURE__ */ jsxDEV(
        HomeView,
        {
          onSelectPage: setCurrentPage,
          onSelectMode: setSelectedMode,
          credits
        },
        void 0,
        false,
        {
          fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
          lineNumber: 174,
          columnNumber: 9
        },
        this
      ),
      currentPage === "play-menu" && /* @__PURE__ */ jsxDEV(
        GameModeSelectorView,
        {
          onSelectPage: setCurrentPage,
          selectedMode,
          onSelectMode: setSelectedMode,
          credits,
          myId,
          myName,
          myAvatar,
          setMatchId,
          setPlayerIndex
        },
        void 0,
        false,
        {
          fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
          lineNumber: 182,
          columnNumber: 9
        },
        this
      ),
      currentPage === "hud" && /* @__PURE__ */ jsxDEV(
        BoardHUD,
        {
          onBackToMenu: () => setCurrentPage("play-menu"),
          gameMode: selectedMode,
          onUpdateCredits: handleUpdateCredits,
          myId,
          myName,
          myAvatar,
          matchId,
          playerIndex
        },
        void 0,
        false,
        {
          fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
          lineNumber: 196,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
      lineNumber: 172,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx",
    lineNumber: 50,
    columnNumber: 5
  }, this);
}
_s(App, "4BQ4Q/EtS8kTDyskKZVfb+rmee8=");
_c = App;
var _c;
$RefreshReg$(_c, "App");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/Ronit/OneDrive/Desktop/Game/src/App.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QUEsVUFDQTtBQUFBLFVBQ0E7QUFBQTtBQUFBLFFBUkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BUTJCO0FBQUEsU0FoQy9CO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FtQ0E7QUFBQSxPQTdKRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBOEpBO0FBRUo7QUFBQ3pCLEdBaE11QkQsS0FBRztBQUFBLEtBQUhBO0FBQUcsSUFBQXdDO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbInVzZVN0YXRlIiwibW90aW9uIiwiQW5pbWF0ZVByZXNlbmNlIiwiVm9sdW1lMiIsIlZvbHVtZVgiLCJTaGFyZTIiLCJDb21tYW5kIiwiUGFydGljbGVzIiwiSG9tZVZpZXciLCJHYW1lTW9kZVNlbGVjdG9yVmlldyIsIkJvYXJkSFVEIiwiQVZBVEFSUyIsIlBJTE9UX05BTUVTIiwiQXBwIiwiX3MiLCJjdXJyZW50UGFnZSIsInNldEN1cnJlbnRQYWdlIiwic2VsZWN0ZWRNb2RlIiwic2V0U2VsZWN0ZWRNb2RlIiwiY3JlZGl0cyIsInNldENyZWRpdHMiLCJpc0F1ZGlvTXV0ZWQiLCJzZXRJc0F1ZGlvTXV0ZWQiLCJzaG93U2hhcmVOb3RpZmljYXRpb24iLCJzZXRTaG93U2hhcmVOb3RpZmljYXRpb24iLCJteUlkIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwic3Vic3RyIiwibXlOYW1lIiwibmFtZVN0ciIsImZsb29yIiwibGVuZ3RoIiwibXlBdmF0YXIiLCJtYXRjaElkIiwic2V0TWF0Y2hJZCIsInBsYXllckluZGV4Iiwic2V0UGxheWVySW5kZXgiLCJoYW5kbGVVcGRhdGVDcmVkaXRzIiwiYW1vdW50IiwicHJldiIsInRyaWdnZXJTaGFyZUxpbmsiLCJuYXZpZ2F0b3IiLCJjbGlwYm9hcmQiLCJ3cml0ZVRleHQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJzZXRUaW1lb3V0Iiwib3BhY2l0eSIsInkiLCJzY2FsZSIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBtb3Rpb24sIEFuaW1hdGVQcmVzZW5jZSB9IGZyb20gJ21vdGlvbi9yZWFjdCc7XG5pbXBvcnQgeyBWb2x1bWUyLCBWb2x1bWVYLCBTaGFyZTIsIENvbXBhc3MsIFRyb3BoeSwgQ29tbWFuZCwgSGFyZERyaXZlLCBHYW1lcGFkMiwgTGF5ZXJzIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCBQYXJ0aWNsZXMgZnJvbSAnLi9jb21wb25lbnRzL1BhcnRpY2xlcyc7XG5pbXBvcnQgSG9tZVZpZXcgZnJvbSAnLi9jb21wb25lbnRzL0hvbWVWaWV3JztcbmltcG9ydCBHYW1lTW9kZVNlbGVjdG9yVmlldyBmcm9tICcuL2NvbXBvbmVudHMvR2FtZU1vZGVTZWxlY3RvclZpZXcnO1xuaW1wb3J0IEJvYXJkSFVEIGZyb20gJy4vY29tcG9uZW50cy9Cb2FyZEhVRCc7XG5pbXBvcnQgeyBHYW1lTW9kZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBBVkFUQVJTID0gW1xuICBcImh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9haWRhLXB1YmxpYy9BQjZBWHVCSE04WTVVTkFkVnFCdmRRSUZTRUVnMm9uU3dlcHFMVEZMVTFOMVdPRzZNOFU2azhlblROanFxb2NVUG1kRjJXdVhnd2J0MmZDcl9Edjc0WGpXTWNxMnQ4elhwbmFhMUV0YnFPczdZVjk3MHpGY0Y1UzdySlI4MFZodDRWMFVYVjk0SW0yVTkzQjhIM09DQnhNSXc0UXpiaDVFNHZBdm05WGFrSlM3QTh5NVY2LU9KeU9XanBoWXZ4MG44LTBPZ0VpVktiRVR3SEJTRjI4YVZBc1dRQlpBdG85Sjl5enJ0b1RhRjZUekJzZEJldmZPbmhkai1jMkZSczdvYW1kU2M4cHJVQ2xrOHJpVUJ4WVwiLFxuICBcImh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9haWRhLXB1YmxpYy9BQjZBWHVBQ1U1cEtNX3ZpUlV1LWJTWlVXQ3pJMW1JVnFnTE9mMXgzTGZvekJnd2xqaVhENUwxeEY4TDFRX1VaQ0F4bjhVTEJ6Q1VKbExiVGRDdW5JUlhnVzdueGFlMllISHJkdHdGSk81Mm9id0E3Y2piVDFkel9PdVNJalZmLWg3SVZZWFdhYUF6VDFaelJ0YnI2elByUFp6LWU2WWhYQkdaaWtmaG1qZUtHT25icHdXNk91S3lHZVBIQnh2dUhrWWkxenUtOGdtcDdMUF9DSDdzTkYtVHY3elpkYUZRU3FMSUZDZWFyS0M0S21Fc0xLZk92MjNWT0ptcVVPODh4UmFaX3Nxd0J3ekx2RGI4YzVqWVwiLFxuICBcImh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9haWRhLXB1YmxpYy9BQjZBWHVBeXVjMzhCLVRURHk5Z1ZYanltcVc3WENmWUFRT0lHVzNULUZfT1M0cUlYaWhHNzVDUFQ5S1JrNUw0WFhEUVo2ZFo0UDJFVVNWbFdHTVBRb1YzbHBoX3JFSGg3TjNieDhFTnVUUGlvTm9ESU1nWXE1TFU2QkQwSkEydmtJV1VYay1NTnBBZzdjZDQ2WWlDUjhCVXZtODBadGpYdXhNS2hSdjctNnVGYVBmYmhaVHlza2x4M2VncXAzeEZ5eDN6SXkxT3ZCMzdIeG14dEV5TDROVW93eXRQLXR1V3hzX3Q2MWtuSmNLX0lqLUtKd2d3dXR3SHB2bnY0bXVIWEdFMG53aG9heVhjc0xSbmdBUVwiXG5dO1xuXG5jb25zdCBQSUxPVF9OQU1FUyA9IFtcIkNZQkVSX1dPTEZcIiwgXCJHSE9TVF9TSEVMTFwiLCBcIk5FVVJBTF9MSU5LXCIsIFwiUVVBTlRVTV9SRUFQRVJcIiwgXCJIWURSQV9PUEVSQVRJVkVcIiwgXCJNQVRSSVhfU1VSR0VcIiwgXCJTT0xBUl9TUEVDVFJFXCJdO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoKSB7XG4gIGNvbnN0IFtjdXJyZW50UGFnZSwgc2V0Q3VycmVudFBhZ2VdID0gdXNlU3RhdGU8c3RyaW5nPignaG9tZScpOyAvLyAnaG9tZScsICdwbGF5LW1lbnUnLCAnaHVkJ1xuICBjb25zdCBbc2VsZWN0ZWRNb2RlLCBzZXRTZWxlY3RlZE1vZGVdID0gdXNlU3RhdGU8R2FtZU1vZGU+KCd0cmFpbmluZycpO1xuICBjb25zdCBbY3JlZGl0cywgc2V0Q3JlZGl0c10gPSB1c2VTdGF0ZTxudW1iZXI+KDEyNDUwKTtcbiAgY29uc3QgW2lzQXVkaW9NdXRlZCwgc2V0SXNBdWRpb011dGVkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgY29uc3QgW3Nob3dTaGFyZU5vdGlmaWNhdGlvbiwgc2V0U2hvd1NoYXJlTm90aWZpY2F0aW9uXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcblxuICAvLyBNYXRjaG1ha2luZyB1bmlxdWUgaWRlbnRpdHkgcHJvcGVydGllcyBwZXIgdGFiXG4gIGNvbnN0IFtteUlkXSA9IHVzZVN0YXRlKCgpID0+ICdQLScgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgNikpO1xuICBjb25zdCBbbXlOYW1lXSA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICBjb25zdCBuYW1lU3RyID0gUElMT1RfTkFNRVNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogUElMT1RfTkFNRVMubGVuZ3RoKV07XG4gICAgcmV0dXJuIGAke25hbWVTdHJ9XyR7TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogOTAwICsgMTAwKX1gO1xuICB9KTtcbiAgY29uc3QgW215QXZhdGFyXSA9IHVzZVN0YXRlKCgpID0+IEFWQVRBUlNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogQVZBVEFSUy5sZW5ndGgpXSk7XG5cbiAgLy8gTGl2ZSBtYXRjaCBzZXNzaW9uIHN0YXRlc1xuICBjb25zdCBbbWF0Y2hJZCwgc2V0TWF0Y2hJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3BsYXllckluZGV4LCBzZXRQbGF5ZXJJbmRleF0gPSB1c2VTdGF0ZTxudW1iZXIgfCBudWxsPihudWxsKTtcblxuICBjb25zdCBoYW5kbGVVcGRhdGVDcmVkaXRzID0gKGFtb3VudDogbnVtYmVyKSA9PiB7XG4gICAgc2V0Q3JlZGl0cygocHJldikgPT4gcHJldiArIGFtb3VudCk7XG4gIH07XG5cbiAgY29uc3QgdHJpZ2dlclNoYXJlTGluayA9ICgpID0+IHtcbiAgICBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgc2V0U2hvd1NoYXJlTm90aWZpY2F0aW9uKHRydWUpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U2hvd1NoYXJlTm90aWZpY2F0aW9uKGZhbHNlKTtcbiAgICB9LCAyNTAwKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLVsjMDUwNTA1XSB0ZXh0LXdoaXRlIG92ZXJmbG93LXgtaGlkZGVuIHNlbGVjdGlvbjpiZy1wcmltYXJ5IHNlbGVjdGlvbjp0ZXh0LWJsYWNrXCI+XG4gICAgICB7LyogRHluYW1pYyBiYWNrZHJvcCBwYXJ0aWNsZXMgbWF0cml4ICovfVxuICAgICAgPFBhcnRpY2xlcyAvPlxuXG4gICAgICB7LyogU1RJQ0tZIFRPUCBOQVZJR0FUSU9OIEJBUiBIRUFERVIgKi99XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInN0aWNreSB0b3AtMCB3LWZ1bGwgYmctWyMwNTA1MDVdLzc1IGJhY2tkcm9wLWJsdXItbWQgYm9yZGVyLWIgYm9yZGVyLXdoaXRlLzUgei01MFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1heC13LVsxNDAwcHhdIG14LWF1dG8gcHgtNCBtZDpweC04IGgtMTYgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XG4gICAgICAgICAgXG4gICAgICAgICAgey8qIExvZ28gZWxlbWVudCAqL31cbiAgICAgICAgICA8ZGl2IFxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q3VycmVudFBhZ2UoJ2hvbWUnKX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIGN1cnNvci1wb2ludGVyIGdyb3VwXCJcbiAgICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctOCBoLTggcm91bmRlZCBiZy1wcmltYXJ5LzEwIGJvcmRlciBib3JkZXItcHJpbWFyeS8zMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBncm91cC1ob3Zlcjpib3JkZXItcHJpbWFyeSB0cmFuc2l0aW9uLWNvbG9yc1wiPlxuICAgICAgICAgICAgICA8Q29tbWFuZCBjbGFzc05hbWU9XCJ3LTQgaC00IHRleHQtcHJpbWFyeSBncm91cC1ob3Zlcjpyb3RhdGUtNDUgdHJhbnNpdGlvbi10cmFuc2Zvcm1cIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2xcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1zb3JhIGZvbnQtZXh0cmFib2xkIHRleHQtWyMwMGYyZmZdIHRleHQtYmFzZSB0cmFja2luZy13aWRlc3RcIj5cbiAgICAgICAgICAgICAgICBTVFJBVDlcbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1bOHB4XSB0ZXh0LW9uLXN1cmZhY2UtdmFyaWFudC80MCB0cmFja2luZy1bMC4yZW1dIGZvbnQtYm9sZCB1cHBlcmNhc2UgbGVhZGluZy1ub25lXCI+XG4gICAgICAgICAgICAgICAgVGFjdGljYWwgT1NcbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogTmF2IExpbmtzIENlbnRlciAqL31cbiAgICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0xLjUgbWQ6Z2FwLTRcIj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgaWQ9XCJuYXYtbGluay1kZWNrXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q3VycmVudFBhZ2UoJ2hvbWUnKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xLjUgZm9udC1tb25vIHRleHQtWzEwcHhdIG1kOnRleHQteHMgZm9udC1leHRyYWJvbGQgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbCByb3VuZGVkXG4gICAgICAgICAgICAgICAgJHtjdXJyZW50UGFnZSA9PT0gJ2hvbWUnIFxuICAgICAgICAgICAgICAgICAgPyAnYmctcHJpbWFyeS1jb250YWluZXIvWzAuMDhdIHRleHQtWyMwMGYyZmZdIGJvcmRlci1iLTIgYm9yZGVyLWItWyMwMGYyZmZdJ1xuICAgICAgICAgICAgICAgICAgOiAndGV4dC1vbi1zdXJmYWNlLXZhcmlhbnQgaG92ZXI6dGV4dC13aGl0ZSBob3ZlcjpiZy13aGl0ZS81J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYH1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgQ29tbWFuZCBEZWNrXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgaWQ9XCJuYXYtbGluay1wbGF5XCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q3VycmVudFBhZ2UoJ3BsYXktbWVudScpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC0zIHB5LTEuNSBmb250LW1vbm8gdGV4dC1bMTBweF0gbWQ6dGV4dC14cyBmb250LWV4dHJhYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tYWxsIHJvdW5kZWRcbiAgICAgICAgICAgICAgICAke2N1cnJlbnRQYWdlID09PSAncGxheS1tZW51JyBcbiAgICAgICAgICAgICAgICAgID8gJ2JnLXByaW1hcnktY29udGFpbmVyL1swLjA4XSB0ZXh0LVsjMDBmMmZmXSBib3JkZXItYi0yIGJvcmRlci1iLVsjMDBmMmZmXSdcbiAgICAgICAgICAgICAgICAgIDogJ3RleHQtb24tc3VyZmFjZS12YXJpYW50IGhvdmVyOnRleHQtd2hpdGUgaG92ZXI6Ymctd2hpdGUvNSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGB9XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFBsYXkgTG9iYnlcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBpZD1cIm5hdi1saW5rLWh1ZFwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEN1cnJlbnRQYWdlKCdodWQnKX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcHgtMyBweS0xLjUgZm9udC1tb25vIHRleHQtWzEwcHhdIG1kOnRleHQteHMgZm9udC1leHRyYWJvbGQgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbCByb3VuZGVkXG4gICAgICAgICAgICAgICAgJHtjdXJyZW50UGFnZSA9PT0gJ2h1ZCcgXG4gICAgICAgICAgICAgICAgICA/ICdiZy1wcmltYXJ5LWNvbnRhaW5lci9bMC4wOF0gdGV4dC1bIzAwZjJmZl0gYm9yZGVyLWItMiBib3JkZXItYi1bIzAwZjJmZl0nXG4gICAgICAgICAgICAgICAgICA6ICd0ZXh0LW9uLXN1cmZhY2UtdmFyaWFudCBob3Zlcjp0ZXh0LXdoaXRlIGhvdmVyOmJnLXdoaXRlLzUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBgfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBUYWN0aWNhbCBIVURcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvbmF2PlxuXG4gICAgICAgICAgey8qIFF1aWNrIHN0YXR1cyBjb250cm9scyBvbiBuYXZpZ2F0aW9uIHJpZ2h0IHNpZGUgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMy41IG1kOmdhcC01XCI+XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHsvKiBBdWRpbyBUb2dnbGUgYnV0dG9uICovfVxuICAgICAgICAgICAgPGJ1dHRvbiBcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNBdWRpb011dGVkKCFpc0F1ZGlvTXV0ZWQpfVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJwLTEuNSBiZy1bIzEzMTMxM10gaG92ZXI6YmctWyMyMDFmMWZdIHJvdW5kZWQgYm9yZGVyIGJvcmRlci13aGl0ZS81IHRyYW5zaXRpb24tY29sb3JzIGdyb3VwIHRleHQtb24tc3VyZmFjZS12YXJpYW50IGhvdmVyOnRleHQtd2hpdGVcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7aXNBdWRpb011dGVkID8gPFZvbHVtZVggY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+IDogPFZvbHVtZTIgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+fVxuICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgIHsvKiBTaGFyZSBsaW5rIGJ1dHRvbiAqL31cbiAgICAgICAgICAgIDxidXR0b24gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RyaWdnZXJTaGFyZUxpbmt9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtMS41IGJnLVsjMTMxMzEzXSBob3ZlcjpiZy1bIzIwMWYxZl0gcm91bmRlZCBib3JkZXIgYm9yZGVyLXdoaXRlLzUgdHJhbnNpdGlvbi1jb2xvcnMgZ3JvdXAgdGV4dC1vbi1zdXJmYWNlLXZhcmlhbnQgaG92ZXI6dGV4dC13aGl0ZSByZWxhdGl2ZVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxTaGFyZTIgY2xhc3NOYW1lPVwidy00IGgtNFwiIC8+XG4gICAgICAgICAgICAgIDxBbmltYXRlUHJlc2VuY2U+XG4gICAgICAgICAgICAgICAge3Nob3dTaGFyZU5vdGlmaWNhdGlvbiAmJiAoXG4gICAgICAgICAgICAgICAgICA8bW90aW9uLmRpdiBcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCB5OiAxMCwgc2NhbGU6IDAuOSB9fVxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEsIHk6IDAsIHNjYWxlOiAxIH19XG4gICAgICAgICAgICAgICAgICAgIGV4aXQ9e3sgb3BhY2l0eTogMCwgeTogMTAsIHNjYWxlOiAwLjkgfX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgcmlnaHQtMCB0b3AtMTAgdy00NCBiZy1bIzBlMGUwZV0gYm9yZGVyIGJvcmRlci1wcmltYXJ5LzIwIHRleHQtcHJpbWFyeS1jb250YWluZXIgZm9udC1tb25vIHRleHQtWzlweF0gdXBwZXJjYXNlIGZvbnQtYm9sZCBwLTIgdGV4dC1jZW50ZXIgcm91bmRlZCBzaGFkb3cteGwgcG9pbnRlci1ldmVudHMtbm9uZVwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIExJTksgU0VDVVJFRCBUTyBDTElQQk9BUkRcbiAgICAgICAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtNiB3LVsxLjVweF0gYmctd2hpdGUvMTAgaGlkZGVuIHNtOmJsb2NrXCIgLz5cblxuICAgICAgICAgICAgey8qIEFjY291bnQgUHJvZmlsZSBDYXJkIGluc2lkZSBsYXVuY2hlciBoZWFkZXIgKi99XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0zIGJnLVsjMTMxMzEzXS85MCBib3JkZXIgYm9yZGVyLXdoaXRlLzUgcm91bmRlZCBwbC0zIHByLTIuNSBweS0xIHotMzAgc2VsZWN0LW5vbmVcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0IGhpZGRlbiBzbTpibG9jayBsZWFkaW5nLW5vbmVcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmb250LW1vbm8gdGV4dC1bOXB4XSB0ZXh0LVsjMDBmMmZmXSBmb250LWV4dHJhYm9sZCB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IGJsb2NrIG1iLTAuNVwiPlNFQ1VSRSBVU0VSPC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvbnQtc29yYSB0ZXh0LVsxMXB4XSBmb250LWJvbGQgdGV4dC13aGl0ZSBibG9ja1wiPntteU5hbWV9PC9zcGFuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy04IGgtOCByb3VuZGVkLWZ1bGwgYm9yZGVyIGJvcmRlci1wcmltYXJ5LzMwIHAtMC41IG92ZXJmbG93LWhpZGRlbiBiZy1wcmltYXJ5LzE1IHJlbGF0aXZlXCI+XG4gICAgICAgICAgICAgICAgPGltZyBcbiAgICAgICAgICAgICAgICAgIGFsdD1cIk15IFVzZXIgcHJvZmlsZVwiIFxuICAgICAgICAgICAgICAgICAgcmVmZXJyZXJQb2xpY3k9XCJuby1yZWZlcnJlclwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlciByb3VuZGVkLWZ1bGxcIlxuICAgICAgICAgICAgICAgICAgc3JjPXtteUF2YXRhcn0gXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG5cbiAgICAgIHsvKiBST1VUSU5HIENPTlRBSU5FUiBGT1IgRUFDSCBPRiBUSEUgU0VBTUxFU1MgU0NSRUVOIFBSRVNFVFMgKi99XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIHctZnVsbFwiPlxuICAgICAgICB7Y3VycmVudFBhZ2UgPT09ICdob21lJyAmJiAoXG4gICAgICAgICAgPEhvbWVWaWV3IFxuICAgICAgICAgICAgb25TZWxlY3RQYWdlPXtzZXRDdXJyZW50UGFnZX0gXG4gICAgICAgICAgICBvblNlbGVjdE1vZGU9e3NldFNlbGVjdGVkTW9kZX0gXG4gICAgICAgICAgICBjcmVkaXRzPXtjcmVkaXRzfSBcbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHtjdXJyZW50UGFnZSA9PT0gJ3BsYXktbWVudScgJiYgKFxuICAgICAgICAgIDxHYW1lTW9kZVNlbGVjdG9yVmlldyBcbiAgICAgICAgICAgIG9uU2VsZWN0UGFnZT17c2V0Q3VycmVudFBhZ2V9IFxuICAgICAgICAgICAgc2VsZWN0ZWRNb2RlPXtzZWxlY3RlZE1vZGV9IFxuICAgICAgICAgICAgb25TZWxlY3RNb2RlPXtzZXRTZWxlY3RlZE1vZGV9IFxuICAgICAgICAgICAgY3JlZGl0cz17Y3JlZGl0c30gXG4gICAgICAgICAgICBteUlkPXtteUlkfVxuICAgICAgICAgICAgbXlOYW1lPXtteU5hbWV9XG4gICAgICAgICAgICBteUF2YXRhcj17bXlBdmF0YXJ9XG4gICAgICAgICAgICBzZXRNYXRjaElkPXtzZXRNYXRjaElkfVxuICAgICAgICAgICAgc2V0UGxheWVySW5kZXg9e3NldFBsYXllckluZGV4fVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAge2N1cnJlbnRQYWdlID09PSAnaHVkJyAmJiAoXG4gICAgICAgICAgPEJvYXJkSFVEIFxuICAgICAgICAgICAgb25CYWNrVG9NZW51PXsoKSA9PiBzZXRDdXJyZW50UGFnZSgncGxheS1tZW51Jyl9IFxuICAgICAgICAgICAgZ2FtZU1vZGU9e3NlbGVjdGVkTW9kZX0gXG4gICAgICAgICAgICBvblVwZGF0ZUNyZWRpdHM9e2hhbmRsZVVwZGF0ZUNyZWRpdHN9IFxuICAgICAgICAgICAgbXlJZD17bXlJZH1cbiAgICAgICAgICAgIG15TmFtZT17bXlOYW1lfVxuICAgICAgICAgICAgbXlBdmF0YXI9e215QXZhdGFyfVxuICAgICAgICAgICAgbWF0Y2hJZD17bWF0Y2hJZH1cbiAgICAgICAgICAgIHBsYXllckluZGV4PXtwbGF5ZXJJbmRleH1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwiZmlsZSI6IkM6L1VzZXJzL1Jvbml0L09uZURyaXZlL0Rlc2t0b3AvR2FtZS9zcmMvQXBwLnRzeCJ9
