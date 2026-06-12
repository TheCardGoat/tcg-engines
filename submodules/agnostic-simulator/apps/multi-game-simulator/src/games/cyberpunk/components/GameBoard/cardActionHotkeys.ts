import type { MoveId } from "../../engine";

export type CardActionHotkeyMoveId = Extract<
  MoveId,
  | "sellCard"
  | "playCard"
  | "callLegend"
  | "goSolo"
  | "attackUnit"
  | "attackRival"
  | "useBlocker"
  | "activateAbility"
>;

interface CardActionHotkeySlot {
  readonly moveId: CardActionHotkeyMoveId;
  readonly label: string;
  readonly hotkey: string;
}

export const CARD_ACTION_HOTKEY_SLOTS = [
  { moveId: "playCard", label: "Play", hotkey: "1" },
  { moveId: "callLegend", label: "Call Legend", hotkey: "2" },
  { moveId: "goSolo", label: "Go Solo", hotkey: "3" },
  { moveId: "attackUnit", label: "Attack Unit", hotkey: "4" },
  { moveId: "attackRival", label: "Attack Rival", hotkey: "5" },
  { moveId: "useBlocker", label: "Block", hotkey: "6" },
  { moveId: "activateAbility", label: "Ability", hotkey: "7" },
  { moveId: "sellCard", label: "Sell", hotkey: "8" },
] as const satisfies readonly CardActionHotkeySlot[];

const CARD_ACTION_HOTKEY_MOVE_IDS = new Set<string>(
  CARD_ACTION_HOTKEY_SLOTS.map((slot) => slot.moveId),
);

export function isCardActionHotkeyMoveId(moveId: string): moveId is CardActionHotkeyMoveId {
  return CARD_ACTION_HOTKEY_MOVE_IDS.has(moveId);
}

export function getCardActionLabel(moveId: CardActionHotkeyMoveId): string {
  return CARD_ACTION_HOTKEY_SLOTS.find((slot) => slot.moveId === moveId)?.label ?? moveId;
}

export function getCardActionHotkey(moveId: CardActionHotkeyMoveId): string {
  return CARD_ACTION_HOTKEY_SLOTS.find((slot) => slot.moveId === moveId)?.hotkey ?? "";
}
