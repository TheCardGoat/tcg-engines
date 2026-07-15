import { Howl, Howler } from "howler";
import type { BoardMoveAnimationVariant } from "./board-move-animations.js";
import type { CardEffectKind } from "./card-effect-animations.js";
import type { OverlayAnnouncementKind } from "./overlay-announcement-animations.js";

export type SoundEffectId =
  | "ink"
  | "play-character"
  | "play-character-shift"
  | "play-item"
  | "play-location"
  | "play-action"
  | "play-action-sing"
  | "move-to-location"
  | "quest"
  | "challenge"
  | "challenge-hit"
  | "banish"
  | "turn-change"
  | "concede"
  | "mulligan"
  | "activate-ability"
  | "sing"
  | "resolve-effect"
  | "victory"
  | "defeat"
  | "match-found"
  | "clock-tick";

const howlMap = new Map<SoundEffectId, Howl>();
const blobUrls: string[] = [];
let currentVolume = 50;
let initialized = false;
let initGeneration = 0;

// --- WAV encoding ---

function encodeWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = length * numChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return arrayBuffer;
}

// --- Pre-rendering ---

interface SynthRecipe {
  duration: number;
  render: (ctx: OfflineAudioContext, dest: AudioNode, now: number) => void;
}

const SAMPLE_RATE = 44100;

const recipes: Record<SoundEffectId, SynthRecipe> = {
  ink: { duration: 0.2, render: synthInk },
  "play-character": { duration: 0.35, render: synthPlayCharacter },
  "play-character-shift": { duration: 0.4, render: synthPlayCharacterShift },
  "play-item": { duration: 0.2, render: synthPlayItem },
  "play-location": { duration: 0.35, render: synthPlayLocation },
  "play-action": { duration: 0.3, render: synthPlayAction },
  "play-action-sing": { duration: 0.5, render: synthPlayActionSing },
  "move-to-location": { duration: 0.25, render: synthMoveToLocation },
  quest: { duration: 0.45, render: synthQuest },
  challenge: { duration: 0.15, render: synthChallenge },
  "challenge-hit": { duration: 0.18, render: synthChallengeHit },
  banish: { duration: 0.3, render: synthBanish },
  "turn-change": { duration: 0.35, render: synthTurnChange },
  concede: { duration: 0.55, render: synthConcede },
  mulligan: { duration: 0.2, render: synthMulligan },
  "activate-ability": { duration: 0.25, render: synthActivateAbility },
  sing: { duration: 0.4, render: synthSing },
  "resolve-effect": { duration: 0.2, render: synthResolveEffect },
  victory: { duration: 1.6, render: synthVictory },
  defeat: { duration: 1.4, render: synthDefeat },
  "match-found": { duration: 1.2, render: synthMatchFound },
  "clock-tick": { duration: 0.08, render: synthClockTick },
};

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
    if (generation !== initGeneration) return;
    const wavData = encodeWav(audioBuffer);
    const blob = new Blob([wavData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    blobUrls.push(url);
    const howl = new Howl({ src: [url], format: ["wav"], preload: true, volume: 1.0 });
    howlMap.set(id, howl);
  } catch (error) {
    console.warn(`Failed to prerender sound: ${id}`, error);
  }
}

async function prerenderAllSounds(generation: number): Promise<void> {
  const entries = Object.entries(recipes) as [SoundEffectId, SynthRecipe][];
  await Promise.all(entries.map(([id, recipe]) => prerenderSound(id, recipe, generation)));
}

// --- Public API ---

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function initSoundService(): void {
  if (typeof window === "undefined") return;
  if (initialized) return;
  initialized = true;
  const generation = ++initGeneration;
  Howler.volume((currentVolume / 100) ** 2);
  prerenderAllSounds(generation).catch((error) => {
    console.warn("Failed to initialize some sounds", error);
  });
}

export function setSoundVolume(volume: number): void {
  if (!Number.isFinite(volume)) return;
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
  if (!id || currentVolume === 0 || prefersReducedMotion()) return;
  const howl = howlMap.get(id);
  if (!howl) return;
  howl.play();
}

export function boardMoveVariantToSoundId(
  variant: BoardMoveAnimationVariant,
): SoundEffectId | null {
  switch (variant) {
    case "ink-faceDown":
    case "ink-faceUp":
      return "ink";
    case "play-character":
      return "play-character";
    case "play-character-shift":
      return "play-character-shift";
    case "play-item":
      return "play-item";
    case "play-location":
      return "play-location";
    case "play-action":
    case "play-action-preview":
      return "play-action";
    case "play-action-sing":
      return "play-action-sing";
    case "move-to-location":
      return "move-to-location";
    case "banish":
      return "banish";
    default:
      return null;
  }
}

export function cardEffectKindToSoundId(kind: CardEffectKind): SoundEffectId {
  return kind;
}

export function overlayKindToSoundId(kind: OverlayAnnouncementKind): SoundEffectId {
  return kind;
}

// --- Sound recipes ---
// These target BaseAudioContext so they work with both AudioContext and OfflineAudioContext.

function createNoiseBuffer(ctx: BaseAudioContext, durationSec: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * durationSec);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function synthInk(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.15);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.4, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  noise.connect(filter).connect(env).connect(dest);
  noise.start(now);
  noise.stop(now + 0.15);
}

function synthPlayCharacter(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.001, now);
  env.gain.linearRampToValueAtTime(0.35, now + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
  osc.connect(env).connect(dest);
  osc.start(now);
  osc.stop(now + 0.3);
}

function synthPlayCharacterShift(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  // Shimmering morph — two detuned oscillators sweeping in opposite directions
  for (const dir of [1, -1]) {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(dir === 1 ? 330 : 440, now);
    osc.frequency.exponentialRampToValueAtTime(dir === 1 ? 440 : 330, now + 0.2);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.35);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.25, now + 0.02);
    env.gain.setValueAtTime(0.25, now + 0.15);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(env).connect(dest);
    osc.start(now);
    osc.stop(now + 0.35);
  }
  // Sparkle noise burst
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.12);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 5000;
  const noiseEnv = ctx.createGain();
  noiseEnv.gain.setValueAtTime(0.15, now + 0.08);
  noiseEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  noise.connect(filter).connect(noiseEnv).connect(dest);
  noise.start(now + 0.08);
  noise.stop(now + 0.2);
}

function synthPlayItem(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  for (let i = 0; i < 2; i++) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = i === 0 ? 523 : 659;
    const env = ctx.createGain();
    const offset = i * 0.08;
    env.gain.setValueAtTime(0.001, now + offset);
    env.gain.linearRampToValueAtTime(0.3, now + offset + 0.005);
    env.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);
    osc.connect(env).connect(dest);
    osc.start(now + offset);
    osc.stop(now + offset + 0.06);
  }
}

function synthPlayLocation(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  for (let detune = 0; detune <= 5; detune += 5) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 196;
    osc.detune.value = detune;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(0.25, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(env).connect(dest);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

function synthPlayAction(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.25);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(2000, now + 0.25);
  filter.Q.value = 2;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.3, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  noise.connect(filter).connect(env).connect(dest);
  noise.start(now);
  noise.stop(now + 0.25);
}

function synthPlayActionSing(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  // Musical ascending arpeggio — short melodic phrase (C5-E5-G5)
  const notes = [523.25, 659.25, 783.99];
  for (let i = 0; i < notes.length; i++) {
    const t = now + i * 0.1;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = notes[i];
    // Add gentle vibrato
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, t);
    env.gain.linearRampToValueAtTime(0.25, t + 0.02);
    env.gain.setValueAtTime(0.25, t + 0.08);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(env).connect(dest);
    osc.start(t);
    lfo.start(t);
    osc.stop(t + 0.18);
    lfo.stop(t + 0.18);
  }
}

function synthMoveToLocation(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(330, now);
  osc.frequency.exponentialRampToValueAtTime(294, now + 0.2);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.15, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(env).connect(dest);
  osc.start(now);
  osc.stop(now + 0.2);
}

function synthQuest(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  for (const freq of [880, 1760]) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const env = ctx.createGain();
    env.gain.setValueAtTime(freq === 880 ? 0.25 : 0.12, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(env).connect(dest);
    osc.start(now);
    osc.stop(now + 0.4);
  }
}

function synthChallenge(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.05);
  const noiseEnv = ctx.createGain();
  noiseEnv.gain.setValueAtTime(0.4, now);
  noiseEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  noise.connect(noiseEnv).connect(dest);
  noise.start(now);
  noise.stop(now + 0.05);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 80;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.35, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  osc.connect(env).connect(dest);
  osc.start(now);
  osc.stop(now + 0.1);
}

function synthChallengeHit(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  // Sharp crack on impact
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.04);
  const crack = ctx.createBiquadFilter();
  crack.type = "bandpass";
  crack.frequency.value = 500;
  crack.Q.value = 0.8;
  const crackEnv = ctx.createGain();
  crackEnv.gain.setValueAtTime(0.5, now);
  crackEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  noise.connect(crack).connect(crackEnv).connect(dest);
  noise.start(now);
  noise.stop(now + 0.04);
  // Sub thump for physical weight
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 60;
  const thumpEnv = ctx.createGain();
  thumpEnv.gain.setValueAtTime(0.4, now);
  thumpEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  osc.connect(thumpEnv).connect(dest);
  osc.start(now);
  osc.stop(now + 0.14);
}

function synthBanish(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  // Noise swept downward — card dissolving/swept away
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.28);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.exponentialRampToValueAtTime(120, now + 0.26);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.28, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
  noise.connect(filter).connect(env).connect(dest);
  noise.start(now);
  noise.stop(now + 0.26);
}

function synthTurnChange(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const notes = [392, 523];
  const durations = [0.12, 0.18];
  let offset = 0;
  for (let i = 0; i < notes.length; i++) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = notes[i];
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, now + offset);
    env.gain.linearRampToValueAtTime(0.3, now + offset + 0.005);
    env.gain.exponentialRampToValueAtTime(0.001, now + offset + durations[i]);
    osc.connect(env).connect(dest);
    osc.start(now + offset);
    osc.stop(now + offset + durations[i]);
    offset += durations[i];
  }
}

function synthConcede(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(110, now + 0.5);
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 600;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.2, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(filter).connect(env).connect(dest);
  osc.start(now);
  osc.stop(now + 0.5);
}

function synthMulligan(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  for (let i = 0; i < 4; i++) {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 0.02);
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 4000;
    const env = ctx.createGain();
    const offset = i * 0.04;
    env.gain.setValueAtTime(0.3, now + offset);
    env.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.02);
    noise.connect(filter).connect(env).connect(dest);
    noise.start(now + offset);
    noise.stop(now + offset + 0.02);
  }
}

function synthActivateAbility(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 1047;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.15;
  lfo.connect(lfoGain);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.25, now);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  lfoGain.connect(env.gain);
  osc.connect(env).connect(dest);
  osc.start(now);
  lfo.start(now);
  osc.stop(now + 0.2);
  lfo.stop(now + 0.2);
}

function synthSing(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 523;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 5;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 10;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.001, now);
  env.gain.linearRampToValueAtTime(0.3, now + 0.03);
  env.gain.setValueAtTime(0.3, now + 0.2);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(env).connect(dest);
  osc.start(now);
  lfo.start(now);
  osc.stop(now + 0.35);
  lfo.stop(now + 0.35);
}

function synthResolveEffect(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 659;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.001, now);
  env.gain.linearRampToValueAtTime(0.3, now + 0.005);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc.connect(env).connect(dest);
  osc.start(now);
  osc.stop(now + 0.15);
}

function synthVictory(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  // Ascending major arpeggio (C4-E4-G4-C5) then held chord
  const notes = [261.63, 329.63, 392.0, 523.25];
  const noteDur = 0.18;
  for (let i = 0; i < notes.length; i++) {
    const t = now + i * noteDur;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = notes[i];
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, t);
    env.gain.linearRampToValueAtTime(0.28, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, t + noteDur + 0.4);
    osc.connect(env).connect(dest);
    osc.start(t);
    osc.stop(t + noteDur + 0.45);
  }
  // Shimmer noise burst
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.8);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 6000;
  const noiseEnv = ctx.createGain();
  noiseEnv.gain.setValueAtTime(0.08, now);
  noiseEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  noise.connect(noiseFilter).connect(noiseEnv).connect(dest);
  noise.start(now);
  noise.stop(now + 0.8);
}

function synthDefeat(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  // Descending minor arpeggio
  const notes = [392.0, 329.63, 261.63, 196.0];
  const noteDur = 0.22;
  for (let i = 0; i < notes.length; i++) {
    const t = now + i * noteDur;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = notes[i];
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, t);
    env.gain.linearRampToValueAtTime(0.22, t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, t + noteDur + 0.3);
    osc.connect(filter).connect(env).connect(dest);
    osc.start(t);
    osc.stop(t + noteDur + 0.35);
  }
}

function synthMatchFound(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  // Bright ascending fanfare: G4 → B4 → D5 → G5 then sustained chord
  const notes = [392.0, 493.88, 587.33, 783.99];
  const noteDur = 0.14;
  for (let i = 0; i < notes.length; i++) {
    const t = now + i * noteDur;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = notes[i];
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, t);
    env.gain.linearRampToValueAtTime(0.3, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, t + noteDur + 0.5);
    osc.connect(env).connect(dest);
    osc.start(t);
    osc.stop(t + noteDur + 0.55);
  }
  // Held major chord (G4+B4+D5) for fullness
  const chordStart = now + notes.length * noteDur;
  for (const freq of [392.0, 493.88, 587.33]) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, chordStart);
    env.gain.linearRampToValueAtTime(0.15, chordStart + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.5);
    osc.connect(env).connect(dest);
    osc.start(chordStart);
    osc.stop(chordStart + 0.55);
  }
  // Shimmer
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 0.6);
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 6000;
  const noiseEnv = ctx.createGain();
  noiseEnv.gain.setValueAtTime(0.06, now);
  noiseEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  noise.connect(filter).connect(noiseEnv).connect(dest);
  noise.start(now);
  noise.stop(now + 0.6);
}

function synthClockTick(ctx: BaseAudioContext, dest: AudioNode, now: number): void {
  // Short, sharp clock tick — sine pulse with fast attack/decay
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.001, now);
  env.gain.linearRampToValueAtTime(0.45, now + 0.003);
  env.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
  osc.connect(env).connect(dest);
  osc.start(now);
  osc.stop(now + 0.08);
}
