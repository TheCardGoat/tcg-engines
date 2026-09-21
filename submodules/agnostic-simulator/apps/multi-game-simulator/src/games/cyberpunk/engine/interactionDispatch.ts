import type { InteractionSubmission } from "@tcg/protocol";
import type { EngineAction } from "../types/e2e";

export function interactionSubmissionToEngineAction(
  submission: InteractionSubmission,
  as?: NonNullable<Exclude<EngineAction, { type: "undo" | "undoToTurnStart" }>["as"]>,
): Exclude<EngineAction, { type: "undo" | "undoToTurnStart" }> | null {
  switch (submission.actionId) {
    case "playCard": {
      const attachToId = optionalString(submission, "attachToId");
      const paymentSourceIds = optionalStringArray(submission, "paymentSourceIds");
      return {
        type: "playCard",
        cardId: requireString(submission, "cardId"),
        as,
        ...(attachToId === undefined ? {} : { attachToId }),
        ...(paymentSourceIds === undefined ? {} : { paymentSourceIds }),
      };
    }
    case "sellCard":
    case "callLegend":
    case "goSolo": {
      const paymentSourceIds = optionalStringArray(submission, "paymentSourceIds");
      return {
        type: submission.actionId,
        cardId: requireString(submission, "cardId"),
        as,
        ...(paymentSourceIds === undefined ? {} : { paymentSourceIds }),
      };
    }
    case "resolveCardToPlay": {
      if (optionalBoolean(submission, "pass")) {
        return { type: "resolveCardToPlay", pass: true, as };
      }
      const attachToId = optionalString(submission, "attachToId");
      return {
        type: "resolveCardToPlay",
        cardId: requireString(submission, "cardId"),
        as,
        ...(attachToId === undefined ? {} : { attachToId }),
      };
    }
    case "resolveChooseEffect":
      return {
        type: "resolveChooseEffect",
        optionId: requireString(submission, "optionId"),
        as,
      };
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
        abilityIndex: requireAbilityIndex(submission),
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
      return optionalBoolean(submission, "pass")
        ? { type: "resolveAdjustGig", choice: { kind: "noAdjustment" }, as }
        : {
            type: "resolveAdjustGig",
            choice: {
              kind: "adjust",
              dieId: requireString(submission, "dieId"),
              value: requireNumber(submission, "value"),
            },
            as,
          };
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
    case "resolvePreventGigSteal": {
      if (optionalBoolean(submission, "pass")) {
        return { type: "resolvePreventGigSteal", dieIds: [], cardIds: [], pass: true, as };
      }
      const dieIds = requireStringArray(submission, "dieIds");
      const cardIds = requireStringArray(submission, "cardIds");
      if (dieIds.length !== cardIds.length) {
        throw new Error(
          `Interaction values "dieIds" and "cardIds" must have matching lengths (${dieIds.length} vs ${cardIds.length})`,
        );
      }
      return { type: "resolvePreventGigSteal", dieIds, cardIds, as };
    }
    case "resolveScry":
      return {
        type: "resolveScry",
        destinations: requireScryDestinations(submission),
        as,
      };
    case "resolveRevealDestination":
      return {
        type: "resolveRevealDestination",
        destination: requireRevealDestination(submission),
        as,
      };
    case "resolveCardTypeChoice":
      return { type: "resolveCardTypeChoice", cardType: requireCardType(submission), as };
    case "passPhase":
    case "mulligan":
    case "keepHand":
    case "concede":
    case "cancelPendingResolution":
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
    case "resolveRedirectDefeat": {
      const pass = optionalBoolean(submission, "pass");
      return { type: "resolveRedirectDefeat", as, ...(pass === undefined ? {} : { pass }) };
    }
    case "resolveSacrificialGear":
      return {
        type: "resolveSacrificialGear",
        cardId: requireString(submission, "cardId"),
        as,
      };
    case "resolveFirstPlayer": {
      return { type: "resolveFirstPlayer", as, goFirst: requireBoolean(submission, "goFirst") };
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

function requireRevealDestination(submission: InteractionSubmission): "hand" | "trash" {
  const value = requireString(submission, "destination");
  if (value !== "hand" && value !== "trash") {
    throw new Error("Expected reveal destination to be 'hand' or 'trash'");
  }
  return value;
}

function requireCardType(
  submission: InteractionSubmission,
): "legend" | "unit" | "gear" | "program" {
  const value = requireString(submission, "cardType");
  if (value !== "legend" && value !== "unit" && value !== "gear" && value !== "program") {
    throw new Error("Expected card type to be 'legend', 'unit', 'gear', or 'program'");
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

// abilityIndex is declared as an option-selection input whose option ids are
// String(index), so validated submissions carry the string form.
function requireAbilityIndex(submission: InteractionSubmission): number {
  const value = submission.values["abilityIndex"];
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 0) return parsed;
  }
  throw new Error(`Expected non-negative integer interaction value 'abilityIndex'`);
}

function optionalBoolean(submission: InteractionSubmission, key: string): boolean | undefined {
  const value = submission.values[key];
  return typeof value === "boolean" ? value : undefined;
}

function requireBoolean(submission: InteractionSubmission, key: string): boolean {
  const value = optionalBoolean(submission, key);
  if (value === undefined) {
    throw new Error(`Expected boolean interaction value '${key}'`);
  }
  return value;
}

/**
 * List-typed interaction values arrive as arrays from modal flows and as a
 * scalar when the input allows a single pick (the shared interaction panel
 * submits `ids[0]` for max-1 entity selections). Accept both so a legal
 * single-pick draft is never silently dropped.
 */
function requireStringArray(submission: InteractionSubmission, key: string): string[] {
  const value = submission.values[key];
  if (typeof value === "string") return [value];
  if (Array.isArray(value) && value.every((entry) => typeof entry === "string")) return value;
  throw new Error(`Expected string or string-array interaction value '${key}'`);
}

function optionalStringArray(submission: InteractionSubmission, key: string): string[] | undefined {
  return submission.values[key] === undefined ? undefined : requireStringArray(submission, key);
}

function requireScryDestinations(
  submission: InteractionSubmission,
): Array<{ zone: string; cardIds: string[] }> {
  const value = submission.values.destinations;
  if (Array.isArray(value)) {
    return value.map((entry, index) => {
      if (!entry || typeof entry !== "object") {
        throw new Error(`Expected object interaction value 'destinations[${index}]'`);
      }
      const destination = entry as { zone?: unknown; cardIds?: unknown };
      if (typeof destination.zone !== "string") {
        throw new Error(`Expected string interaction value 'destinations[${index}].zone'`);
      }
      if (
        !Array.isArray(destination.cardIds) ||
        !destination.cardIds.every((cardId) => typeof cardId === "string")
      ) {
        throw new Error(`Expected string-array interaction value 'destinations[${index}].cardIds'`);
      }
      return { zone: destination.zone, cardIds: destination.cardIds };
    });
  }
  // Panel submissions for optional (min 0) scries may omit selectedCardIds
  // entirely; treat the absent key as an explicit empty pick instead of
  // dropping the submission (mirrors the server adapter's tolerant read).
  const selectedCardIds = submission.values.selectedCardIds;
  return [
    {
      zone: optionalString(submission, "destinationZone") ?? "hand",
      cardIds:
        selectedCardIds === undefined ? [] : requireStringArray(submission, "selectedCardIds"),
    },
  ];
}
