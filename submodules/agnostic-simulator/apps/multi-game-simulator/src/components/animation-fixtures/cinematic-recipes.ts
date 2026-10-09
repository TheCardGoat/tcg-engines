import { SCENE_RECIPES } from "./scene-recipes";
import type { AnimationPlanV2, AnimationStepV2 } from "@tcg/protocol/animations";
import { CINEMATIC_INVENTORY } from "@tcg/simulator-ui";

const source = { kind: "entity", id: "cinematic-source" } as const;
const target = { kind: "entity", id: "cinematic-target" } as const;
const other = { kind: "entity", id: "cinematic-other" } as const;
const from = { kind: "zone", id: "cinematic-origin" } as const;
const to = { kind: "zone", id: "cinematic-destination" } as const;
const center = { kind: "anchor", id: "simulator:board-center" } as const;

export interface CinematicRecipe {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly steps: readonly AnimationStepV2[];
  readonly moved?: boolean;
  readonly exited?: readonly string[];
  readonly hidden?: boolean;
  readonly rotation?: number;
}

const transfer: AnimationStepV2 = {
  id: "transfer",
  type: "entityTransfer",
  entity: source,
  from,
  to,
  sourceFace: "public",
  destinationFace: "public",
  durationMs: 600,
};

export const CINEMATIC_RECIPES: readonly CinematicRecipe[] = [
  ...SCENE_RECIPES,
  {
    id: "move",
    title: "Card transfer",
    category: "Movement",
    description: "Move one identity between registered zones.",
    moved: true,
    steps: [transfer],
  },
  {
    id: "reveal-move",
    title: "Draw and reveal",
    category: "Movement",
    description: "Travel from an anonymous back to a public destination.",
    moved: true,
    steps: [{ ...transfer, sourceFace: "hidden" }],
  },
  {
    id: "hide-move",
    title: "Conceal and move",
    category: "Movement",
    description: "Transfer into a hidden destination without retaining its face.",
    moved: true,
    hidden: true,
    steps: [{ ...transfer, destinationFace: "hidden" }],
  },
  {
    id: "copy",
    title: "Copy transfer",
    category: "Movement",
    description: "Keep the source visible while a visual copy travels.",
    steps: [{ ...transfer, sourcePresentation: "copy", destinationPresentation: "overlay" }],
  },
  {
    id: "underlay",
    title: "Attach underneath",
    category: "Movement",
    description: "Land beneath the destination layer.",
    moved: true,
    steps: [{ ...transfer, destinationPresentation: "underlay" }],
  },
  {
    id: "rotate",
    title: "Rotate in place",
    category: "Card state",
    description: "Rotate the same card by 90 degrees.",
    rotation: 90,
    steps: [
      {
        id: "rotate",
        type: "entityStateChange",
        entity: source,
        at: source,
        change: "orientation",
        sourceFace: "public",
        destinationFace: "public",
        fromRotationDeg: 0,
        toRotationDeg: 90,
        durationMs: 400,
      },
    ],
  },
  {
    id: "flip",
    title: "Conceal in place",
    category: "Card state",
    description: "Turn the public face into a hidden back.",
    hidden: true,
    steps: [
      {
        id: "flip",
        type: "entityStateChange",
        entity: source,
        at: source,
        change: "face",
        sourceFace: "public",
        destinationFace: "hidden",
        durationMs: 600,
      },
    ],
  },
  {
    id: "pulse",
    title: "Local pulse",
    category: "Emphasis",
    description: "Brief feedback at one registered card.",
    steps: [{ id: "pulse", type: "emphasize", at: target, style: "pulse", durationMs: 600 }],
  },
  {
    id: "spotlight",
    title: "Spotlight",
    category: "Emphasis",
    description: "Draw attention to one location.",
    steps: [
      { id: "spotlight", type: "emphasize", at: target, style: "spotlight", durationMs: 900 },
    ],
  },
  {
    id: "connection",
    title: "Effect connection",
    category: "Targeting",
    description: "The existing default effect arrow.",
    steps: [
      {
        id: "connection",
        type: "effect",
        source,
        targets: [target],
        showText: false,
        durationMs: 800,
      },
    ],
  },
  ...CINEMATIC_INVENTORY.map((item): CinematicRecipe => ({
    ...item,
    steps: [
      {
        id: item.id,
        type: "effect",
        cinematic: item.id,
        source,
        targets:
          item.category === "Area" ? [center] : item.id === "chain" ? [target, other] : [target],
        tone: item.category === "Recovery" ? "positive" : "neutral",
        showText: false,
        durationMs: item.durationMs,
      },
    ],
  })),
  {
    id: "source-reveal",
    title: "Staged source card",
    category: "Emphasis",
    description: "Stage the viewer-safe source while its effect connects.",
    steps: [
      {
        id: "source-reveal",
        type: "effect",
        source,
        targets: [target],
        presentation: "source-card",
        sourceFace: "public",
        label: "Source effect",
        durationMs: 1200,
      },
    ],
  },
  {
    id: "combat",
    title: "Combat exchange",
    category: "Impact",
    description: "Use the existing shared combat presentation.",
    steps: [
      {
        id: "combat",
        type: "combat",
        source,
        target,
        reason: "resolved",
        showText: false,
        durationMs: 1000,
      },
    ],
  },
  {
    id: "gain",
    title: "Value gain",
    category: "Recovery",
    description: "A positive value rises at its owner.",
    steps: [
      {
        id: "gain",
        type: "valueDelta",
        subject: target,
        delta: 2,
        fromValue: 3,
        toValue: 5,
        tone: "positive",
        durationMs: 800,
      },
    ],
  },
  {
    id: "loss",
    title: "Value loss",
    category: "Impact",
    description: "A negative value rises at its owner.",
    steps: [
      {
        id: "loss",
        type: "valueDelta",
        subject: target,
        delta: -2,
        fromValue: 5,
        toValue: 3,
        tone: "negative",
        durationMs: 800,
      },
    ],
  },
  {
    id: "turn",
    title: "Turn announcement",
    category: "Announcements",
    description: "Announce a turn without moving board entities.",
    steps: [
      {
        id: "turn",
        type: "phaseChange",
        from: "Opponent turn",
        to: "Your turn",
        variant: "turn",
        turnNumber: 2,
        durationMs: 1000,
      },
    ],
  },
  {
    id: "phase",
    title: "Phase announcement",
    category: "Announcements",
    description: "Announce a phase boundary.",
    steps: [
      {
        id: "phase",
        type: "phaseChange",
        from: "Start",
        to: "Main",
        variant: "phase",
        durationMs: 800,
      },
    ],
  },
  ...(["shuffle", "die", "coin", "selection"] as const).map((kind): CinematicRecipe => ({
    id: kind,
    title: `Randomization: ${kind}`,
    category: "Announcements",
    description: "Present an engine-resolved random result; the renderer does not roll.",
    steps: [
      {
        id: kind,
        type: "randomization",
        kind,
        at: target,
        resultLabel: kind === "die" ? "4" : kind === "coin" ? "Heads" : "Ready",
        durationMs: 900,
      },
    ],
  })),
  {
    id: "comparison",
    title: "Value comparison",
    category: "Announcements",
    description: "Show two public values and their resolved outcome.",
    steps: [
      {
        id: "comparison",
        type: "comparison",
        title: "Comparison",
        participants: [
          { entity: source, label: "Source", valueLabel: "4", tone: "winner" },
          { entity: target, label: "Target", valueLabel: "2", tone: "loser" },
        ],
        resultLabel: "Source wins",
        durationMs: 1200,
      },
    ],
  },
  {
    id: "result",
    title: "Game result",
    category: "Announcements",
    description: "Show a terminal result.",
    steps: [
      {
        id: "result",
        type: "gameResult",
        outcome: "draw",
        reasonLabel: "Fixture complete",
        durationMs: 1200,
      },
    ],
  },
  {
    id: "sequence",
    title: "Arrival → effect → recovery",
    category: "Sequences",
    description: "One timeline: transfer, arrival rings, projectile, then value feedback.",
    moved: true,
    steps: [
      transfer,
      {
        id: "arrival",
        type: "effect",
        cinematic: "summon",
        targets: [to],
        startAtMs: 450,
        durationMs: 650,
        showText: false,
      },
      {
        id: "shot",
        type: "effect",
        cinematic: "projectile",
        source: to,
        targets: [target],
        startAtMs: 1000,
        durationMs: 700,
        showText: false,
      },
      { id: "pause", type: "hold", startAtMs: 1700, durationMs: 150 },
      {
        id: "recovery",
        type: "valueDelta",
        subject: target,
        delta: 2,
        tone: "positive",
        startAtMs: 1850,
        durationMs: 650,
      },
    ],
  },
];

export function cinematicFixturePlan(recipe: CinematicRecipe, id: string): AnimationPlanV2 {
  return { id, version: 2, steps: [...recipe.steps] };
}
