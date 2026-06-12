import { Howl, Howler } from "howler";

export type SoundEffectId =
  | "card-play"
  | "card-move"
  | "card-draw"
  | "card-trash"
  | "resource-gain"
  | "resource-spend"
  | "gig-roll"
  | "gig-move"
  | "gig-steal"
  | "gig-change"
  | "attack-start"
  | "attack-hit"
  | "block"
  | "defeat"
  | "effect-trigger"
  | "effect-target"
  | "turn-change"
  | "phase-change"
  | "victory"
  | "defeat-game";

interface SynthRecipe {
  duration: number;
  render: (ctx: OfflineAudioContext, dest: AudioNode, now: number) => void;
}

const SAMPLE_RATE = 44_100;
const howlMap = new Map<SoundEffectId, Howl>();
const blobUrls: string[] = [];
let currentVolume = 35;
let initialized = false;
let initGeneration = 0;

const recipes: Record<SoundEffectId, SynthRecipe> = {
  "card-play": { duration: 0.2, render: (ctx, dest, now) => synthTone(ctx, dest, now, 220, 440) },
  "card-move": { duration: 0.14, render: (ctx, dest, now) => synthClick(ctx, dest, now, 650) },
  "card-draw": { duration: 0.16, render: (ctx, dest, now) => synthNoiseSweep(ctx, dest, now, 900) },
  "card-trash": { duration: 0.2, render: (ctx, dest, now) => synthDown(ctx, dest, now, 260, 110) },
  "resource-gain": {
    duration: 0.16,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 520, 760),
  },
  "resource-spend": { duration: 0.14, render: (ctx, dest, now) => synthClick(ctx, dest, now, 360) },
  "gig-roll": { duration: 0.24, render: synthGigRoll },
  "gig-move": { duration: 0.16, render: (ctx, dest, now) => synthClick(ctx, dest, now, 470) },
  "gig-steal": { duration: 0.26, render: (ctx, dest, now) => synthTone(ctx, dest, now, 330, 700) },
  "gig-change": { duration: 0.18, render: (ctx, dest, now) => synthTone(ctx, dest, now, 610, 520) },
  "attack-start": { duration: 0.14, render: (ctx, dest, now) => synthClick(ctx, dest, now, 180) },
  "attack-hit": { duration: 0.18, render: synthHit },
  block: { duration: 0.18, render: (ctx, dest, now) => synthDown(ctx, dest, now, 360, 210) },
  defeat: { duration: 0.24, render: (ctx, dest, now) => synthDown(ctx, dest, now, 300, 90) },
  "effect-trigger": {
    duration: 0.2,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 760, 980),
  },
  "effect-target": {
    duration: 0.18,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 980, 680),
  },
  "turn-change": {
    duration: 0.28,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 260, 520),
  },
  "phase-change": {
    duration: 0.18,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 420, 520),
  },
  victory: { duration: 0.75, render: synthVictory },
  "defeat-game": { duration: 0.6, render: (ctx, dest, now) => synthDown(ctx, dest, now, 260, 80) },
};

function encodeWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const dataSize = buffer.length * numChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i] ?? 0));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return arrayBuffer;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

async function prerenderSound(
  id: SoundEffectId,
  recipe: SynthRecipe,
  generation: number,
): Promise<void> {
  try {
    const offlineCtx = new OfflineAudioContext(
      1,
      Math.ceil(SAMPLE_RATE * recipe.duration),
      SAMPLE_RATE,
    );
    recipe.render(offlineCtx, offlineCtx.destination, 0);
    const audioBuffer = await offlineCtx.startRendering();
    if (generation !== initGeneration) {
      return;
    }
    const wavData = encodeWav(audioBuffer);
    const blob = new Blob([wavData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    blobUrls.push(url);
    howlMap.set(id, new Howl({ src: [url], format: ["wav"], preload: true, volume: 1 }));
  } catch (error) {
    // Audio rendering is best-effort; failed sounds simply remain unavailable.
    console.debug(`Failed to render sound: ${id}`, error);
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initSoundService(): void {
  if (typeof window === "undefined" || initialized) {
    return;
  }
  initialized = true;
  const generation = ++initGeneration;
  Howler.volume((currentVolume / 100) ** 2);
  Promise.all(
    (Object.entries(recipes) as [SoundEffectId, SynthRecipe][]).map(([id, recipe]) =>
      prerenderSound(id, recipe, generation),
    ),
  ).catch(() => undefined);
}

export function setSoundVolume(volume: number): void {
  if (!Number.isFinite(volume)) {
    return;
  }
  currentVolume = Math.max(0, Math.min(100, Math.round(volume)));
  Howler.volume((currentVolume / 100) ** 2);
}

export function disposeSoundService(): void {
  ++initGeneration;
  for (const howl of howlMap.values()) {
    howl.unload();
  }
  for (const url of blobUrls) {
    URL.revokeObjectURL(url);
  }
  howlMap.clear();
  blobUrls.length = 0;
  initialized = false;
}

export function playSound(id: SoundEffectId | null): void {
  if (!id || currentVolume === 0 || prefersReducedMotion()) {
    return;
  }
  howlMap.get(id)?.play();
}

function envelope(ctx: BaseAudioContext, now: number, duration: number, peak = 0.28): GainNode {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(peak, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  return gain;
}

function synthTone(
  ctx: BaseAudioContext,
  dest: AudioNode,
  now: number,
  from: number,
  to: number,
): void {
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + 0.16);
  osc.connect(envelope(ctx, now, 0.18, 0.22)).connect(dest);
  osc.start(now);
  osc.stop(now + 0.2);
}

function synthDown(
  ctx: BaseAudioContext,
  dest: AudioNode,
  now: number,
  from: number,
  to: number,
): void {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + 0.18);
  osc.connect(envelope(ctx, now, 0.22, 0.18)).connect(dest);
  osc.start(now);
  osc.stop(now + 0.24);
}

function synthClick(ctx: BaseAudioContext, dest: AudioNode, now: number, frequency: number): void {
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(frequency, now);
  osc.connect(envelope(ctx, now, 0.08, 0.12)).connect(dest);
  osc.start(now);
  osc.stop(now + 0.1);
}

function createNoiseBuffer(ctx: BaseAudioContext, durationSec: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * durationSec), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function synthNoiseSweep(
  ctx: BaseAudioContext,
  dest: AudioNode,
  now: number,
  cutoff: number,
): void {
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.14);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(cutoff, now);
  const gain = envelope(ctx, now, 0.12, 0.1);
  noise.connect(filter).connect(gain).connect(dest);
  noise.start(now);
  noise.stop(now + 0.14);
}

function synthGigRoll(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  synthClick(ctx, dest, now, 520);
  synthClick(ctx, dest, now + 0.055, 430);
  synthClick(ctx, dest, now + 0.11, 580);
}

function synthHit(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  synthNoiseSweep(ctx, dest, now, 240);
  synthDown(ctx, dest, now, 180, 120);
}

function synthVictory(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  synthTone(ctx, dest, now, 330, 660);
  synthTone(ctx, dest, now + 0.18, 440, 880);
  synthTone(ctx, dest, now + 0.36, 550, 990);
}
