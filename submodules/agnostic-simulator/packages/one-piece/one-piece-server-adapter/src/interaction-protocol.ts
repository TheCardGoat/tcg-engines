import type {
  PlayerView,
  ProjectedActionCandidate,
  ProjectedDecision,
  ProjectedDecisionKind,
  ProjectedDecisionStep,
  ProjectedEntityCandidate,
} from "@tcg/op-engine";
import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityCandidate,
  type EntityKind,
  type EntityRef,
  type InteractionAction,
  type InteractionInput,
  type InteractionOption,
  type InteractionSubmission,
} from "@tcg/protocol";

type NativePayload = Record<string, unknown>;

export function buildOnePieceInteractionView(input: {
  actorId: string;
  seat: string;
  stateVersion: number;
  playerView: PlayerView;
}): EngineInteractionView {
  const actions: InteractionAction[] = [];

  for (const decision of input.playerView.decisions) {
    if (decision.actorId !== input.seat) continue;

    if (decision.kind === "chooseAction") {
      for (const step of decision.steps) {
        if (step.kind !== "chooseAction") continue;
        for (const candidate of step.actions) {
          actions.push({
            id: candidate.id,
            requestId: requestId(input.stateVersion, candidate.id),
            intent: intentForCommandType(candidate.commandType),
            text: { key: candidate.label },
            enabled: true,
            ...(candidate.source ? { source: toEntityRef(candidate.source) } : {}),
            inputs: inputsForActionCandidate(candidate),
          });
        }
      }
    } else {
      const step = decision.steps[0];
      if (!step) continue;
      actions.push({
        id:
          decision.submit.commandType === "resolvePrompt"
            ? "resolvePrompt"
            : decision.submit.commandType,
        requestId: requestId(input.stateVersion, decision.id),
        intent: intentForDecisionKind(decision.kind),
        text: { key: decision.title },
        enabled: true,
        inputs: inputsForStep(step),
      });
    }
  }

  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "one-piece",
    actorId: input.actorId,
    stateVersion: input.stateVersion,
    status: determineStatus(input.playerView),
    actions,
  };
}

export function onePieceSubmissionToPayload(submission: InteractionSubmission): {
  moveType: string;
  payload: NativePayload;
} {
  if (submission.actionId === "resolvePrompt" || submission.actionId === "judgeResolvePrompt") {
    // Extract promptId from requestId format: one-piece:{stateVersion}:{promptId}
    const parts = submission.requestId.split(":");
    const promptId = parts.length >= 3 ? parts.slice(2).join(":") : "";

    const values = submission.values;
    const payload: NativePayload = { promptId };
    const selectionFieldCount = [
      values.selection !== undefined,
      values.cost !== undefined,
      values.order !== undefined,
    ].filter(Boolean).length;
    if (selectionFieldCount > 1) {
      throw new Error("Only one of selection, cost, or order may be provided");
    }

    // Map generic interaction input keys to engine command fields. Prompt steps expose one
    // selection-like input at a time; malformed submissions are rejected above.
    if (values.selection !== undefined) {
      if (typeof values.selection === "string") {
        payload.optionId = values.selection;
      } else if (Array.isArray(values.selection)) {
        payload.selectedIds = values.selection.filter((id): id is string => typeof id === "string");
      }
    } else if (values.cost !== undefined) {
      payload.selectedIds = stringSelectionValues(values.cost);
    } else if (values.order !== undefined) {
      payload.selectedIds = stringSelectionValues(values.order);
    }
    if (values.confirm === true || values.confirm === false) {
      payload.confirm = values.confirm;
    }

    return { moveType: submission.actionId, payload };
  }

  return {
    moveType: commandTypeFromActionId(submission.actionId),
    payload: payloadForActionSubmission(submission),
  };
}

function stringSelectionValues(value: InteractionSubmission["values"][string]): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.filter((id): id is string => typeof id === "string");
  return [];
}

function commandTypeFromActionId(actionId: string): string {
  const separatorIndex = actionId.indexOf(":");
  return separatorIndex === -1 ? actionId : actionId.slice(0, separatorIndex);
}

function payloadForActionSubmission(submission: InteractionSubmission): NativePayload {
  const values = submission.values;
  const payload: NativePayload = { ...values };

  for (const key of ["instanceId", "targetId", "attackerId", "sourceInstanceId"] as const) {
    const value = values[key];
    if (Array.isArray(value)) {
      const [selectedId] = value.filter((id): id is string => typeof id === "string");
      if (selectedId) payload[key] = selectedId;
    }
  }

  if (typeof values.slotIndex === "string") {
    const slotIndex = Number.parseInt(values.slotIndex, 10);
    if (Number.isInteger(slotIndex)) payload.slotIndex = slotIndex;
  } else if (Array.isArray(values.slotIndex)) {
    const [selectedSlot] = values.slotIndex.filter((id): id is string => typeof id === "string");
    const slotIndex = selectedSlot === undefined ? Number.NaN : Number.parseInt(selectedSlot, 10);
    if (Number.isInteger(slotIndex)) payload.slotIndex = slotIndex;
  }

  return payload;
}

function determineStatus(playerView: PlayerView): EngineInteractionView["status"] {
  if (playerView.status === "finished") return "game-over";
  if (playerView.decisions.some((d: ProjectedDecision) => d.kind !== "chooseAction"))
    return "choosing";
  if (playerView.decisions.some((d: ProjectedDecision) => d.kind === "chooseAction"))
    return "ready";
  return "waiting";
}

function intentForCommandType(commandType: string): InteractionAction["intent"] {
  switch (commandType) {
    case "playCard":
      return "play-card";
    case "attachDon":
      return "resource-card";
    case "declareAttack":
      return "attack";
    case "activateEffect":
      return "activate";
    case "endTurn":
      return "pass";
    case "mulligan":
      return "mulligan";
    case "resolvePrompt":
    case "judgeResolvePrompt":
      return "choose-option";
    default:
      return "custom";
  }
}

function intentForDecisionKind(kind: ProjectedDecisionKind): InteractionAction["intent"] {
  switch (kind) {
    case "selectTargets":
    case "selectCards":
      return "choose-targets";
    case "chooseOption":
      return "choose-option";
    case "payCost":
      return "choose-targets";
    case "orderItems":
      return "order-cards";
    case "confirm":
      return "choose-option";
    case "respond":
      return "choose-option";
    case "resolveStep":
      return "choose-option";
    default:
      return "custom";
  }
}

const VALID_ENTITY_KINDS: readonly EntityKind[] = [
  "card",
  "player",
  "zone",
  "resource",
  "die",
  "effect",
];

function toEntityKind(kind: string): EntityKind {
  if (VALID_ENTITY_KINDS.includes(kind as EntityKind)) {
    return kind as EntityKind;
  }
  return "card";
}

function toEntityRef(ref: ProjectedEntityCandidate["ref"]): EntityRef {
  return {
    kind: toEntityKind(ref.kind),
    instanceId: ref.id,
    ...(ref.ownerId ? { ownerId: ref.ownerId } : {}),
    ...(ref.zoneId ? { zoneId: ref.zoneId } : {}),
  };
}

function entityCandidateForRef(ref: ProjectedEntityCandidate["ref"]): EntityCandidate {
  return {
    entity: toEntityRef(ref),
    enabled: true,
  };
}

function inputsForActionCandidate(candidate: ProjectedActionCandidate): InteractionInput[] {
  const inputs: InteractionInput[] = [];

  switch (candidate.commandType) {
    case "playCard":
      if (candidate.source) {
        inputs.push(singleEntityInput("instanceId", "source", candidate.source, candidate.label));
      }
      if (candidate.slotChoices && candidate.slotChoices.length > 0) {
        inputs.push(slotChoiceInput(candidate.slotChoices));
      }
      break;
    case "attachDon":
      if (candidate.source) {
        inputs.push(singleEntityInput("targetId", "target", candidate.source, candidate.label));
      }
      break;
    case "declareAttack":
      if (candidate.source) {
        inputs.push(singleEntityInput("attackerId", "attacker", candidate.source, candidate.label));
      }
      if (candidate.targets && candidate.targets.length > 0) {
        inputs.push(
          entitySelectionInput("targetId", "defender", candidate.targets, "Choose attack target"),
        );
      }
      break;
    case "activateEffect":
      if (candidate.source) {
        inputs.push(
          singleEntityInput("sourceInstanceId", "source", candidate.source, candidate.label),
        );
      }
      break;
  }

  return inputs;
}

function singleEntityInput(
  id: string,
  role: Extract<InteractionInput, { kind: "entity-selection" }>["role"],
  ref: ProjectedEntityCandidate["ref"],
  label: string,
): InteractionInput {
  return entitySelectionInput(id, role, [ref], label);
}

function entitySelectionInput(
  id: string,
  role: Extract<InteractionInput, { kind: "entity-selection" }>["role"],
  refs: readonly ProjectedEntityCandidate["ref"][],
  label: string,
): InteractionInput {
  return {
    kind: "entity-selection",
    id,
    text: { key: label },
    required: true,
    role,
    entityKinds: ["card"],
    min: 1,
    max: 1,
    ordered: false,
    candidates: refs.map(entityCandidateForRef),
  };
}

function slotChoiceInput(slotChoices: readonly number[]): InteractionInput {
  return {
    kind: "option-selection",
    id: "slotIndex",
    text: { key: "Choose a slot" },
    required: true,
    min: 1,
    max: 1,
    options: slotChoices.map((slotIndex) => ({
      id: String(slotIndex),
      text: { key: `Slot ${slotIndex + 1}` },
      enabled: true,
    })),
  };
}

function inputsForStep(step: ProjectedDecisionStep): InteractionInput[] {
  switch (step.kind) {
    case "chooseOption": {
      const options: InteractionOption[] = step.options.map(
        (option: { id: string; label: string }) => ({
          id: option.id,
          text: { key: option.label },
          enabled: true,
        }),
      );
      if (options.length === 0) return [];
      return [
        {
          kind: "option-selection",
          id: "selection",
          text: { key: step.label },
          required: step.min > 0,
          min: step.min,
          max: step.max,
          options,
        },
      ];
    }
    case "selectEntity": {
      const candidates: EntityCandidate[] = step.candidates.map(
        (candidate: ProjectedEntityCandidate) => ({
          entity: {
            kind: toEntityKind(candidate.ref.kind),
            instanceId: candidate.ref.id,
            ...(candidate.ref.ownerId ? { ownerId: candidate.ref.ownerId } : {}),
            ...(candidate.ref.zoneId ? { zoneId: candidate.ref.zoneId } : {}),
          },
          enabled: candidate.legal,
        }),
      );
      return [
        {
          kind: "entity-selection",
          id: "selection",
          text: { key: step.label },
          required: step.min > 0,
          role: step.role === "target" ? "target" : "source",
          entityKinds: step.entityKinds.includes("card") ? ["card"] : ["card"],
          min: step.min,
          max: step.max,
          ordered: false,
          candidates,
        },
      ];
    }
    case "confirm": {
      return [
        {
          kind: "boolean",
          id: "confirm",
          text: { key: step.label },
          required: true,
          trueText: { key: step.confirmLabel },
          falseText: { key: step.cancelLabel },
        },
      ];
    }
    case "payCost": {
      const candidates: EntityCandidate[] = step.candidates.map(
        (candidate: ProjectedEntityCandidate) => ({
          entity: {
            kind: toEntityKind(candidate.ref.kind),
            instanceId: candidate.ref.id,
          },
          enabled: candidate.legal,
        }),
      );
      return [
        {
          kind: "entity-selection",
          id: "cost",
          text: { key: step.label },
          required: step.min > 0,
          role: "cost",
          entityKinds: step.entityKinds.includes("card") ? ["card"] : ["card"],
          min: step.min,
          max: step.max,
          ordered: false,
          candidates,
        },
      ];
    }
    case "orderItems": {
      const candidates: EntityCandidate[] = step.candidates.map(
        (candidate: ProjectedEntityCandidate) => ({
          entity: {
            kind: toEntityKind(candidate.ref.kind),
            instanceId: candidate.ref.id,
          },
          enabled: candidate.legal,
        }),
      );
      return [
        {
          kind: "ordering",
          id: "order",
          text: { key: step.label },
          required: step.min > 0,
          entityKind: "card",
          min: step.min,
          max: step.max,
          candidates,
        },
      ];
    }
    case "chooseAction":
      return [];
    default:
      return [];
  }
}

function requestId(stateVersion: number, id: string): string {
  return `one-piece:${stateVersion}:${id}`;
}
