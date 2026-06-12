import type { Component } from "svelte";
import {
  Droplets,
  Footprints,
  Hand,
  MapPinned,
  Music4,
  OctagonX,
  SkipForward,
  Sparkles,
  Swords,
  Undo,
  Users,
  Zap,
} from "@lucide/svelte";
import type {
  CardActionCategoryId,
  ExecutableMovePresentationCategoryId,
} from "@/features/simulator/model/contracts.js";

export type SimulatorActionIconComponent = Component<{ class?: string }>;

const moveCategoryIconById = {
  "activate-ability": Zap,
  "alter-hand": Undo,
  "choose-first-player": Hand,
  challenge: Swords,
  concede: OctagonX,
  "ink-card": Droplets,
  "keep-hand": Hand,
  "move-to-location": MapPinned,
  "pass-turn": SkipForward,
  "play-card": Sparkles,
  quest: Footprints,
  "quest-all": Users,
  "shift-card": Sparkles,
  "sing-card": Music4,
  undo: Undo,
  unknown: Sparkles,
} satisfies Record<ExecutableMovePresentationCategoryId, SimulatorActionIconComponent>;

export function getMoveCategoryIcon(
  categoryId: ExecutableMovePresentationCategoryId,
): SimulatorActionIconComponent {
  return moveCategoryIconById[categoryId] ?? Sparkles;
}

export function getCardActionCategoryIcon(
  categoryId: CardActionCategoryId,
): SimulatorActionIconComponent {
  return getMoveCategoryIcon(categoryId);
}
