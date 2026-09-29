import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Music2,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// One array: each photo carries its own caption so they can never get mixed up.
const memories = [
  { src: "/images/photo-6.jpeg", caption: "Muskan, looking like the queen of every place she walks into", position: "center 35%" },
  { src: "/images/photo-8.jpeg", caption: "Two friends, one beautiful view, and a lifetime of memories ❤", position: "center 55%" },
  { src: "/images/photo-4.jpeg", caption: "Dayan on top of the world, still patting my head like I'm her pet", position: "center 40%" },
  { src: "/images/photo-3.jpeg", caption: "Muskii laughing so hard she had to hide her face", position: "center 45%" },
  { src: "/images/photo-7.jpeg", caption: "Happy Meal glasses and zero shame. Peak Dayan energy", position: "center 35%" },
  { src: "/images/photo-1.jpeg", caption: "Holi ka sabse khatarnak Dayan", position: "center 30%" },
  { src: "/images/photo-5.jpeg", caption: "Good food, good vibes, and the best company ❤", position: "center 45%" },
  { src: "/images/photo-2.jpeg", caption: "No filter needed, Muskan. This smile is my favourite ❤", position: "center 30%" },
];
const firstMemory = memories[0]!;
const SLIDE_MS = 6000;

const lines = [
  "Happy Birthday, Muskan!",
  "Some people come into your life and quietly become your home.",
  "You are that person for me.",
  "Thank you for every laugh, every secret, and every time you stayed when it mattered.",
  "The world is a little brighter, and I am a little happier, because you are in it.",
  "This year, I hope life gives you back all the love you have given to everyone else. ❤",
];

const letter = lines.join("\n\n");
const dodgeMessages = [
  "Arre, itni jaldi nahi Dayan!",
  "Pakad ke dikha pehle!",
  "Bas thoda aur... phir try kar!",
  "Ufff, tu bohot ziddi hai Dayan!",
];

const special = [
  { icon: Heart, label: "Your smile", text: "it can fix my worst day in a second." },
  { icon: Star, label: "Your heart", text: "you care deeper than you ever show." },
  { icon: ShieldCheck, label: "Your loyalty", text: "you are the friend everyone wishes for." },
  { icon: Sparkles, label: "Your madness", text: "life is never boring with you." },
  { icon: Heart, label: "Your presence", text: "with you, I can simply be myself." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday Muskan" },
      { name: "description", content: "A precious birthday surprise for Muskan, made with love by Anuj." },
      { property: "og:title", content: "Happy Birthday Muskan" },
      { property: "og:description", content: "A precious birthday surprise for Muskan, made with love by Anuj." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BirthdayPage,
});

function BirthdayPage() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [typing, setTyping] = useState(false);
  const [story, setStory] = useState(false);
  const [typed, setTyped] = useState("");
  const [speed, setSpeed] = useState(34);
  const [dodges, setDodges] = useState(0);
  const [label, setLabel] = useState("Khol ke dekh");
  const [won, setWon] = useState(false);
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [shaking, setShaking] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [slide, setSlide] = useState(0);
  const [modal, setModal] = useState(false);
  const [candles, setCandles] = useState([true, true, true]);
  const [timerKey, setTimerKey] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);
  const [seenAll, setSeenAll] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStart = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const origin = useRef<{ left: number; top: number } | null>(null);
  const endRef = useRef<HTMLSpanElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const userScrolled = useRef(false);
  const lastDodge = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  const fadeAudio = useCallback((target: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    window.clearInterval(Number(audio.dataset["fade"]));
    const id = window.setInterval(() => {
      const diff = target - audio.volume;
      if (Math.abs(diff) < 0.015) {
        audio.volume = target;
        window.clearInterval(id);
        if (target === 0) audio.pause();
      } else audio.volume = Math.max(0, Math.min(1, audio.volume + Math.sign(diff) * 0.01));
    }, 80);
    audio.dataset["fade"] = String(id);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || !musicOn) return;
      if (document.hidden) audio.pause();
      else void audio.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [musicOn]);

  useEffect(() => {
    if (!typing) return;
    if (typed.length >= letter.length) return;
    const current = letter[typed.length - 1] ?? "";
    const delay = /[.!?]/.test(current) ? speed * 5 : speed;
    const timer = window.setTimeout(() => setTyped(letter.slice(0, typed.length + 1)), delay);
    return () => window.clearTimeout(timer);
  }, [typed, typing, speed]);

  useEffect(() => {
    if (!typing || story) return;
    const last = typed[typed.length - 1];
    if (last === "\n") userScrolled.current = false;
    if (typed.length >= letter.length) {
      window.setTimeout(() => continueRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      return;
    }
    if (userScrolled.current) return;
    if (last === "\n" || typed.length % 6 === 0) endRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [typed, typing, story]);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const galleryPaused = modal || tabHidden;
  useEffect(() => {
    if (!story || galleryPaused) return;
    const t = window.setTimeout(() => setSlide((s) => (s + 1) % memories.length), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [story, slide, timerKey, galleryPaused]);

  useEffect(() => { if (slide === memories.length - 1) setSeenAll(true); }, [slide]);

  const goSlide = (dir: number) => { setSlide((s) => (s + dir + memories.length) % memories.length); setTimerKey((k) => k + 1); };

  const dodge = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const now = Date.now();
    if (now - lastDodge.current < 250) return;
    lastDodge.current = now;
    const rect = btn.getBoundingClientRect();
    if (!origin.current) origin.current = { left: rect.left + rect.width / 2 - buttonPos.x, top: rect.top - buttonPos.y };
    const W = window.innerWidth, H = window.innerHeight;
    const css = getComputedStyle(document.documentElement);
    const safeT = parseFloat(css.getPropertyValue("--sat")) || 0, safeB = parseFloat(css.getPropertyValue("--sab")) || 0;
    const m = 16;
    const bw = Math.min(W - m * 2, Math.max(rect.width, 300)), bh = Math.max(rect.height, 64);
    const curC = rect.left + rect.width / 2;
    let left = curC, top = rect.top;
    for (let i = 0; i < 60; i++) {
      const l = m + bw / 2 + Math.random() * Math.max(0, W - bw - m * 2);
      const t = m + safeT + Math.random() * Math.max(0, H - bh - m * 2 - safeT - safeB);
      left = l; top = t;
      if (Math.abs(l - curC) >= W * 0.35 || Math.abs(t - rect.top) >= H * 0.35) break;
    }
    setButtonPos({ x: left - origin.current.left, y: top - origin.current.top });
  };

  const openGift = () => {
    if (won) return;
    if (dodges < 4) {
      setLabel(dodgeMessages[dodges] ?? dodgeMessages[0] ?? "Not so fast!");
      setDodges((value) => value + 1);
      setShaking(true);
      dodge();
      navigator.vibrate?.(30);
      window.setTimeout(() => setShaking(false), 350);
      return;
    }
    setLabel("Achha baba, jeet gayi tu!");
    setWon(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0;
      void audio.play().then(() => { setMusicOn(true); fadeAudio(0.25); }).catch(() => undefined);
    }
    navigator.vibrate?.(30);
    window.setTimeout(() => {
      setOpened(true);
      window.setTimeout(() => { setTyping(true); fadeAudio(0.15); }, 1500);
    }, 800);
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => { setMusicOn(true); fadeAudio(story ? 0.25 : 0.15); }).catch(() => undefined);
    } else { fadeAudio(0); setMusicOn(false); }
  };

  const continueStory = () => { setStory(true); setTyping(false); fadeAudio(0.25); window.setTimeout(() => document.querySelector("#memories")?.scrollIntoView(), 50); };
  const allOut = candles.every((candle) => !candle);
  const currentMemory = memories[slide] ?? firstMemory;

  const replay = () => {
    setOpened(false); setTyping(false); setStory(false); setTyped(""); setDodges(0);
    setLabel("Khol ke dekh"); setWon(false); origin.current = null; setButtonPos({ x: 0, y: 0 }); setSlide(0); setSeenAll(false); userScrolled.current = false; setCandles([true, true, true]);
    const audio = audioRef.current;
    if (audio) { audio.currentTime = 0; audio.volume = 0; audio.pause(); }
    setMusicOn(false); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="loading-screen"><Heart className="loading-heart" fill="currentColor" /><p>For Muskan, with love</p></div>;

  return (
    <main className="birthday-shell">
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
      <div className="landscape-hint"><span className="phone-icon" />Please view in portrait mode</div>
      {opened && <button className="music-button" onClick={toggleMusic} aria-label={musicOn ? "Pause music" : "Play music"}>{musicOn ? <Pause /> : <Play />}{musicOn && <span className="equalizer"><i /><i /><i /></span>}</button>}
      <FloatingHearts />

      {!opened && (
        <section className="intro-screen" onTouchMove={(e) => {
          const t = e.touches[0]; const b = buttonRef.current?.getBoundingClientRect();
          if (!t || !b || dodges >= 4 || won) return;
          const dx = Math.max(b.left - t.clientX, 0, t.clientX - b.right), dy = Math.max(b.top - t.clientY, 0, t.clientY - b.bottom);
          if (Math.hypot(dx, dy) < 40) openGift();
        }}>
          <p className="eyebrow">29 September · A little secret</p>
          <h1>Ek surprise hai<br />tere liye, <em>Dayan...</em></h1>
          <div className={`gift ${shaking ? "gift-shake" : ""}`} aria-hidden="true"><span className="gift-lid" /><span className="gift-box" /><span className="gift-ribbon" /><span className="gift-bow left" /><span className="gift-bow right" /></div>
          <div className="open-slot">
            <button ref={buttonRef} className={`open-button ${won ? "won" : ""}`} style={{ transform: `translate3d(${buttonPos.x}px, ${buttonPos.y}px, 0)` }} onPointerDown={(event) => { event.preventDefault(); openGift(); }} aria-live="polite">
              <span key={label} className="open-label">{label}</span>{!won && <ArrowRight />}
              {dodges > 0 && <span key={`b${dodges}`} className="heart-burst" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <Heart key={i} fill="currentColor" style={{ "--i": i } as React.CSSProperties} />)}</span>}
            </button>
          </div>
          <p className="tiny-note">Made only for you</p>
        </section>
      )}

      {opened && !typing && !story && (
        <section className="opening-screen">
          <div className="open-gift"><div className="gift-glow" /><Heart fill="currentColor" /></div>
          <div className="confetti" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ "--i": i } as React.CSSProperties} />)}</div>
          <p>For the one who makes life brighter</p>
        </section>
      )}

      {typing && !story && (
        <section className="letter-screen" onPointerDown={() => setSpeed(8)} onTouchMove={() => { userScrolled.current = true; }} onWheel={(e) => { if (e.deltaY < 0) userScrolled.current = true; }}>
          <div className="letter-mark"><Heart fill="currentColor" /></div>
          <p className="letter-text">{typed}<span className="cursor" /><span ref={endRef} /></p>
          {typed.length === letter.length && <button ref={continueRef} className="continue-button" onClick={continueStory}>Continue <ArrowRight /></button>}
          {typed.length < letter.length && <span className="tap-note">Tap anywhere to read faster</span>}
        </section>
      )}

      {story && (
        <div className="story">
          <section className="memory-section" id="memories">
            <p className="section-kicker">Chapter one</p><h2>Our Memories</h2><p className="section-intro">Eight little windows into a friendship I would choose in every lifetime.</p>
            <div className="carousel" onPointerDown={(e) => { touchStart.current = e.clientX; }} onPointerUp={(e) => { const d = e.clientX - touchStart.current; if (Math.abs(d) > 45) goSlide(d < 0 ? 1 : -1); }}>
              <button key={slide} className="polaroid" onClick={() => setModal(true)} aria-label={`Enlarge memory ${slide + 1}`}>
                <div className="photo-wrap"><img src={currentMemory.src} alt={currentMemory.caption} loading="eager" style={{ objectPosition: currentMemory.position }} /><span className="photo-count">0{slide + 1} / 08</span></div>
                <p>{currentMemory.caption}</p>
              </button>
              <button className="side-arrow left" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={() => goSlide(-1)} aria-label="Previous memory"><ChevronLeft /></button>
              <button className="side-arrow right" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={() => goSlide(1)} aria-label="Next memory"><ChevronRight /></button>
            </div>
            <div className="slide-progress"><i key={`${slide}-${timerKey}`} style={{ animationPlayState: galleryPaused ? "paused" : "running" }} /></div>
            <div className="heart-dots">{memories.map((m, i) => <button key={m.src} onClick={() => { setSlide(i); setTimerKey((k) => k + 1); }} className={i === slide ? "active" : ""} aria-label={`Memory ${i + 1}`}><Heart fill="currentColor" /></button>)}</div>
            <div style={{ display: "none" }}>{memories.map((m) => <img key={m.src} src={m.src} alt="" />)}</div>
            {seenAll && <button className="continue-button gallery-continue" onClick={() => document.querySelector("#special")?.scrollIntoView({ behavior: "smooth" })}>Continue <ArrowRight className="nudge" /></button>}
          </section>

          <section className="special-section" id="special">
            <p className="section-kicker">Chapter two</p><h2>Why you are so<br /><em>special to me</em></h2>
            <div className="special-list">{special.map(({ icon: Icon, label, text }, i) => <article key={label}><span className="special-number">0{i + 1}</span><span className="special-icon"><Icon /></span><p><strong>{label}:</strong> {text}</p></article>)}</div>
          </section>

          <section className={`final-section ${allOut ? "wish-made" : ""}`}>
            <p className="section-kicker">One last wish</p><h2>{allOut ? "Make a wish, Muskan" : "Twenty-three looks beautiful on you"}</h2>
            {!allOut ? <p className="cake-hint">Blow out the candles, Muskan!</p> : <p className="wish-copy">May every wish of yours come true this year.</p>}
            <div className="cake" aria-label="Birthday cake with three candles">
              <div className="candles">{candles.map((lit, i) => <button key={i} className={`candle ${lit ? "lit" : "out"}`} onClick={() => { setCandles((old) => old.map((v, idx) => idx === i ? false : v)); navigator.vibrate?.(30); if (candles.filter(Boolean).length === 1) fadeAudio(0.3); }} aria-label={`Blow out candle ${i + 1}`}><span className="flame" /><span className="wick" /></button>)}</div>
              <div className="cake-top"><span className="cake-age">23</span></div><div className="cake-body"><span /><span /><span /></div><div className="cake-plate" />
            </div>
            {allOut && <><div className="fireworks" aria-hidden="true"><i /><i /><i /></div><div className="signature">Always yours, Chomu ❤<small>(Anuj)</small></div><button className="replay-button" onClick={replay}><RotateCcw /> Watch again</button></>}
          </section>
        </div>
      )}

      {modal && <div className="photo-modal" role="dialog" aria-modal="true" onClick={() => setModal(false)}><button aria-label="Close photo"><X /></button><img src={currentMemory.src} alt={`Memory ${slide + 1} enlarged`} /><p>{currentMemory.caption}</p></div>}
    </main>
  );
}

function FloatingHearts() {
  return <div className="floating-hearts" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <Heart key={i} fill="currentColor" style={{ "--i": i } as React.CSSProperties} />)}</div>;
}