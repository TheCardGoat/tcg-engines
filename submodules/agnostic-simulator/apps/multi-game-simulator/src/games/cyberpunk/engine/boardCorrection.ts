import type { EngineAction } from "../types/e2e";

export const MANUAL_ENGINE_ACTION_TYPES = [
  "manualSetGigValue",
  "manualMoveGig",
  "manualMoveCard",
  "manualAttachGear",
  "manualDetachGear",
  "manualExertCard",
  "manualReadyCard",
  "manualDrawCard",
  "manualClearPendingResolution",
  "manualResetCombat",
  "manualForcePassTurn",
  "manualSetEddies",
  "manualResetOncePerTurn",
  "manualSetCardFace",
  "manualReadyAll",
  "manualRecomputeActiveEffects",
  "manualDropEffectBagEntry",
  "rewindToTurnStart",
] as const;

export type ManualEngineAction = Extract<
  EngineAction,
  { type: (typeof MANUAL_ENGINE_ACTION_TYPES)[number] }
>;

const MANUAL_ENGINE_ACTION_TYPE_SET = new Set<string>(MANUAL_ENGINE_ACTION_TYPES);

export function isManualEngineAction(action: EngineAction): action is ManualEngineAction {
  return MANUAL_ENGINE_ACTION_TYPE_SET.has(action.type);
}

export function manualActionPayload(action: ManualEngineAction): Record<string, unknown> {
  switch (action.type) {
    case "manualSetGigValue":
      return { dieId: action.dieId, value: action.value };
    case "manualMoveGig":
      return { dieId: action.dieId, toPlayerId: action.toPlayerId, location: action.location };
    case "manualMoveCard":
      return {
        cardId: action.cardId,
        toZone: action.toZone,
        ...(action.trashPosition ? { trashPosition: action.trashPosition } : {}),
      };
    case "manualAttachGear":
      return { gearId: action.gearId, hostId: action.hostId };
    case "manualDetachGear":
      return { gearId: action.gearId };
    case "manualExertCard":
    case "manualReadyCard":
      return { cardId: action.cardId };
    case "manualDrawCard":
      return { from: action.from, playerId: action.playerId };
    case "manualClearPendingResolution":
      return { scope: action.scope };
    case "manualResetCombat":
    case "manualForcePassTurn":
    case "manualRecomputeActiveEffects":
    case "manualResetOncePerTurn":
    case "manualReadyAll":
    case "rewindToTurnStart":
      return {};
    case "manualSetEddies":
      return {
        ...(action.playerId ? { playerId: action.playerId } : {}),
        amount: action.amount,
      };
    case "manualSetCardFace":
      return { cardId: action.cardId, faceDown: action.faceDown };
    case "manualDropEffectBagEntry":
      return { entryId: action.entryId };
  }
}

export const MANUAL_CARD_ZONE_TARGETS = [
  { zone: "hand", label: "Hand" },
  { zone: "field", label: "Field" },
  { zone: "eddieArea", label: "Eddie" },
  { zone: "trash", label: "Trash" },
  { zone: "legendArea", label: "Legends" },
] as const;

export const MANUAL_DECK_MOVE_TARGETS = [
  { position: "top", label: "Deck (top)" },
  { position: "bottom", label: "Deck (bottom)" },
] as const;

export const MANUAL_GIG_FACE_MAX = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
} as const;
