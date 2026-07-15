import { Howl, Howler } from "howler";
import type { SimulatorAudioCueId } from "@tcg/protocol";

interface SynthRecipe {
  readonly duration: number;
  readonly render: (ctx: OfflineAudioContext, dest: AudioNode, now: number) => void;
}

const SAMPLE_RATE = 44_100;
const howlMap = new Map<SimulatorAudioCueId, Howl>();
const blobUrls: string[] = [];
let currentVolume = 50;
let initialized = false;
let initGeneration = 0;

const recipes: Record<SimulatorAudioCueId, SynthRecipe> = {
  "card.draw": { duration: 0.16, render: (ctx, dest, now) => synthNoiseSweep(ctx, dest, now, 900) },
  "card.move": { duration: 0.12, render: (ctx, dest, now) => synthClick(ctx, dest, now, 620) },
  "card.play": { duration: 0.18, render: (ctx, dest, now) => synthTone(ctx, dest, now, 220, 440) },
  "card.discard": {
    duration: 0.2,
    render: (ctx, dest, now) => synthDown(ctx, dest, now, 260, 110),
  },
  "deck.shuffle": { duration: 0.28, render: synthShuffle },
  "resource.gain": {
    duration: 0.16,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 520, 760),
  },
  "resource.spend": { duration: 0.12, render: (ctx, dest, now) => synthClick(ctx, dest, now, 360) },
  "resource.steal": {
    duration: 0.22,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 340, 920),
  },
  "combat.start": { duration: 0.14, render: (ctx, dest, now) => synthClick(ctx, dest, now, 180) },
  "combat.hit": { duration: 0.18, render: synthHit },
  "effect.trigger": {
    duration: 0.2,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 760, 980),
  },
  "phase.change": {
    duration: 0.18,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 420, 520),
  },
  "turn.change": {
    duration: 0.28,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 260, 520),
  },
  "game.win": { duration: 0.75, render: synthVictory },
  "game.loss": { duration: 0.6, render: (ctx, dest, now) => synthDown(ctx, dest, now, 260, 80) },
};

export function initSimulatorSoundService(): void {
  if (typeof window === "undefined" || initialized) {
    return;
  }
  initialized = true;
  const generation = ++initGeneration;
  Howler.volume(volumeToGain(currentVolume));
  Promise.all(
    (Object.entries(recipes) as [SimulatorAudioCueId, SynthRecipe][]).map(([id, recipe]) =>
      prerenderSound(id, recipe, generation),
    ),
  ).catch(() => undefined);
}

export function setSimulatorSoundVolume(volume: number): void {
  if (!Number.isFinite(volume)) {
    return;
  }
  currentVolume = Math.max(0, Math.min(100, Math.round(volume)));
  Howler.volume(volumeToGain(currentVolume));
}

export function disposeSimulatorSoundService(): void {
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

export function playSimulatorSound(id: SimulatorAudioCueId | null | undefined): void {
  if (!id || currentVolume === 0) {
    return;
  }
  howlMap.get(id)?.play();
}

function volumeToGain(volume: number): number {
  return (Math.max(0, Math.min(100, volume)) / 100) ** 2;
}

async function prerenderSound(
  id: SimulatorAudioCueId,
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
    console.debug(`Failed to render simulator sound: ${id}`, error);
  }
}

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

function envelope(ctx: BaseAudioContext, now: number, duration: number, peak = 0.18): GainNode {
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
  osc.connect(envelope(ctx, now, 0.18)).connect(dest);
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
  osc.connect(envelope(ctx, now, 0.22, 0.14)).connect(dest);
  osc.start(now);
  osc.stop(now + 0.24);
}

function synthClick(ctx: BaseAudioContext, dest: AudioNode, now: number, frequency: number): void {
  const osc = ctx.createOscillator();
  osc.type = "square";
  osc.frequency.setValueAtTime(frequency, now);
  osc.connect(envelope(ctx, now, 0.08, 0.09)).connect(dest);
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
  noise
    .connect(filter)
    .connect(envelope(ctx, now, 0.12, 0.08))
    .connect(dest);
  noise.start(now);
  noise.stop(now + 0.14);
}

function synthShuffle(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  synthNoiseSweep(ctx, dest, now, 720);
  synthNoiseSweep(ctx, dest, now + 0.075, 860);
  synthNoiseSweep(ctx, dest, now + 0.15, 760);
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
