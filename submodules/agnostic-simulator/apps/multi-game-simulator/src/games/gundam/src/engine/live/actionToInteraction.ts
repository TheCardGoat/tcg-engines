import type { MoveName, PartialInput } from "../../game/types.ts";
import {
  buildInteractionSubmissionForActionId,
  type EngineInteractionView,
  type InteractionSubmission,
  type InteractionSubmissionValue,
} from "@tcg/protocol";

export function moveToInteractionSubmission(
  move: MoveName,
  partialInput: PartialInput,
  view: EngineInteractionView | undefined,
): InteractionSubmission | null {
  if (!view) {
    return null;
  }
  return buildInteractionSubmissionForActionId({
    view,
    actionId: move,
    values: flattenPartialInput(partialInput),
  });
}

function flattenPartialInput(input: PartialInput): Record<string, InteractionSubmissionValue> {
  const values: Record<string, InteractionSubmissionValue> = {};
  for (const [key, value] of Object.entries(input)) {
    if (key === "optionalAnswers" || key === "chooseOneAnswers") {
      flattenIndexedAnswers(values, key, value);
      continue;
    }
    if (key === "deckLookAnswers") {
      flattenDeckLookAnswers(values, value);
      continue;
    }
    const protocolValue = toProtocolValue(value);
    if (protocolValue !== undefined) {
      values[key] = protocolValue;
    }
  }
  return values;
}

function flattenIndexedAnswers(
  values: Record<string, InteractionSubmissionValue>,
  prefix: string,
  value: unknown,
): void {
  if (!isRecord(value)) return;
  for (const [index, answer] of Object.entries(value)) {
    const protocolValue = toProtocolValue(answer);
    if (protocolValue !== undefined) {
      values[`${prefix}.${index}`] = protocolValue;
    }
  }
}

function flattenDeckLookAnswers(
  values: Record<string, InteractionSubmissionValue>,
  value: unknown,
): void {
  if (!isRecord(value)) return;
  for (const [index, answer] of Object.entries(value)) {
    if (!isRecord(answer)) continue;
    for (const [field, nested] of Object.entries(answer)) {
      const protocolValue = toProtocolValue(nested);
      if (protocolValue !== undefined) {
        values[`deckLookAnswers.${index}.${field}`] = protocolValue;
      }
    }
  }
}

function toProtocolValue(value: unknown): InteractionSubmissionValue | undefined {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
