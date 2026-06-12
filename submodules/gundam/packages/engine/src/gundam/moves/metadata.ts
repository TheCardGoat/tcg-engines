/**
 * Gundam TCG — Move Metadata Registry
 *
 * Static, UI-facing metadata for every move in `gundamMoves`. Consumers (web
 * UI, CLI, bots) read this to render human-readable labels, categorize moves,
 * and bind keyboard shortcuts without hardcoding strings.
 *
 * Drift from the move registry is guarded by a test that asserts every key in
 * `gundamMoves` has a metadata entry (and vice versa).
 */

export type GundamMoveCategory = "setup" | "play" | "ability" | "combat" | "pass" | "utility";

export interface GundamMoveMetadata {
  readonly id: string;
  readonly label: string;
  readonly category: GundamMoveCategory;
  readonly hotkey?: string;
  readonly isPassMove?: boolean;
}

export const GUNDAM_MOVE_METADATA: Readonly<Record<string, GundamMoveMetadata>> = {
  chooseFirstPlayer: {
    id: "chooseFirstPlayer",
    label: "Choose First Player",
    category: "setup",
  },
  alterHand: {
    id: "alterHand",
    label: "Mulligan",
    category: "setup",
  },
  deployUnit: {
    id: "deployUnit",
    label: "Deploy Unit",
    category: "play",
    hotkey: "d",
  },
  deployBase: {
    id: "deployBase",
    label: "Deploy Base",
    category: "play",
    hotkey: "b",
  },
  playCommand: {
    id: "playCommand",
    label: "Play Command",
    category: "play",
    hotkey: "c",
  },
  activateAbility: {
    id: "activateAbility",
    label: "Activate Ability",
    category: "ability",
    hotkey: "a",
  },
  assignPilot: {
    id: "assignPilot",
    label: "Pair Pilot",
    category: "play",
    hotkey: "p",
  },
  playCommandAsPilot: {
    id: "playCommandAsPilot",
    label: "Pair as Pilot",
    category: "play",
  },
  declareBlock: {
    id: "declareBlock",
    label: "Declare Block",
    category: "combat",
    hotkey: "x",
  },
  enterBattle: {
    id: "enterBattle",
    label: "Attack",
    category: "combat",
    hotkey: "e",
  },
  passBlock: {
    id: "passBlock",
    label: "Pass Block",
    category: "combat",
    hotkey: "n",
    isPassMove: true,
  },
  passBattleAction: {
    id: "passBattleAction",
    label: "Pass Battle Action",
    category: "combat",
    hotkey: "m",
    isPassMove: true,
  },
  discardToHandLimit: {
    id: "discardToHandLimit",
    label: "Discard to Hand Limit",
    category: "utility",
  },
  passTurn: {
    id: "passTurn",
    label: "End Turn",
    category: "pass",
    hotkey: "Space",
    isPassMove: true,
  },
  passActionStep: {
    id: "passActionStep",
    label: "Pass Action Step",
    category: "pass",
    hotkey: "Shift+Space",
    isPassMove: true,
  },
  concede: {
    id: "concede",
    label: "Concede",
    category: "utility",
  },
  skipOpponentTurn: {
    id: "skipOpponentTurn",
    label: "Skip Opponent",
    category: "utility",
  },
  dropOpponent: {
    id: "dropOpponent",
    label: "Drop Opponent",
    category: "utility",
  },
  resolveEffect: {
    id: "resolveEffect",
    label: "Resolve Effect",
    category: "utility",
    hotkey: "r",
  },
};

export function getMoveMetadata(moveId: string): GundamMoveMetadata | undefined {
  return GUNDAM_MOVE_METADATA[moveId];
}
