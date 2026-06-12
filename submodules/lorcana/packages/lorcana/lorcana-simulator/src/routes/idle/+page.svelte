<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  type Vibe = 'lavalamp' | 'crt' | 'starwell' | 'vaporwave' | 'inkdrip';

  const vibes: Vibe[] = ['lavalamp', 'crt', 'starwell', 'vaporwave', 'inkdrip'];

  const headlines = [
    'You drifted into the Lore.',
    'The ink stilled. Waiting.',
    'A glimmer paused mid-flight.',
    'Even illumineers need to blink.',
    'Your turn napped through the door.',
    'The board misses you.',
    'Suspended between songs.',
    'A storyteller forgot the next line.',
  ];

  const subtitles = [
    "We've quieted the table to save its breath.",
    'Tap anywhere — or the button — to come back.',
    'Your seat is held. The ink remembers.',
    'No clocks here. Move when you can.',
    'Half a thought, half a song. Take your time.',
  ];

  const glyphPool = ['◇', '◆', '✦', '✧', '❖', '✶', '✺', '☼', '⟡', '⟢', '⌬', '◈'];

  // Deterministic per-visit randomness so re-renders don't reshuffle constantly.
  const rand = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

  let vibe = $state<Vibe>('lavalamp');
  let headline = $state(headlines[0]!);
  let subtitle = $state(subtitles[0]!);
  let seed = $state(0);
  let elapsed = $state(0);

  // Tiny pre-rendered "stars" for the starwell — generated once.
  let stars = $state<Array<{ x: number; y: number; s: number; d: number; o: number }>>([]);

  // Floating ink blobs / vaporwave glyphs — also generated once.
  let drifters = $state<
    Array<{ x: number; y: number; size: number; delay: number; dur: number; glyph: string }>
  >([]);

  onMount(() => {
    vibe = rand(vibes);
    headline = rand(headlines);
    subtitle = rand(subtitles);
    seed = Math.floor(Math.random() * 360);

    stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2 + 0.5,
      d: Math.random() * 8 + 4,
      o: Math.random() * 0.7 + 0.3,
    }));

    drifters = Array.from({ length: 14 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 28 + 18,
      delay: Math.random() * 6,
      dur: Math.random() * 14 + 12,
      glyph: rand(glyphPool),
    }));

    const t0 = Date.now();
    const tick = setInterval(() => {
      elapsed = Math.floor((Date.now() - t0) / 1000);
    }, 1000);

    // Any user input = wake up.
    const wake = () => goBack();
    window.addEventListener('keydown', wake);
    window.addEventListener('pointerdown', wake, { once: true });

    return () => {
      clearInterval(tick);
      window.removeEventListener('keydown', wake);
    };
  });

  function reroll() {
    let next: Vibe = vibe;
    while (next === vibe) next = rand(vibes);
    vibe = next;
    headline = rand(headlines);
    subtitle = rand(subtitles);
    seed = Math.floor(Math.random() * 360);
  }

  function goBack() {
    // Best-effort: try history, else lobby.
    if (typeof window === 'undefined') return;
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const r = (s % 60).toString().padStart(2, '0');
    return `${m}:${r}`;
  };
</script>

<svelte:head>
  <title>idle — lorcanito</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main
  class="idle-root"
  data-vibe={vibe}
  style="--seed: {seed}; --hue: {seed}deg;"
>
  <!-- ===================== BACKDROPS ===================== -->

  {#if vibe === 'lavalamp'}
    <div class="vibe-lavalamp" aria-hidden="true">
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
            <feColorMatrix
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -10"
            />
          </filter>
        </defs>
        <g filter="url(#goo)">
          {#each Array(7) as _, i}
            <circle
              cx={`${10 + i * 13}%`}
              cy={`${50 + Math.sin(i + seed) * 20}%`}
              r={`${60 + ((i * 17 + seed) % 40)}`}
              fill={`hsl(${(seed + i * 47) % 360} 80% 60%)`}
              class="blob"
              style="--i: {i};"
            />
          {/each}
        </g>
      </svg>
    </div>
  {:else if vibe === 'crt'}
    <div class="vibe-crt" aria-hidden="true">
      <div class="scan"></div>
      <div class="flicker"></div>
      <div class="bars"></div>
    </div>
  {:else if vibe === 'starwell'}
    <div class="vibe-starwell" aria-hidden="true">
      {#each stars as s, i (i)}
        <span
          class="star"
          style="left: {s.x}%; top: {s.y}%; --size: {s.s}px; --dur: {s.d}s; --o: {s.o};"
        ></span>
      {/each}
      <div class="well"></div>
    </div>
  {:else if vibe === 'vaporwave'}
    <div class="vibe-vaporwave" aria-hidden="true">
      <div class="sun"></div>
      <div class="grid"></div>
      <div class="haze"></div>
    </div>
  {:else if vibe === 'inkdrip'}
    <div class="vibe-inkdrip" aria-hidden="true">
      {#each drifters as d, i (i)}
        <span
          class="drifter"
          style="left: {d.x}%; top: {d.y}%; font-size: {d.size}px; animation-delay: -{d.delay}s; animation-duration: {d.dur}s;"
          >{d.glyph}</span
        >
      {/each}
    </div>
  {/if}

  <!-- ===================== FOREGROUND ===================== -->

  <section class="card">
    <div class="eyebrow">
      <span class="dot"></span>
      <span>away from the table</span>
      <span class="elapsed">· {fmt(elapsed)}</span>
    </div>

    <h1 class="headline">
      {#each headline.split('') as ch, i (i)}
        <span class="ch" style="--i: {i}">{ch === ' ' ? ' ' : ch}</span>
      {/each}
    </h1>

    <p class="subtitle">{subtitle}</p>

    <div class="actions">
      <button type="button" class="btn primary" onclick={goBack}>
        <span>wake me up</span>
        <span aria-hidden="true">↗</span>
      </button>
      <button type="button" class="btn ghost" onclick={() => goto('/matchmaking')}>
        <span>back to matchmaking</span>
        <span aria-hidden="true">⟵</span>
      </button>
      <button type="button" class="btn ghost" onclick={reroll}>
        <span>reroll the dream</span>
        <span aria-hidden="true">⟲</span>
      </button>
    </div>

    <p class="hint">press any key — or click — to return</p>
  </section>
</main>

<style>
  /* ============ ROOT / SHARED ============ */
  .idle-root {
    position: fixed;
    inset: 0;
    overflow: hidden;
    color: white;
    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      sans-serif;
    background: #07060d;
    isolation: isolate;
  }

  .card {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    text-align: center;
    padding: 2rem;
    z-index: 10;
    pointer-events: none;
  }

  .card > * {
    pointer-events: auto;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    justify-self: center;
    font-size: 0.7rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.65);
    padding: 0.4rem 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 999px;
    backdrop-filter: blur(8px);
    background: rgba(255, 255, 255, 0.04);
    margin-bottom: 1.4rem;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: hsl(var(--hue) 90% 65%);
    box-shadow: 0 0 12px hsl(var(--hue) 90% 65%);
    animation: pulse 1.6s ease-in-out infinite;
  }
  .elapsed {
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.45);
  }

  .headline {
    font-size: clamp(2rem, 6.5vw, 4.5rem);
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.05;
    max-width: 18ch;
    margin: 0 auto;
    text-wrap: balance;
  }
  .ch {
    display: inline-block;
    animation: breathe 4s ease-in-out infinite;
    animation-delay: calc(var(--i) * 40ms);
  }

  .subtitle {
    margin: 1.2rem auto 2rem;
    max-width: 38ch;
    font-size: clamp(0.95rem, 1.6vw, 1.1rem);
    color: rgba(255, 255, 255, 0.72);
    text-wrap: balance;
  }

  .actions {
    display: inline-flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    appearance: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.06);
    color: white;
    padding: 0.85rem 1.4rem;
    border-radius: 999px;
    font: inherit;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    cursor: pointer;
    backdrop-filter: blur(10px);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
  }
  .btn:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.4);
  }
  .btn.primary {
    background: hsl(var(--hue) 90% 60%);
    border-color: hsl(var(--hue) 90% 70%);
    color: #0b0a14;
    font-weight: 600;
    box-shadow: 0 10px 40px -10px hsl(var(--hue) 90% 60% / 0.6);
  }
  .btn.primary:hover {
    background: hsl(var(--hue) 95% 68%);
  }

  .hint {
    margin-top: 2rem;
    font-size: 0.72rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
  @keyframes breathe {
    0%, 100% { transform: translateY(0); opacity: 1; }
    50% { transform: translateY(-2px); opacity: 0.92; }
  }

  /* ============ LAVA LAMP ============ */
  .vibe-lavalamp {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        circle at 30% 20%,
        hsl(calc(var(--hue) + 40) 60% 25%) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        hsl(calc(var(--hue) + 220) 70% 30%) 0%,
        transparent 60%
      ),
      #050410;
    filter: saturate(1.1);
  }
  .vibe-lavalamp svg {
    position: absolute;
    inset: -10%;
    width: 120%;
    height: 120%;
  }
  .blob {
    transform-origin: center;
    animation: float 18s ease-in-out infinite;
    animation-delay: calc(var(--i) * -2.4s);
    mix-blend-mode: screen;
  }
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(80px, -60px) scale(1.15); }
    66% { transform: translate(-70px, 50px) scale(0.85); }
  }

  /* ============ CRT / GLITCH ============ */
  .vibe-crt {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at center, #0a1f15 0%, #020604 70%, #000 100%);
    overflow: hidden;
  }
  .vibe-crt::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.0) 0px,
        rgba(0, 0, 0, 0.0) 2px,
        rgba(0, 0, 0, 0.35) 3px,
        rgba(0, 0, 0, 0.0) 4px
      );
    pointer-events: none;
  }
  .scan {
    position: absolute;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(120, 255, 180, 0.08) 50%,
      transparent
    );
    animation: scan 6s linear infinite;
  }
  .flicker {
    position: absolute;
    inset: 0;
    background: rgba(60, 220, 130, 0.04);
    animation: flicker 130ms steps(2) infinite;
    mix-blend-mode: overlay;
  }
  .bars {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(255, 0, 80, 0.06),
      transparent 20%,
      transparent 80%,
      rgba(0, 200, 255, 0.06)
    );
    pointer-events: none;
  }
  .vibe-crt ~ .card .headline {
    color: #c8ffd8;
    text-shadow:
      -2px 0 rgba(255, 0, 90, 0.7),
      2px 0 rgba(0, 200, 255, 0.7),
      0 0 30px rgba(120, 255, 180, 0.4);
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
  }
  @keyframes scan {
    0% { top: -30%; }
    100% { top: 100%; }
  }
  @keyframes flicker {
    0% { opacity: 0.9; }
    50% { opacity: 1; }
    100% { opacity: 0.85; }
  }

  /* ============ STARWELL ============ */
  .vibe-starwell {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 60%, #1a0b3d 0%, #050218 60%, #000 100%);
    overflow: hidden;
  }
  .star {
    position: absolute;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    background: white;
    opacity: var(--o);
    box-shadow: 0 0 6px white;
    animation: twinkle var(--dur) ease-in-out infinite;
  }
  .well {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 60vmin;
    height: 60vmin;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(
      circle,
      transparent 30%,
      hsl(var(--hue) 90% 60% / 0.18) 50%,
      transparent 70%
    );
    animation: rotate 30s linear infinite;
    filter: blur(6px);
  }
  @keyframes twinkle {
    0%, 100% { opacity: var(--o); transform: scale(1); }
    50% { opacity: 0.1; transform: scale(0.4); }
  }
  @keyframes rotate {
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  /* ============ VAPORWAVE ============ */
  .vibe-vaporwave {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, #1b0533 0%, #ff3d8b 55%, #ffae3d 80%, #ffe8b0 100%);
    overflow: hidden;
  }
  .sun {
    position: absolute;
    left: 50%;
    bottom: 35%;
    width: 38vmin;
    height: 38vmin;
    transform: translateX(-50%);
    background: linear-gradient(180deg, #fff35a 0%, #ff3d8b 70%);
    border-radius: 50%;
    box-shadow: 0 0 80px rgba(255, 90, 150, 0.6);
  }
  .sun::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60%;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 8%,
      #1b0533 8%,
      #1b0533 12%
    );
  }
  .grid {
    position: absolute;
    left: -50%;
    right: -50%;
    bottom: -10%;
    height: 60%;
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px);
    background-size: 50px 50px;
    transform: perspective(400px) rotateX(60deg);
    transform-origin: center top;
    animation: glide 4s linear infinite;
  }
  .haze {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at center,
      transparent 0%,
      rgba(20, 0, 40, 0.4) 100%
    );
  }
  @keyframes glide {
    from { background-position: 0 0; }
    to { background-position: 0 50px; }
  }
  .vibe-vaporwave ~ .card .headline {
    text-shadow: 4px 4px 0 #1b0533, 8px 8px 30px rgba(0, 0, 0, 0.4);
  }

  /* ============ INK DRIP ============ */
  .vibe-inkdrip {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse at top,
        hsl(var(--hue) 60% 20%) 0%,
        #0a0815 60%,
        #050410 100%
      );
    overflow: hidden;
  }
  .drifter {
    position: absolute;
    color: hsl(var(--hue) 80% 70%);
    text-shadow: 0 0 18px hsl(var(--hue) 80% 60% / 0.8);
    opacity: 0.7;
    animation: drift 18s ease-in-out infinite;
    user-select: none;
    pointer-events: none;
  }
  @keyframes drift {
    0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
    50% { transform: translate(20px, -40px) rotate(180deg); opacity: 0.9; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ch, .blob, .star, .grid, .drifter, .scan, .flicker, .well, .dot {
      animation: none !important;
    }
  }
</style>
