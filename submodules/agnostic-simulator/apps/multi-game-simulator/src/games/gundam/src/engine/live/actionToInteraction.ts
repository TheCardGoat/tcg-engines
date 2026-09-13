import type { MoveName, PartialInput } from "../../game/types.ts";
import {
  buildInteractionSubmissionForActionId,
  type EngineInteractionView,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmission,
  type InteractionSubmissionValue,
} from "@tcg/protocol";

import { assignInteractionTargets } from "../../game/selectors/interactionTargetAssignment.ts";

export function moveToInteractionSubmission(
  move: MoveName,
  partialInput: PartialInput,
  view: EngineInteractionView | undefined,
): InteractionSubmission | null {
  if (!view) {
    return null;
  }
  const action = view.actions.find((candidate) => candidate.id === move && candidate.enabled);
  if (!action) return null;
  return buildInteractionSubmissionForActionId({
    view,
    actionId: move,
    values: flattenPartialInput(partialInput, action),
    ...(partialInput.automatic === true
      ? { automation: { kind: "no-valid-action" as const } }
      : {}),
  });
}

function flattenPartialInput(
  input: PartialInput,
  action: InteractionAction,
): Record<string, InteractionSubmissionValue> {
  const values: Record<string, InteractionSubmissionValue> = {};
  const inputsById = new Map(
    action.inputs.map((interactionInput) => [interactionInput.id, interactionInput]),
  );

  const nativeTargets = stringArray(input.targets);
  const targetPartition = inputsById.get("targetPartition");
  if (nativeTargets && targetPartition?.kind === "entity-partition") {
    values.targetPartition = { targets: [...nativeTargets] };
  }
  const targetGroups = action.inputs
    .flatMap((interactionInput) => {
      const match = /^targetGroups\.(\d+)$/.exec(interactionInput.id);
      if (!match || interactionInput.kind !== "entity-selection") return [];
      return [
        {
          order: Number(match[1]),
          inputId: interactionInput.id,
          targetIds: interactionInput.candidates
            .filter((candidate) => candidate.enabled)
            .map((candidate) => candidate.entity.instanceId),
          minTargets: interactionInput.min,
          maxTargets: interactionInput.max,
        },
      ];
    })
    .toSorted((a, b) => a.order - b.order);
  if (nativeTargets && targetGroups.length > 0) {
    const assignment = assignInteractionTargets(nativeTargets, targetGroups);
    if (!assignment) {
      throw new Error("Selected targets do not satisfy the published target groups.");
    }
    targetGroups.forEach((group, index) => {
      values[group.inputId] = [...(assignment[index] ?? [])];
    });
  }

  for (const [key, value] of Object.entries(input)) {
    if (key === "optionalAnswers" || key === "chooseOneAnswers") {
      flattenIndexedAnswers(values, inputsById, key, value);
      continue;
    }
    if (key === "deckLookAnswers") {
      flattenDeckLookAnswers(values, inputsById, value);
      continue;
    }
    if (key === "targets" && (targetGroups.length > 0 || targetPartition)) continue;
    const publishedInput = inputsById.get(key);
    if (!publishedInput) continue;
    const protocolValue = toProtocolValue(value, publishedInput);
    if (protocolValue !== undefined) {
      values[key] = protocolValue;
    }
  }
  return values;
}

function flattenIndexedAnswers(
  values: Record<string, InteractionSubmissionValue>,
  inputsById: ReadonlyMap<string, InteractionInput>,
  prefix: string,
  value: unknown,
): void {
  if (!isRecord(value)) return;
  for (const [index, answer] of Object.entries(value)) {
    const inputId = `${prefix}.${index}`;
    const publishedInput = inputsById.get(inputId);
    if (!publishedInput) continue;
    const protocolValue = toProtocolValue(answer, publishedInput);
    if (protocolValue !== undefined) {
      values[inputId] = protocolValue;
    }
  }
}

function flattenDeckLookAnswers(
  values: Record<string, InteractionSubmissionValue>,
  inputsById: ReadonlyMap<string, InteractionInput>,
  value: unknown,
): void {
  if (!isRecord(value)) return;
  for (const [index, answer] of Object.entries(value)) {
    if (!isRecord(answer)) continue;
    const inputId = `deckLookAnswers.${index}`;
    const publishedInput = inputsById.get(inputId);
    if (publishedInput?.kind !== "entity-partition") continue;
    const routeIds = new Set(publishedInput.routes.map((route) => route.id));
    const partition = Object.fromEntries(
      Object.entries(answer).flatMap(([field, nested]) => {
        if (!routeIds.has(field)) return [];
        if (field === "tutorCardId" && typeof nested === "string") return [[field, [nested]]];
        return Array.isArray(nested) && nested.every((item) => typeof item === "string")
          ? [[field, nested]]
          : [];
      }),
    );
    values[inputId] = partition;
  }
}

function toProtocolValue(
  value: unknown,
  input: InteractionInput,
): InteractionSubmissionValue | undefined {
  if (input.kind === "option-selection" && typeof value === "number") {
    return String(value);
  }
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

function stringArray(value: unknown): readonly string[] | undefined {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
