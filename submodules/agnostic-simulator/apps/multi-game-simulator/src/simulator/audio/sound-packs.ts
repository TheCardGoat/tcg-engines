import type { SimulatorAudioCueId } from "@tcg/protocol";

export const SIMULATOR_SOUND_PACKS = [
  {
    id: "original",
    label: "Original",
    description: "The current compact synthesized cues.",
    delivery: "generated",
  },
  {
    id: "tabletop",
    label: "Tabletop",
    description: "Paper, wood, dice, and restrained metal impacts.",
    delivery: "cdn",
  },
  {
    id: "arcane",
    label: "Arcane",
    description: "Soft resonant sweeps, bells, and magical energy.",
    delivery: "cdn",
  },
  {
    id: "kinetic",
    label: "Kinetic",
    description: "Fast, punchy feedback with a modern game feel.",
    delivery: "cdn",
  },
] as const;

export type SimulatorSoundPack = (typeof SIMULATOR_SOUND_PACKS)[number];
export type SimulatorSoundPackId = SimulatorSoundPack["id"];

const SOUND_PACK_CDN_BASE = (
  import.meta.env.VITE_SIMULATOR_SOUND_ASSET_BASE ??
  "https://cdn.tcg.online/public/audio/simulator/v1"
).replace(/\/$/, "");

export function simulatorSoundAssetUrl(
  packId: Exclude<SimulatorSoundPackId, "original">,
  cue: SimulatorAudioCueId,
): string {
  return `${SOUND_PACK_CDN_BASE}/${packId}/${cue}.wav`;
}
