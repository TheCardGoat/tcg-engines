import type { DeepReadonly, PlayerId } from "#core";
import type { LorcanaMatchState, LorcanaProjectedBoardView } from "../types";

import type { AutomatedActionBoardSnapshot } from "./types";

function normalizeStableValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeStableValue(entry));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const orderedEntries = Object.entries(value as Record<string, unknown>)
    .filter(([key]) => key !== "_stateID")
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, entryValue]) => [key, normalizeStableValue(entryValue)] as const);

  return Object.fromEntries(orderedEntries);
}

function stableStringify(value: unknown): string {
  return JSON.stringify(normalizeStableValue(value));
}

function hashDeterministically(value: string): string {
  let hashA = 0xdeadbeef ^ value.length;
  let hashB = 0x41c6ce57 ^ value.length;

  for (let index = 0; index < value.length; index += 1) {
    const codePoint = value.charCodeAt(index);
    hashA = Math.imul(hashA ^ codePoint, 2654435761);
    hashB = Math.imul(hashB ^ codePoint, 1597334677);
  }

  hashA =
    Math.imul(hashA ^ (hashA >>> 16), 2246822507) ^ Math.imul(hashB ^ (hashB >>> 13), 3266489909);
  hashB =
    Math.imul(hashB ^ (hashB >>> 16), 2246822507) ^ Math.imul(hashA ^ (hashA >>> 13), 3266489909);

  return `${(hashB >>> 0).toString(16).padStart(8, "0")}${(hashA >>> 0).toString(16).padStart(8, "0")}`;
}

function getOrderedPlayerIds(board: LorcanaProjectedBoardView): PlayerId[] {
  if (board.playerOrder.length > 0) {
    return [...board.playerOrder] as PlayerId[];
  }

  return Object.keys(board.players).sort() as PlayerId[];
}

function buildCountRecord(
  board: LorcanaProjectedBoardView,
  readCount: (playerBoard: LorcanaProjectedBoardView["players"][PlayerId] | undefined) => number,
): Readonly<Record<PlayerId, number>> {
  return getOrderedPlayerIds(board).reduce<Record<PlayerId, number>>(
    (counts, playerId) => {
      counts[playerId] = readCount(board.players[playerId]);
      return counts;
    },
    {} as Record<PlayerId, number>,
  );
}

export function computeAutomatedActionStateFingerprint(
  state: DeepReadonly<LorcanaMatchState> | LorcanaMatchState,
): string {
  return hashDeterministically(stableStringify(state));
}

export function createAutomatedActionBoardSnapshot(args: {
  board: LorcanaProjectedBoardView;
  state: DeepReadonly<LorcanaMatchState> | LorcanaMatchState;
}): AutomatedActionBoardSnapshot {
  const { board, state } = args;

  return {
    bagCount: state.G.triggeredAbilities.bag.items?.length ?? 0,
    boardCounts: buildCountRecord(board, (playerBoard) => playerBoard?.play.length ?? 0),
    handCounts: buildCountRecord(board, (playerBoard) => playerBoard?.hand.length ?? 0),
    inkCounts: buildCountRecord(board, (playerBoard) => playerBoard?.inkwell.length ?? 0),
    loreTotals: buildCountRecord(board, (playerBoard) => playerBoard?.lore ?? 0),
    pendingEffectCount: state.G.pendingEffects?.length ?? 0,
    stateFingerprint: computeAutomatedActionStateFingerprint(state),
  };
}
