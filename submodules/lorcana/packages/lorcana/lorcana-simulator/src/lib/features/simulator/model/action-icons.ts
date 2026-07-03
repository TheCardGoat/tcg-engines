import type { Component } from "svelte";
import Droplets from "@lucide/svelte/icons/droplets";
import Footprints from "@lucide/svelte/icons/footprints";
import Hand from "@lucide/svelte/icons/hand";
import MapPinned from "@lucide/svelte/icons/map-pinned";
import Music4 from "@lucide/svelte/icons/music-4";
import OctagonX from "@lucide/svelte/icons/octagon-x";
import SkipForward from "@lucide/svelte/icons/skip-forward";
import Sparkles from "@lucide/svelte/icons/sparkles";
import Swords from "@lucide/svelte/icons/swords";
import Undo from "@lucide/svelte/icons/undo";
import Users from "@lucide/svelte/icons/users";
import Zap from "@lucide/svelte/icons/zap";
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
