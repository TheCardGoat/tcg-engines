import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityCandidate,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmission,
} from "@tcg/protocol";
import {
  enumerateAvailableMovesDetailed,
  getMoveProcedure,
  seedPrimaryCardInput,
  selectTargetInputBinding,
  type AvailableMove,
  type GundamMoveName,
  type MatchState,
  type MatchStaticResources,
  type MoveStepOption,
  type PendingChoicePrompt,
  type PlayerId,
} from "@tcg/gundam-engine";

type SelectModeStep = Extract<MoveStepOption, { kind: "selectMode" }>;

type NativePayload = Record<string, unknown>;
export type GundamInteractionPayload = Readonly<Record<string, unknown>>;
export type GundamPendingChoice = PendingChoicePrompt;
export type GundamPendingMoveStep = MoveStepOption;

export function describeGundamInteractionProcedure(input: {
  state: MatchState;
  staticResources: MatchStaticResources;
  actorId: string;
  moveName: GundamMoveName;
  payload: GundamInteractionPayload;
}): readonly GundamPendingMoveStep[] {
  return (
    getMoveProcedure(
      input.state,
      input.staticResources,
      input.actorId as PlayerId,
      input.moveName,
      input.payload,
    ) ?? [{ kind: "confirm" }]
  );
}

export function seedGundamInteractionSource(
  moveName: GundamMoveName,
  cardId: string,
): GundamInteractionPayload {
  return seedPrimaryCardInput(moveName, cardId);
}

export function gundamTargetInputBinding(
  moveName: GundamMoveName,
  step: GundamPendingMoveStep,
): { key: string; multi: boolean } {
  if (step.kind !== "selectTarget") {
    return { key: step.kind, multi: false };
  }
  return selectTargetInputBinding(moveName, step);
}

export function buildGundamInteractionView(input: {
  actorId: string;
  stateVersion: number;
  state: MatchState;
  staticResources: MatchStaticResources;
  pendingChoice: PendingChoicePrompt | undefined;
}): EngineInteractionView {
  const actions =
    input.pendingChoice === undefined
      ? enumerateAvailableMovesDetailed(
          input.state,
          input.actorId as PlayerId,
          input.staticResources,
        ).map((move) => actionFromAvailableMove(move, input))
      : [actionFromPendingChoice(input.pendingChoice, input.stateVersion)];

  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "gundam",
    actorId: input.actorId,
    stateVersion: input.stateVersion,
    status: input.state.ctx.status.gameEnded
      ? "game-over"
      : input.pendingChoice === undefined
        ? actions.length > 0
          ? "ready"
          : "waiting"
        : "choosing",
    actions,
  };
}

export function gundamSubmissionToPayload(submission: InteractionSubmission): {
  moveType: string;
  payload: NativePayload;
} {
  if (submission.actionId === "resolveEffect") {
    return { moveType: "resolveEffect", payload: resolveEffectPayload(submission) };
  }

  const moveName = submission.actionId as GundamMoveName;
  const cardId = optionalString(submission, "cardId");
  const seeded = cardId === undefined ? {} : seedPrimaryCardInput(moveName, cardId);
  return { moveType: submission.actionId, payload: { ...seeded, ...targetPayload(submission) } };
}

function actionFromAvailableMove(
  move: AvailableMove,
  input: {
    actorId: string;
    stateVersion: number;
    state: MatchState;
    staticResources: MatchStaticResources;
  },
): InteractionAction {
  const baseInput = move.requiresCardSelection
    ? [entityInput("cardId", "source", "card", { min: 1, max: 1 }, move.selectableCardIds)]
    : [];
  const procedureInputs = move.requiresCardSelection
    ? []
    : inputsFromProcedure(
        move.moveName,
        getMoveProcedure(
          input.state,
          input.staticResources,
          input.actorId as PlayerId,
          move.moveName,
          {},
        ) ?? [],
      );

  return {
    id: move.moveName,
    requestId: requestId(input.stateVersion, move.moveName),
    intent: intentForMove(move.moveName),
    text: { key: `gundam.move.${move.moveName}` },
    enabled: !move.requiresCardSelection || move.selectableCardIds.length > 0,
    inputs: [...baseInput, ...procedureInputs],
  };
}

function actionFromPendingChoice(
  choice: PendingChoicePrompt,
  stateVersion: number,
): InteractionAction {
  switch (choice.kind) {
    case "targetSelection":
      return resolveEffectAction(stateVersion, choice.effectId, "choose-targets", [
        pendingEffectInput(choice.effectId),
        entityInput(
          "targets",
          "target",
          "card",
          { min: choice.minTargets, max: choice.maxTargets },
          choice.legalTargetIds,
        ),
      ]);
    case "optional":
      return resolveEffectAction(stateVersion, choice.effectId, "choose-option", [
        pendingEffectInput(choice.effectId),
        {
          kind: "boolean",
          id: `optionalAnswers.${choice.directiveIndex}`,
          text: { key: "gundam.choice.optional", params: { prompt: choice.prompt } },
          required: true,
          trueText: { key: "gundam.choice.yes" },
          falseText: { key: "gundam.choice.no" },
        },
      ]);
    case "chooseOne":
      return resolveEffectAction(stateVersion, choice.effectId, "choose-option", [
        pendingEffectInput(choice.effectId),
        {
          kind: "option-selection",
          id: `chooseOneAnswers.${choice.directiveIndex}`,
          text: { key: "gundam.choice.chooseOne", params: { prompt: choice.prompt } },
          required: true,
          min: 1,
          max: 1,
          options: choice.options.map((option) => ({
            id: String(option.index),
            text: { key: "gundam.choice.option", params: { label: option.label } },
            enabled: true,
          })),
        },
      ]);
    case "ordering":
      return resolveEffectAction(stateVersion, choice.effectId, "choose-option", [
        {
          kind: "option-selection",
          id: "pendingEffectId",
          text: { key: "gundam.choice.ordering", params: { prompt: choice.prompt } },
          required: true,
          min: 1,
          max: 1,
          options: choice.candidateEffectIds.map((effectId) => ({
            id: effectId,
            text: { key: "gundam.choice.effect", params: { effectId } },
            enabled: true,
          })),
        },
      ]);
    case "deckLook":
      return resolveEffectAction(stateVersion, choice.effectId, "order-cards", [
        pendingEffectInput(choice.effectId),
        {
          kind: "ordering",
          id: `deckLookAnswers.${choice.directiveIndex}.order`,
          text: { key: "gundam.choice.deckLook", params: { prompt: choice.prompt } },
          required: true,
          entityKind: "card",
          min: 0,
          max: choice.revealedCardIds.length,
          candidates: choice.revealedCardIds.map((instanceId) => ({
            entity: { kind: "card", instanceId },
            enabled: true,
          })),
        },
      ]);
  }
}

function inputsFromProcedure(
  moveName: GundamMoveName,
  steps: readonly MoveStepOption[],
): InteractionInput[] {
  return steps.flatMap((step, index): InteractionInput[] => {
    switch (step.kind) {
      case "confirm":
        return [];
      case "selectCost":
        return [
          entityInput(
            `cost.${index}`,
            "cost",
            "resource",
            { min: 1, max: step.candidateIds.length },
            step.candidateIds,
          ),
        ];
      case "selectMode":
        return [
          {
            kind: "option-selection",
            id: `mode.${index}`,
            text: { key: `gundam.move.${moveName}.mode` },
            required: true,
            min: 1,
            max: 1,
            options: step.modes.map((mode: SelectModeStep["modes"][number]) => ({
              id: mode.id,
              text: { key: "gundam.mode", params: { label: mode.label } },
              enabled: true,
            })),
          },
        ];
      case "selectTarget": {
        const binding = selectTargetInputBinding(moveName, step);
        return [
          entityInput(
            binding.key,
            step.role === "attackTarget" ? "defender" : "target",
            "card",
            { min: step.minTargets, max: step.maxTargets },
            step.candidateIds,
          ),
        ];
      }
      default:
        return [];
    }
  });
}

function resolveEffectAction(
  stateVersion: number,
  effectId: string,
  intent: InteractionAction["intent"],
  inputs: InteractionInput[],
): InteractionAction {
  return {
    id: "resolveEffect",
    requestId: requestId(stateVersion, `resolveEffect:${effectId}`),
    intent,
    text: { key: "gundam.move.resolveEffect" },
    enabled: true,
    inputs,
  };
}

function pendingEffectInput(effectId: string): InteractionInput {
  return {
    kind: "option-selection",
    id: "pendingEffectId",
    text: { key: "gundam.choice.pendingEffect" },
    required: true,
    min: 1,
    max: 1,
    options: [
      { id: effectId, text: { key: "gundam.choice.effect", params: { effectId } }, enabled: true },
    ],
  };
}

function entityInput(
  id: string,
  role: "source" | "target" | "defender" | "cost",
  kind: EntityCandidate["entity"]["kind"],
  limit: { min: number; max: number },
  ids: readonly string[],
): InteractionInput {
  return {
    kind: "entity-selection",
    id,
    text: { key: `gundam.input.${id}` },
    required: limit.min > 0,
    role,
    entityKinds: [kind],
    min: limit.min,
    max: limit.max,
    ordered: false,
    candidates: ids.map((instanceId) => ({ entity: { kind, instanceId }, enabled: true })),
  };
}

function targetPayload(submission: InteractionSubmission): NativePayload {
  const payload: NativePayload = {};
  for (const [key, value] of Object.entries(submission.values)) {
    if (key === "cardId") continue;
    if (key.startsWith("mode.")) payload.mode = value;
    else if (key.startsWith("cost.")) payload.cost = value;
    else payload[key] = value;
  }
  return payload;
}

function resolveEffectPayload(submission: InteractionSubmission): NativePayload {
  const payload: NativePayload = {
    pendingEffectId: requireString(submission, "pendingEffectId"),
  };
  const targets = optionalStringArray(submission, "targets");
  if (targets !== undefined) payload.targets = targets;

  for (const [key, value] of Object.entries(submission.values)) {
    if (key.startsWith("optionalAnswers.")) {
      const index = key.slice("optionalAnswers.".length);
      payload.optionalAnswers = { ...asRecord(payload.optionalAnswers), [index]: value };
    }
    if (key.startsWith("chooseOneAnswers.")) {
      const index = key.slice("chooseOneAnswers.".length);
      const num = Number(value);
      if (!Number.isNaN(num)) {
        payload.chooseOneAnswers = { ...asRecord(payload.chooseOneAnswers), [index]: num };
      }
    }
    if (key.startsWith("deckLookAnswers.")) {
      const parts = key.slice("deckLookAnswers.".length).split(".");
      const [indexStr, field, ...rest] = parts;
      if (indexStr && field && /^\d+$/.test(indexStr) && rest.length === 0) {
        const current = asRecord(payload.deckLookAnswers);
        const answer = asRecord(current[indexStr]);
        payload.deckLookAnswers = {
          ...current,
          [indexStr]: {
            ...answer,
            [field]: value,
          },
        };
      }
    }
  }
  return payload;
}

function asRecord(value: NativePayload[string]): NativePayload {
  return isRecord(value) ? value : {};
}

function isRecord(value: NativePayload[string]): value is NativePayload {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function intentForMove(moveName: GundamMoveName): InteractionAction["intent"] {
  if (moveName === "deployUnit" || moveName === "deployBase" || moveName === "playCommand")
    return "play-card";
  if (moveName === "assignPilot" || moveName === "playCommandAsPilot") return "move-card";
  if (moveName === "enterBattle" || moveName === "declareBlock") return "attack";
  if (moveName === "activateAbility") return "activate";
  if (
    moveName === "passTurn" ||
    moveName === "passBlock" ||
    moveName === "passBattleAction" ||
    moveName === "passActionStep"
  )
    return "pass";
  if (moveName === "concede") return "concede";
  if (moveName === "chooseFirstPlayer" || moveName === "alterHand") return "choose-option";
  return "custom";
}

function requestId(stateVersion: number, id: string): string {
  return `gundam:${stateVersion}:${id}`;
}

function optionalString(submission: InteractionSubmission, key: string): string | undefined {
  const value = submission.values[key];
  return typeof value === "string" ? value : undefined;
}

function requireString(submission: InteractionSubmission, key: string): string {
  const value = optionalString(submission, key);
  if (value === undefined) throw new Error(`Interaction value "${key}" must be a string.`);
  return value;
}

function optionalStringArray(submission: InteractionSubmission, key: string): string[] | undefined {
  const value = submission.values[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Interaction value "${key}" must be a string array.`);
  }
  return value;
}
