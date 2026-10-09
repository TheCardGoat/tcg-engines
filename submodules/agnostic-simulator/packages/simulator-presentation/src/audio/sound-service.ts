import { Howl, Howler } from "howler";
import type { SimulatorAudioCueId } from "@tcg/protocol";
import { simulatorSoundAssetUrl, type SimulatorSoundPackId } from "./sound-packs";
import { simulatorAudioDebug } from "./debug";

interface SynthRecipe {
  readonly duration: number;
  readonly render: (ctx: OfflineAudioContext, dest: AudioNode, now: number) => void;
}

const SAMPLE_RATE = 44_100;
type SoundId = SimulatorAudioCueId | "attention.reminder";
const howlMap = new Map<SoundId, Howl>();
const blobUrls: string[] = [];
const assetSounds = new Map<string, Howl>();
let currentVolume = 50;
let initialized = false;
let initGeneration = 0;
let readyPromise: Promise<void> | null = null;
let currentSoundPack: SimulatorSoundPackId = "original";

const recipes: Record<SimulatorAudioCueId, SynthRecipe> = {
  "card.draw": {
    duration: 0.26,
    render: (ctx, dest, now) => synthPaper(ctx, dest, now, 0.2, 0.24),
  },
  "card.move": { duration: 0.3, render: (ctx, dest, now) => synthPaper(ctx, dest, now, 0.24, 0.3) },
  "card.play": { duration: 0.32, render: synthLanding },
  "card.discard": {
    duration: 0.2,
    render: (ctx, dest, now) => synthDown(ctx, dest, now, 260, 110),
  },
  "card.destroy": {
    duration: 0.24,
    render: (ctx, dest, now) => synthDown(ctx, dest, now, 180, 64),
  },
  "card.reveal": {
    duration: 0.2,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 640, 960),
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
  "life.gain": {
    duration: 0.24,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 440, 880),
  },
  "life.loss": {
    duration: 0.22,
    render: (ctx, dest, now) => synthDown(ctx, dest, now, 220, 72),
  },
  "combat.start": { duration: 0.14, render: (ctx, dest, now) => synthClick(ctx, dest, now, 180) },
  "combat.hit": { duration: 0.18, render: synthHit },
  "combat.block": {
    duration: 0.2,
    render: (ctx, dest, now) => synthClick(ctx, dest, now, 140),
  },
  "damage.prevent": {
    duration: 0.22,
    render: (ctx, dest, now) => synthTone(ctx, dest, now, 300, 620),
  },
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
  "random.die": {
    duration: 0.24,
    render: (ctx, dest, now) => {
      synthClick(ctx, dest, now, 240);
      synthClick(ctx, dest, now + 0.07, 310);
      synthClick(ctx, dest, now + 0.14, 190);
    },
  },
  "random.coin": {
    duration: 0.3,
    render: (ctx, dest, now) => {
      synthClick(ctx, dest, now, 170);
      for (const [frequency, gain] of [
        [1480, 0.07],
        [2310, 0.035],
        [3670, 0.018],
      ]) {
        const tone = ctx.createOscillator();
        tone.type = "sine";
        tone.frequency.value = frequency;
        tone.connect(envelope(ctx, now, 0.24, gain)).connect(dest);
        tone.start(now);
        tone.stop(now + 0.26);
      }
    },
  },
  "game.win": { duration: 0.75, render: synthVictory },
  "game.loss": { duration: 0.6, render: (ctx, dest, now) => synthDown(ctx, dest, now, 260, 80) },
};

const attentionRecipe: SynthRecipe = {
  duration: 0.32,
  render: (ctx, dest, now) => {
    synthTone(ctx, dest, now, 520, 660);
    synthTone(ctx, dest, now + 0.14, 660, 880);
  },
};

export function initSimulatorSoundService(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  // Called from the user's play gesture, before async asset preparation.
  // An idle AudioContext must be resumed while that gesture is still active.
  if (Howler.ctx?.state === "suspended") {
    void Howler.ctx.resume().catch((error: unknown) => {
      console.debug("Could not resume simulator audio", error);
    });
  }
  if (initialized) {
    return readyPromise ?? Promise.resolve();
  }
  initialized = true;
  const generation = ++initGeneration;
  Howler.volume(volumeToGain(currentVolume));
  const packReady =
    currentSoundPack === "original"
      ? Promise.all(
          (Object.entries(recipes) as [SimulatorAudioCueId, SynthRecipe][]).map(([id, recipe]) =>
            prerenderSound(id, recipe, generation),
          ),
        ).then(() => undefined)
      : loadCdnSoundPack(currentSoundPack, generation);
  readyPromise = Promise.all([
    packReady,
    prerenderSound("attention.reminder", attentionRecipe, generation),
  ]).then(() => undefined);
  return readyPromise;
}

export function setSimulatorSoundPack(packId: SimulatorSoundPackId): Promise<void> {
  if (packId === currentSoundPack && initialized) {
    return readyPromise ?? Promise.resolve();
  }
  disposeSimulatorSoundService();
  currentSoundPack = packId;
  return initSimulatorSoundService();
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
  for (const howl of assetSounds.values()) howl.unload();
  assetSounds.clear();
  blobUrls.length = 0;
  initialized = false;
  readyPromise = null;
}

export function playSimulatorSound(
  id: SimulatorAudioCueId | null | undefined,
  shouldPlay?: () => boolean,
  assetUrl?: string,
): void {
  if (!id) {
    return;
  }
  playSound(id, shouldPlay, assetUrl);
}

/** Preload a game-selected asset through the same volume and mute service. */
export function preloadSimulatorSoundAsset(url: string): void {
  if (
    typeof window === "undefined" ||
    navigator.userAgent.includes("jsdom") ||
    assetSounds.has(url)
  )
    return;
  assetSounds.set(
    url,
    new Howl({
      src: [url],
      preload: true,
      volume: 1,
      onloaderror: (_id, error) => console.debug(`Failed to load simulator asset: ${url}`, error),
    }),
  );
}

/** An interface cue, kept separate from game animation sound packs. */
export function playActionAttentionSound(shouldPlay: () => boolean): void {
  playSound("attention.reminder", shouldPlay);
}

function playSound(id: SoundId, shouldPlay: () => boolean = () => true, assetUrl?: string): void {
  if (currentVolume === 0 || !shouldPlay()) {
    simulatorAudioDebug("suppressed", { cue: id, reason: "muted" });
    return;
  }
  if (assetUrl) {
    preloadSimulatorSoundAsset(assetUrl);
    const sound = assetSounds.get(assetUrl);
    if (!sound) return;
    const generation = initGeneration;
    const play = () => {
      if (generation !== initGeneration || !shouldPlay() || currentVolume === 0) return;
      sound.play();
      simulatorAudioDebug("played", { cue: id, assetUrl });
    };
    if (sound.state() === "loaded") play();
    else sound.once("load", play);
    return;
  }
  const readiness = initialized ? readyPromise : initSimulatorSoundService();
  const generation = initGeneration;
  const playWhenCurrent = () => {
    if (generation !== initGeneration || currentVolume === 0 || !shouldPlay()) return;
    const sound = howlMap.get(id);
    if (!sound) {
      simulatorAudioDebug("unavailable", { cue: id });
      return;
    }
    sound.play();
    simulatorAudioDebug("played", { cue: id });
  };
  if (readiness) {
    void readiness.then(playWhenCurrent).catch((error: unknown) => {
      console.debug(`Failed to prepare simulator sound: ${id}`, error);
    });
    return;
  }
  playWhenCurrent();
}

function volumeToGain(volume: number): number {
  return (Math.max(0, Math.min(100, volume)) / 100) ** 2;
}

async function prerenderSound(id: SoundId, recipe: SynthRecipe, generation: number): Promise<void> {
  try {
    const offlineCtx = new OfflineAudioContext(
      1,
      Math.ceil(SAMPLE_RATE * (recipe.duration + 0.08)),
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

async function loadCdnSoundPack(
  packId: Exclude<SimulatorSoundPackId, "original">,
  generation: number,
): Promise<void> {
  // Test environments must never fetch CDN assets; plays become no-ops.
  if (typeof navigator !== "undefined" && navigator.userAgent.includes("jsdom")) {
    return;
  }
  await Promise.all(
    (Object.keys(recipes) as SimulatorAudioCueId[]).map(
      (id) =>
        new Promise<void>((resolve, reject) => {
          const howl = new Howl({
            src: [simulatorSoundAssetUrl(packId, id)],
            format: ["wav"],
            preload: true,
            // Signal samples are louder and brighter than the generated packs.
            volume: packId === "signal" ? 0.55 : 1,
            rate: packId === "signal" ? 0.88 : 1,
            onload: () => {
              if (generation === initGeneration) {
                howlMap.set(id, howl);
              } else {
                howl.unload();
              }
              resolve();
            },
            onloaderror: (_soundId, error) => {
              howl.unload();
              reject(new Error(`Failed to load ${packId}/${id}: ${String(error)}`));
            },
          });
        }),
    ),
  );
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
  osc.type = "triangle";
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + 0.18);
  osc.connect(envelope(ctx, now, 0.22, 0.14)).connect(dest);
  osc.start(now);
  osc.stop(now + 0.24);
}

function synthClick(ctx: BaseAudioContext, dest: AudioNode, now: number, frequency: number): void {
  const osc = ctx.createOscillator();
  osc.type = "sine";
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
  synthPaper(ctx, dest, now, 0.11, 0.22);
  synthPaper(ctx, dest, now + 0.075, 0.13, 0.18);
  synthPaper(ctx, dest, now + 0.15, 0.15, 0.2);
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

/** Band-limited paper friction: a soft attack, a short body, and a silent tail. */
function synthPaper(
  ctx: BaseAudioContext,
  dest: AudioNode,
  now: number,
  duration: number,
  peak: number,
): void {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, duration);
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 0.65;
  band.frequency.setValueAtTime(2600, now);
  band.frequency.exponentialRampToValueAtTime(700, now + duration);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peak, now + duration * 0.22);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.92);
  gain.gain.linearRampToValueAtTime(0, now + duration);
  source.connect(band).connect(gain).connect(dest);
  source.start(now);
  source.stop(now + duration);
}

/** A felt contact and low body are distinct from the airborne paper cue. */
function synthLanding(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  synthPaper(ctx, dest, now, 0.09, 0.42);
  const body = ctx.createOscillator();
  body.type = "sine";
  body.frequency.setValueAtTime(170, now);
  body.frequency.exponentialRampToValueAtTime(72, now + 0.14);
  body.connect(envelope(ctx, now, 0.22, 0.32)).connect(dest);
  body.start(now);
  body.stop(now + 0.25);
}
