/**
 * META NUMBER GENERATOR — Home Page
 * Design: Official Meta Presentation Style
 * - Bright multicolour gradient (blue→teal→green, warm pink/orange top-left)
 * - Large bold white rounded typography (Helvetica Neue / Arial)
 * - Clean white frosted card for the number display
 * - Official Meta ∞ wordmark bottom-right
 * - Number scramble animation on generate
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Scramble hook ── */
const DIGITS = "0123456789";

function useScramble(target: number | null, running: boolean) {
  const [display, setDisplay] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const iter  = useRef(0);

  useEffect(() => {
    if (!running || target === null) return;
    const str = String(target);
    const total = 20;
    iter.current = 0;
    if (timer.current) clearInterval(timer.current);

    timer.current = setInterval(() => {
      iter.current++;
      const pct = iter.current / total;
      if (iter.current >= total) {
        setDisplay(str);
        clearInterval(timer.current!);
        return;
      }
      const revealed = Math.floor(pct * str.length);
      let s = "";
      for (let i = 0; i < str.length; i++) {
        s += i < revealed
          ? str[i]
          : DIGITS[Math.floor(Math.random() * 10)];
      }
      setDisplay(s);
    }, 50);

    return () => { if (timer.current) clearInterval(timer.current); };
  }, [target, running]);

  return display;
}

/* ── Floating confetti dot ── */
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
  const [inputError, setInputError] = useState("");
  const [busy,      setBusy]        = useState(false);
  const [confetti,  setConfetti]    = useState<{ id: number; x: number; color: string; delay: number }[]>([]);

  const display = useScramble(current, scrambling);

  /* Confetti colours matching the gradient */
  const confettiColors = ["#fff", "#a8d8ff", "#b8f5e0", "#ffd6b0", "#e8b4ff"];

  const generate = useCallback(() => {
    if (busy) return;
    setBusy(true);
    const num = Math.floor(Math.random() * maxNumber) + 1;
    setCurrent(num);
    setScrambling(true);
    setAnimKey(k => k + 1);
    setRingTrigger(t => t + 1);
    setHistory(h => [num, ...h].slice(0, 10));

    /* Confetti burst */
    const dots = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      delay: Math.random() * 0.3,
    }));
    setConfetti(dots);
    setTimeout(() => setConfetti([]), 1600);

    setTimeout(() => { setScrambling(false); setBusy(false); }, 1100);
  }, [busy, maxNumber]);

  /* Space-bar shortcut */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code === "Space" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [generate]);

  const handleMax = (val: string) => {
    setInputVal(val);
    const n = parseInt(val, 10);
    if (!val || isNaN(n))    { setInputError("Enter a valid number"); return; }
    if (n < 2)               { setInputError("Minimum is 2");         return; }
    if (n > 1_000_000)       { setInputError("Maximum is 1,000,000"); return; }
    setInputError("");
    setMaxNumber(n);
  };

  return (
    <div className="relative min-h-screen overflow-hidden meta-gradient-bg flex flex-col">

      {/* ── Confetti ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map(d => <ConfettiDot key={d.id} x={d.x} color={d.color} delay={d.delay} />)}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-12 gap-8">

        {/* Title */}
        <motion.h1
          className="meta-heading text-5xl sm:text-6xl md:text-7xl text-center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Number Generator
        </motion.h1>

        {/* ── Number card ── */}
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {/* Pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PulseRing trigger={ringTrigger} />
          </div>

          <div className="meta-card p-10 sm:p-14 flex flex-col items-center gap-4 text-center">
            {/* Number display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={animKey}
                className="meta-number number-glow text-[7rem] sm:text-[9rem] md:text-[11rem] leading-none tabular-nums"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                {display ?? "—"}
              </motion.div>
            </AnimatePresence>

            <p className="text-white/70 text-base font-medium tracking-wide" style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
              {current ? `from 1 – ${maxNumber.toLocaleString()}` : `Tap Generate to begin`}
            </p>
          </div>
        </motion.div>

        {/* ── Generate button ── */}
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.04, boxShadow: "0 12px 40px oklch(0 0 0 / 0.22)" }}
          whileTap={{ scale: 0.97 }}
        >
          {busy ? "Generating…" : "Generate"}
        </motion.button>

        {/* ── Controls row ── */}
        <motion.div
          className="flex items-center gap-3 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <button
            onClick={() => { setShowRange(s => !s); setShowHistory(false); }}
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
            onClick={() => { setShowHistory(s => !s); setShowRange(false); }}
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

          {history.length > 0 && (
            <button
              onClick={() => { setHistory([]); setCurrent(null); }}
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

        {/* ── Range panel ── */}
        <AnimatePresence>
          {showRange && (
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
                  {/* Min — fixed */}
                  <div className="flex-1 text-center px-4 py-3 rounded-2xl font-bold text-lg text-white/80"
                    style={{ background: "oklch(1 0 0 / 0.12)", border: "1.5px solid oklch(1 0 0 / 0.2)", fontFamily: "Helvetica Neue, Arial, sans-serif" }}>
                    1
                  </div>
                  <span className="text-white/60 font-bold text-lg">→</span>
                  {/* Max — editable */}
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

                {/* Quick presets */}
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
          {showHistory && (
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

        {/* Hint */}
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
          {/* ∞ symbol */}
          <path
            d="M12 12C12 12 8.5 7 6 7C3.5 7 2 9.2 2 12C2 14.8 3.5 17 6 17C8.5 17 12 12 12 12Z"
            fill="white"
          />
          <path
            d="M12 12C12 12 15.5 7 18 7C20.5 7 22 9.2 22 12C22 14.8 20.5 17 18 17C15.5 17 12 12 12 12Z"
            fill="white"
          />
          {/* Meta text */}
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
