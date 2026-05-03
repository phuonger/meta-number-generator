/**
 * META NUMBER GENERATOR — Home Page
 * Design: Official Meta Presentation Style
 * Features:
 * - Dramatic darkening/spotlight effect during generation
 * - Sound effects (click to generate, scramble ticking, reveal fanfare)
 * - Extended animation duration (default 5s, configurable)
 * - Settings panel (duration, manual stop mode, sound toggle)
 * - Reset button after number is picked
 * - Number scramble animation with dramatic finish
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Audio Context & Sound Generation ── */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  setEnabled(val: boolean) { this.enabled = val; }

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  playClick() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  }

  playTick() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(600 + Math.random() * 400, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  }

  playReveal() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.3);
    });
  }

  playDrumroll() {
    if (!this.enabled) return;
    const ctx = this.getCtx();
    const duration = 0.15;
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150 + i * 20, ctx.currentTime + i * duration * 0.5);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * duration * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * duration * 0.5 + duration);
      osc.start(ctx.currentTime + i * duration * 0.5);
      osc.stop(ctx.currentTime + i * duration * 0.5 + duration);
    }
  }
}

const soundEngine = new SoundEngine();

/* ── Idle animated placeholder ── */
function IdlePlaceholder() {
  const [digits, setDigits] = useState("???");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const chars = "0123456789";
    timer.current = setInterval(() => {
      const len = 2 + Math.floor(Math.random() * 2);
      let s = "";
      for (let i = 0; i < len; i++) {
        s += chars[Math.floor(Math.random() * 10)];
      }
      setDigits(s);
    }, 120);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  return (
    <motion.div
      className="meta-number text-[7rem] sm:text-[9rem] md:text-[11rem] leading-none tabular-nums select-none"
      style={{ opacity: 0.25, filter: "blur(2px)" }}
      animate={{
        opacity: [0.15, 0.3, 0.15],
        scale: [0.98, 1.02, 0.98],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {digits}
    </motion.div>
  );
}

/* ── Confetti dot ── */
function ConfettiDot({ x, color, delay }: { x: number; color: string; delay: number }) {
  return (
    <div
      className="absolute bottom-0 w-2 h-2 rounded-full pointer-events-none animate-float-up"
      style={{ left: `${x}%`, background: color, animationDelay: `${delay}s`, opacity: 0 }}
    />
  );
}

/* ── Pulse ring ── */
function PulseRing({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && [0, 0.18, 0.36].map((d, i) => (
        <motion.span
          key={`${trigger}-${i}`}
          className="absolute inset-0 rounded-3xl border-2 border-white/50"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.9, delay: d, ease: "easeOut" }}
        />
      ))}
    </AnimatePresence>
  );
}

/* ── Settings icon ── */
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.421 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.421-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.116l.094-.318z"/>
    </svg>
  );
}

/* ── Main component ── */
export default function Home() {
  const [maxNumber, setMaxNumber]   = useState(220);
  const [inputVal,  setInputVal]    = useState("220");
  const [current,   setCurrent]     = useState<number | null>(null);
  const [animKey,   setAnimKey]     = useState(0);
  const [scrambling, setScrambling] = useState(false);
  const [ringTrigger, setRingTrigger] = useState(0);
  const [history,   setHistory]     = useState<number[]>([]);
  const [showRange, setShowRange]   = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inputError, setInputError] = useState("");
  const [busy,      setBusy]        = useState(false);
  const [confetti,  setConfetti]    = useState<{ id: number; x: number; color: string; delay: number }[]>([]);

  // Dramatic effect states
  const [isDramatic, setIsDramatic] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scrambleDisplay, setScrambleDisplay] = useState<string | null>(null);

  // Settings
  const [duration, setDuration] = useState(5); // seconds
  const [manualStop, setManualStop] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [waitingForStop, setWaitingForStop] = useState(false);

  // Refs
  const scrambleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingNumber = useRef<number | null>(null);

  // Sync sound engine
  useEffect(() => { soundEngine.setEnabled(soundEnabled); }, [soundEnabled]);

  /* Confetti colours matching the gradient */
  const confettiColors = ["#fff", "#a8d8ff", "#b8f5e0", "#ffd6b0", "#e8b4ff"];

  const stopAndReveal = useCallback(() => {
    // Clear scramble
    if (scrambleTimer.current) { clearInterval(scrambleTimer.current); scrambleTimer.current = null; }
    if (tickTimer.current) { clearInterval(tickTimer.current); tickTimer.current = null; }

    const num = pendingNumber.current!;
    setScrambleDisplay(String(num));
    setWaitingForStop(false);
    setScrambling(false);

    // Dramatic reveal
    soundEngine.playReveal();
    setIsRevealed(true);
    setCurrent(num);
    setAnimKey(k => k + 1);
    setRingTrigger(t => t + 1);
    setHistory(h => [num, ...h].slice(0, 10));

    // Confetti burst
    const dots = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 0.4,
    }));
    setConfetti(dots);
    setTimeout(() => setConfetti([]), 2000);

    // End dramatic mode after a moment
    setTimeout(() => {
      setBusy(false);
    }, 800);
  }, []);

  const generate = useCallback(() => {
    if (busy) return;
    setBusy(true);
    setIsRevealed(false);

    // Pick the number now
    const num = Math.floor(Math.random() * maxNumber) + 1;
    pendingNumber.current = num;

    // Start dramatic mode
    setIsDramatic(true);
    soundEngine.playClick();
    setTimeout(() => soundEngine.playDrumroll(), 200);

    // Start scramble animation
    setScrambling(true);
    const maxStr = String(maxNumber);
    const digitCount = maxStr.length;

    scrambleTimer.current = setInterval(() => {
      let s = "";
      for (let i = 0; i < digitCount; i++) {
        s += String(Math.floor(Math.random() * 10));
      }
      setScrambleDisplay(s);
    }, 80);

    // Tick sound
    tickTimer.current = setInterval(() => {
      soundEngine.playTick();
    }, 150);

    if (manualStop) {
      // Wait for user to press stop
      setWaitingForStop(true);
    } else {
      // Auto-stop after duration
      setTimeout(() => {
        stopAndReveal();
      }, duration * 1000);
    }
  }, [busy, maxNumber, duration, manualStop, stopAndReveal]);

  const handleStop = useCallback(() => {
    if (waitingForStop) {
      stopAndReveal();
    }
  }, [waitingForStop, stopAndReveal]);

  const handleReset = useCallback(() => {
    setCurrent(null);
    setScrambleDisplay(null);
    setIsDramatic(false);
    setIsRevealed(false);
    setBusy(false);
    setScrambling(false);
    setWaitingForStop(false);
    if (scrambleTimer.current) { clearInterval(scrambleTimer.current); scrambleTimer.current = null; }
    if (tickTimer.current) { clearInterval(tickTimer.current); tickTimer.current = null; }
  }, []);

  /* Space-bar shortcut */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (waitingForStop) {
          handleStop();
        } else if (!busy) {
          generate();
        }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [generate, handleStop, waitingForStop, busy]);

  const handleMax = (val: string) => {
    setInputVal(val);
    const n = parseInt(val, 10);
    if (!val || isNaN(n))    { setInputError("Enter a valid number"); return; }
    if (n < 2)               { setInputError("Minimum is 2");         return; }
    if (n > 1_000_000)       { setInputError("Maximum is 1,000,000"); return; }
    setInputError("");
    setMaxNumber(n);
  };

  const closeAllPanels = () => {
    setShowRange(false);
    setShowHistory(false);
    setShowSettings(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden meta-gradient-bg flex flex-col">

      {/* ── Dramatic overlay ── */}
      <AnimatePresence>
        {isDramatic && (
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Dark vignette */}
            <div className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.85) 100%)",
              }}
            />
            {/* Spotlight glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.08) 0%, transparent 40%)",
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confetti ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {confetti.map(d => <ConfettiDot key={d.id} x={d.x} color={d.color} delay={d.delay} />)}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-40 flex flex-col items-center justify-center flex-1 px-6 py-12 gap-8">

        {/* Title — fades during dramatic mode */}
        <motion.h1
          className="meta-heading text-5xl sm:text-6xl md:text-7xl text-center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: isDramatic ? 0.2 : 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Number Generator
        </motion.h1>

        {/* ── Number card ── */}
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: isDramatic ? 1.05 : 1,
          }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PulseRing trigger={ringTrigger} />
          </div>

          <div className="meta-card p-10 sm:p-14 flex flex-col items-center gap-4 text-center"
            style={{
              boxShadow: isDramatic ? "0 0 80px rgba(255,255,255,0.2), 0 0 160px rgba(0,130,251,0.15)" : "none",
              transition: "box-shadow 0.5s ease",
            }}
          >
            {/* Number display */}
            <AnimatePresence mode="wait">
              {scrambling ? (
                <motion.div
                  key="scramble"
                  className="meta-number number-glow text-[7rem] sm:text-[9rem] md:text-[11rem] leading-none tabular-nums"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {scrambleDisplay ?? "—"}
                </motion.div>
              ) : isRevealed ? (
                <motion.div
                  key={animKey}
                  className="meta-number number-glow text-[7rem] sm:text-[9rem] md:text-[11rem] leading-none tabular-nums"
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                  {String(current)}
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <IdlePlaceholder />
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-white/70 text-base font-medium tracking-wide" style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
              {scrambling
                ? (waitingForStop ? "Press Space or tap Stop to pick!" : "Picking a number…")
                : isRevealed
                  ? `from 1 – ${maxNumber.toLocaleString()}`
                  : "Tap Generate to begin"
              }
            </p>
          </div>
        </motion.div>

        {/* ── Action buttons ── */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Generate / Stop button */}
          {waitingForStop ? (
            <motion.button
              onClick={handleStop}
              className="relative overflow-hidden px-12 py-4 rounded-full text-xl font-bold tracking-wide transition-all duration-200 active:scale-95"
              style={{
                fontFamily: "Helvetica Neue, Arial, sans-serif",
                background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
                color: "white",
                boxShadow: "0 8px 32px rgba(238,90,36,0.4), 0 2px 8px rgba(0,0,0,0.2)",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              STOP
            </motion.button>
          ) : isRevealed ? (
            <motion.button
              onClick={handleReset}
              className="relative overflow-hidden px-12 py-4 rounded-full text-xl font-bold tracking-wide transition-all duration-200 active:scale-95"
              style={{
                fontFamily: "Helvetica Neue, Arial, sans-serif",
                background: "white",
                color: "oklch(0.38 0.18 250)",
                boxShadow: "0 8px 32px oklch(0 0 0 / 0.18), 0 2px 8px oklch(0 0 0 / 0.1)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04, boxShadow: "0 12px 40px oklch(0 0 0 / 0.22)" }}
              whileTap={{ scale: 0.97 }}
            >
              Reset
            </motion.button>
          ) : (
            <motion.button
              onClick={generate}
              disabled={busy}
              className="relative overflow-hidden px-12 py-4 rounded-full text-xl font-bold tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-70"
              style={{
                fontFamily: "Helvetica Neue, Arial, sans-serif",
                background: "white",
                color: "oklch(0.38 0.18 250)",
                boxShadow: "0 8px 32px oklch(0 0 0 / 0.18), 0 2px 8px oklch(0 0 0 / 0.1)",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 12px 40px oklch(0 0 0 / 0.22)" }}
              whileTap={{ scale: 0.97 }}
            >
              Generate
            </motion.button>
          )}
        </motion.div>

        {/* ── Controls row — hidden during dramatic mode ── */}
        <AnimatePresence>
          {!isDramatic && (
            <motion.div
              className="flex items-center gap-3 flex-wrap justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              <button
                onClick={() => { setShowRange(s => !s); setShowHistory(false); setShowSettings(false); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  fontFamily: "Helvetica Neue, Arial, sans-serif",
                  background: showRange ? "white" : "oklch(1 0 0 / 0.22)",
                  color: showRange ? "oklch(0.38 0.18 250)" : "white",
                  border: "1.5px solid oklch(1 0 0 / 0.4)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 4h12v1.5H2V4zm2 3h8v1.5H4V7zm2 3h4v1.5H6V10z"/>
                </svg>
                Range: 1 – {maxNumber.toLocaleString()}
              </button>

              <button
                onClick={() => { setShowHistory(s => !s); setShowRange(false); setShowSettings(false); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  fontFamily: "Helvetica Neue, Arial, sans-serif",
                  background: showHistory ? "white" : "oklch(1 0 0 / 0.22)",
                  color: showHistory ? "oklch(0.38 0.18 250)" : "white",
                  border: "1.5px solid oklch(1 0 0 / 0.4)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 7.44V4.5h-1.5v4.56l3.22 1.86.75-1.3-2.47-1.42z"/>
                </svg>
                History
                {history.length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: "oklch(0.38 0.18 250)", color: "white", fontSize: "10px" }}>
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setShowSettings(s => !s); setShowRange(false); setShowHistory(false); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  fontFamily: "Helvetica Neue, Arial, sans-serif",
                  background: showSettings ? "white" : "oklch(1 0 0 / 0.22)",
                  color: showSettings ? "oklch(0.38 0.18 250)" : "white",
                  border: "1.5px solid oklch(1 0 0 / 0.4)",
                }}
              >
                <SettingsIcon />
                Settings
              </button>

              {history.length > 0 && (
                <button
                  onClick={() => { setHistory([]); setCurrent(null); setIsRevealed(false); }}
                  className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                  style={{
                    fontFamily: "Helvetica Neue, Arial, sans-serif",
                    background: "oklch(1 0 0 / 0.18)",
                    color: "white",
                    border: "1.5px solid oklch(1 0 0 / 0.3)",
                  }}
                  title="Clear all"
                >
                  Clear
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Range panel ── */}
        <AnimatePresence>
          {showRange && !isDramatic && (
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="meta-card p-6">
                <p className="text-white font-bold text-sm tracking-widest uppercase mb-4"
                  style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                  Set Range
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 text-center px-4 py-3 rounded-2xl font-bold text-lg text-white/80"
                    style={{ background: "oklch(1 0 0 / 0.12)", border: "1.5px solid oklch(1 0 0 / 0.2)", fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                    1
                  </div>
                  <span className="text-white/60 font-bold text-lg">→</span>
                  <input
                    type="number"
                    value={inputVal}
                    onChange={e => handleMax(e.target.value)}
                    min={2}
                    max={1000000}
                    className="flex-1 text-center px-4 py-3 rounded-2xl font-bold text-lg text-white outline-none transition-all"
                    style={{
                      fontFamily: "Helvetica Neue, Arial, sans-serif",
                      background: "oklch(1 0 0 / 0.18)",
                      border: inputError
                        ? "1.5px solid oklch(0.65 0.22 25)"
                        : "1.5px solid oklch(1 0 0 / 0.45)",
                    }}
                  />
                </div>

                {inputError && (
                  <p className="text-sm mb-3" style={{ color: "oklch(1 0 0 / 0.85)", fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                    ⚠ {inputError}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {[10, 50, 100, 220, 500, 1000].map(p => (
                    <button
                      key={p}
                      onClick={() => handleMax(String(p))}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150"
                      style={{
                        fontFamily: "Helvetica Neue, Arial, sans-serif",
                        background: maxNumber === p ? "white" : "oklch(1 0 0 / 0.15)",
                        color: maxNumber === p ? "oklch(0.38 0.18 250)" : "white",
                        border: "1.5px solid oklch(1 0 0 / 0.3)",
                      }}
                    >
                      {p.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── History panel ── */}
        <AnimatePresence>
          {showHistory && !isDramatic && (
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="meta-card p-6">
                <p className="text-white font-bold text-sm tracking-widest uppercase mb-4"
                  style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                  Recent Numbers
                </p>
                {history.length === 0 ? (
                  <p className="text-white/60 text-sm text-center py-2"
                    style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                    No numbers yet — hit Generate!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {history.map((n, i) => (
                      <motion.span
                        key={`${n}-${i}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="px-4 py-2 rounded-2xl text-sm font-bold"
                        style={{
                          fontFamily: "Helvetica Neue, Arial, sans-serif",
                          background: i === 0 ? "white" : "oklch(1 0 0 / 0.18)",
                          color: i === 0 ? "oklch(0.38 0.18 250)" : "white",
                          border: "1.5px solid oklch(1 0 0 / 0.3)",
                        }}
                      >
                        {n}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Settings panel ── */}
        <AnimatePresence>
          {showSettings && !isDramatic && (
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="meta-card p-6">
                <p className="text-white font-bold text-sm tracking-widest uppercase mb-5"
                  style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                  Settings
                </p>

                {/* Duration */}
                <div className="mb-5">
                  <label className="text-white/80 text-sm font-semibold block mb-2"
                    style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                    Animation Duration: <span className="text-white font-bold">{duration}s</span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={15}
                    step={1}
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, white ${((duration - 2) / 13) * 100}%, oklch(1 0 0 / 0.2) ${((duration - 2) / 13) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-white/50 text-xs mt-1"
                    style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                    <span>2s</span>
                    <span>15s</span>
                  </div>
                </div>

                {/* Manual stop */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-semibold"
                      style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                      Manual Stop Mode
                    </p>
                    <p className="text-white/50 text-xs mt-0.5"
                      style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                      Click or press Space to pick the number
                    </p>
                  </div>
                  <button
                    onClick={() => setManualStop(s => !s)}
                    className="relative w-12 h-7 rounded-full transition-all duration-200"
                    style={{
                      background: manualStop ? "white" : "oklch(1 0 0 / 0.25)",
                      border: "1.5px solid oklch(1 0 0 / 0.4)",
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
                      style={{
                        left: manualStop ? "calc(100% - 1.4rem)" : "0.15rem",
                        background: manualStop ? "oklch(0.38 0.18 250)" : "white",
                      }}
                    />
                  </button>
                </div>

                {/* Sound */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-semibold"
                      style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                      Sound Effects
                    </p>
                    <p className="text-white/50 text-xs mt-0.5"
                      style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                      Play sounds during generation
                    </p>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(s => !s)}
                    className="relative w-12 h-7 rounded-full transition-all duration-200"
                    style={{
                      background: soundEnabled ? "white" : "oklch(1 0 0 / 0.25)",
                      border: "1.5px solid oklch(1 0 0 / 0.4)",
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
                      style={{
                        left: soundEnabled ? "calc(100% - 1.4rem)" : "0.15rem",
                        background: soundEnabled ? "oklch(0.38 0.18 250)" : "white",
                      }}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint — hidden during dramatic mode */}
        {!isDramatic && !isRevealed && (
          <motion.p
            className="text-white/50 text-sm"
            style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Press <kbd className="px-2 py-0.5 rounded-md text-xs font-semibold"
              style={{ background: "oklch(1 0 0 / 0.2)", color: "white" }}>Space</kbd> to generate
          </motion.p>
        )}
      </div>

      {/* ── Meta wordmark — bottom right ── */}
      <div className="absolute bottom-6 right-8 z-20">
        <svg
          width="90"
          height="24"
          viewBox="0 0 90 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Meta"
        >
          <path
            d="M12 12C12 12 8.5 7 6 7C3.5 7 2 9.2 2 12C2 14.8 3.5 17 6 17C8.5 17 12 12 12 12Z"
            fill="white"
          />
          <path
            d="M12 12C12 12 15.5 7 18 7C20.5 7 22 9.2 22 12C22 14.8 20.5 17 18 17C15.5 17 12 12 12 12Z"
            fill="white"
          />
          <text
            x="28"
            y="17"
            fill="white"
            fontSize="16"
            fontWeight="700"
            fontFamily="Helvetica Neue, Arial, sans-serif"
            letterSpacing="-0.3"
          >
            Meta
          </text>
        </svg>
      </div>
    </div>
  );
}
