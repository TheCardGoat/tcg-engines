import { formatForDisplay } from "@tanstack/svelte-hotkeys";
import type {
  ExecutableMovePresentationCategoryId,
  LorcanaCardSnapshot,
} from "@/features/simulator/model/contracts.js";

// Keyboard rows are mapped to physical zones so the muscle memory matches
// where the cards visually sit on a QWERTY keyboard:
//
//   Row 1 (1234567890)  → your hand (the cards you're holding)
//   Row 2 (qwertyuiop)  → your play area
//   Row 3 (asdfghjkl;)  → opponent's play area
//   Row 4 (zxcvbnm,./)  → opponent's hand (only when an effect targets it)
export const HAND_CARD_HOTKEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const;
export const PLAY_CARD_HOTKEYS = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"] as const;
export const OPPONENT_PLAY_HOTKEYS = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"] as const;
export const OPPONENT_HAND_HOTKEYS = ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"] as const;

export type SimulatorHotkeyKind = "global" | "move" | "card";
export type SimulatorHotkeyCardZone = "your-hand" | "your-play" | "opponent-play" | "opponent-hand";

// Layers exist so we never bind the same key to two actions at once. Only
// descriptors whose layer matches the currently-active gameplay context are
// emitted as `enabled: true`; everything else is dropped from the registry so
// badges and key handlers disappear in lockstep.
export type SimulatorHotkeyLayer = "global" | "idle-browse" | "action-menu" | "selecting";

export interface SimulatorHotkeyDescriptor {
  id: string;
  hotkey: string;
  label: string;
  kind: SimulatorHotkeyKind;
  layer: SimulatorHotkeyLayer;
  enabled: boolean;
  execute: () => void;
  cardId?: string;
  categoryId?: ExecutableMovePresentationCategoryId;
  cardZone?: SimulatorHotkeyCardZone;
}

export interface SimulatorCardHotkeyBinding {
  hotkey: string;
  card: LorcanaCardSnapshot;
}

export function getFormattedHotkeyParts(hotkey: string): string[] {
  const formatted = formatForDisplay(hotkey);
  if (formatted.includes(" + ")) {
    return formatted.split(" + ");
  }

  return [formatted];
}

export function assignCardHotkeys(
  cards: readonly LorcanaCardSnapshot[],
  hotkeys: readonly string[],
): SimulatorCardHotkeyBinding[] {
  return hotkeys.flatMap((hotkey, index) => {
    const card = cards[index];
    return card ? [{ hotkey, card }] : [];
  });
}
