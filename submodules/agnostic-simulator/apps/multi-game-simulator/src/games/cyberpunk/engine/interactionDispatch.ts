import type { InteractionSubmission } from "@tcg/protocol";
import type { EngineAction } from "../types/e2e";

export function interactionSubmissionToEngineAction(
  submission: InteractionSubmission,
  as?: NonNullable<Exclude<EngineAction, { type: "undo" | "undoToTurnStart" }>["as"]>,
): Exclude<EngineAction, { type: "undo" | "undoToTurnStart" }> | null {
  switch (submission.actionId) {
    case "playCard": {
      const attachToId = optionalString(submission, "attachToId");
      return {
        type: "playCard",
        cardId: requireString(submission, "cardId"),
        as,
        ...(attachToId === undefined ? {} : { attachToId }),
      };
    }
    case "sellCard":
    case "callLegend":
    case "goSolo":
    case "resolveCardToPlay":
      return { type: submission.actionId, cardId: requireString(submission, "cardId"), as };
    case "attackUnit":
      return {
        type: "attackUnit",
        attackerId: requireString(submission, "attackerId"),
        defenderId: requireString(submission, "defenderId"),
        as,
      };
    case "attackRival":
      return { type: "attackRival", attackerId: requireString(submission, "attackerId"), as };
    case "useBlocker":
      return { type: "useBlocker", blockerId: requireString(submission, "blockerId"), as };
    case "activateAbility":
      return {
        type: "activateAbility",
        cardId: requireString(submission, "cardId"),
        abilityIndex: requireNumber(submission, "abilityIndex"),
        as,
      };
    case "resolveAttack": {
      const pass = optionalBoolean(submission, "pass");
      return { type: "resolveAttack", as, ...(pass === undefined ? {} : { pass }) };
    }
    case "resolveStealGigs":
      return { type: "resolveStealGigs", dieIds: requireStringArray(submission, "dieIds"), as };
    case "resolveTrigger": {
      const triggerId = optionalString(submission, "triggerId");
      const pass = optionalBoolean(submission, "pass");
      return {
        type: "resolveTrigger",
        as,
        ...(triggerId === undefined ? {} : { triggerId }),
        ...(pass === undefined ? {} : { pass }),
      };
    }
    case "resolveAdjustGig":
      return { type: "resolveAdjustGig", value: requireNumber(submission, "value"), as };
    case "resolveEffectTarget":
      if (optionalBoolean(submission, "pass")) {
        return { type: "resolveEffectTarget", pass: true, as };
      }
      return {
        type: "resolveEffectTarget",
        targetIds: requireStringArray(submission, "targetIds"),
        as,
      };
    case "resolveDiscardFromHand":
      if (optionalBoolean(submission, "pass")) {
        return { type: "resolveDiscardFromHand", pass: true, as };
      }
      return {
        type: "resolveDiscardFromHand",
        cardIds: requireStringArray(submission, "cardIds"),
        as,
      };
    case "resolveSearchDeck":
      return {
        type: "resolveSearchDeck",
        selectedCardIds: requireStringArray(submission, "selectedCardIds"),
        as,
      };
    case "passPhase":
    case "mulligan":
    case "keepHand":
    case "concede":
      return { type: submission.actionId, as };
    case "gainGig":
      return { type: "gainGig", dieId: requireString(submission, "dieId"), as };
    case "resolveCardToMove": {
      const cardId = optionalString(submission, "cardId");
      const pass = optionalBoolean(submission, "pass");
      return {
        type: "resolveCardToMove",
        as,
        ...(cardId === undefined ? {} : { cardId }),
        ...(pass === undefined ? {} : { pass }),
      };
    }
    default:
      return null;
  }
}

function requireString(submission: InteractionSubmission, key: string): string {
  const value = submission.values[key];
  if (typeof value !== "string") {
    throw new Error(`Expected string interaction value '${key}'`);
  }
  return value;
}

function optionalString(submission: InteractionSubmission, key: string): string | undefined {
  const value = submission.values[key];
  return typeof value === "string" ? value : undefined;
}

function requireNumber(submission: InteractionSubmission, key: string): number {
  const value = submission.values[key];
  if (typeof value !== "number") {
    throw new Error(`Expected number interaction value '${key}'`);
  }
  return value;
}

function optionalBoolean(submission: InteractionSubmission, key: string): boolean | undefined {
  const value = submission.values[key];
  return typeof value === "boolean" ? value : undefined;
}

function requireStringArray(submission: InteractionSubmission, key: string): string[] {
  const value = submission.values[key];
  if (!Array.isArray(value) || !value.every((entry) => typeof entry === "string")) {
    throw new Error(`Expected string-array interaction value '${key}'`);
  }
  return value;
}
