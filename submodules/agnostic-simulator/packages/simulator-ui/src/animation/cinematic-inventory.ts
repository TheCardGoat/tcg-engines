import type { CinematicStyle } from "@tcg/protocol/animations";

export interface CinematicInventoryItem {
  readonly id: CinematicStyle;
  readonly category: string;
  readonly title: string;
  readonly description: string;
  readonly durationMs: number;
}

/** Shared visual vocabulary. No card identities, game rules, or competitor assets. */
export const CINEMATIC_INVENTORY = [
  {
    id: "projectile",
    category: "Targeting",
    title: "Projectile",
    description: "One moving point, a trail, then a local impact.",
    durationMs: 700,
  },
  {
    id: "volley",
    category: "Targeting",
    title: "Volley",
    description:
      "Three staggered arcs converge on each target. Particle count does not imply damage.",
    durationMs: 950,
  },
  {
    id: "beam",
    category: "Targeting",
    title: "Beam",
    description: "A continuous connection draws from source to target.",
    durationMs: 700,
  },
  {
    id: "chain",
    category: "Targeting",
    title: "Chain",
    description: "A segmented connection visits targets in supplied order.",
    durationMs: 1000,
  },
  {
    id: "burst",
    category: "Impact",
    title: "Radial burst",
    description: "Eight short rays expand from the target.",
    durationMs: 600,
  },
  {
    id: "wave",
    category: "Area",
    title: "Expanding wave",
    description: "Three rings spread from an area anchor.",
    durationMs: 1000,
  },
  {
    id: "sweep",
    category: "Area",
    title: "Lateral sweep",
    description: "A soft band crosses an area anchor.",
    durationMs: 900,
  },
  {
    id: "shield",
    category: "Protection",
    title: "Shield",
    description: "An outline forms around each protected target.",
    durationMs: 800,
  },
  {
    id: "tether",
    category: "Protection",
    title: "Tether",
    description: "A temporary dashed connection links source and targets.",
    durationMs: 1000,
  },
  {
    id: "drain",
    category: "Recovery",
    title: "Drain",
    description: "A point returns from each target to the source.",
    durationMs: 850,
  },
  {
    id: "heal",
    category: "Recovery",
    title: "Recovery",
    description: "Three small plus signs rise from each target.",
    durationMs: 850,
  },
  {
    id: "aura",
    category: "Protection",
    title: "Aura",
    description: "Concentric rings pulse locally, then clear.",
    durationMs: 1000,
  },
  {
    id: "dissolve",
    category: "Card state",
    title: "Dissolve particles",
    description: "A fixed grid of fragments rises and fades. Pair with a transfer for removal.",
    durationMs: 900,
  },
  {
    id: "summon",
    category: "Card state",
    title: "Arrival rings",
    description: "Rings converge at the destination. Pair with a transfer for arrival.",
    durationMs: 900,
  },
] as const satisfies readonly CinematicInventoryItem[];
