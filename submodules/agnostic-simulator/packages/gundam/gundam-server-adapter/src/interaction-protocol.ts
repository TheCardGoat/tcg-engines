import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityCandidate,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmission,
  type InteractionText,
} from "@tcg/protocol";
import {
  enumerateAvailableMovesDetailed,
  getMoveProcedure,
  seedPrimaryCardInput,
  selectModeInputBinding,
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
type SelectTargetStep = Extract<MoveStepOption, { kind: "selectTarget" }>;
type EntitySelectionRole = Extract<InteractionInput, { kind: "entity-selection" }>["role"];
type InputRequirement = NonNullable<InteractionInput["requiredWhen"]>[number];

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

export function gundamTargetInteractionRole(step: SelectTargetStep): EntitySelectionRole {
  if (step.role === "attackTarget") return "defender";
  if (step.role === "cost") return "cost";
  return "target";
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
  return {
    moveType: submission.actionId,
    payload: { ...seeded, ...targetPayload(moveName, submission) },
  };
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
  const interactionInputs = move.requiresCardSelection
    ? stagedInputsFromAvailableMove(move, input)
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
    inputs: interactionInputs,
  };
}

/**
 * Publish the complete input surface collected by the simulator's staged
 * card workflow. The chosen source card is not sufficient by itself: moves
 * such as activateAbility still need an effect index and a cost target before
 * the native command is legal. Follow-up inputs are published as conditional
 * while candidates are merged, then promoted back to required when every
 * selectable source/branch needs that input. This keeps a flat, game-agnostic
 * action honest for single-branch cases without falsely requiring inputs that
 * only some cards or modes use.
 */
function stagedInputsFromAvailableMove(
  move: AvailableMove,
  input: {
    actorId: string;
    state: MatchState;
    staticResources: MatchStaticResources;
  },
): InteractionInput[] {
  const discovered: InteractionInput[] = [];
  const paths: InteractionInput[][] = [];
  const modeBinding = selectModeInputBinding(move.moveName);

  for (const cardId of move.selectableCardIds) {
    const seed = seedPrimaryCardInput(move.moveName, cardId);
    const seedInputs = inputsFromSeed(seed, move.selectableCardIds.length);
    const seedRequirement = requirementFromSeed(seed);
    discovered.push(...seedInputs);

    const firstSteps =
      getMoveProcedure(
        input.state,
        input.staticResources,
        input.actorId as PlayerId,
        move.moveName,
        seed,
      ) ?? [];
    discovered.push(
      ...inputsFromProcedure(move.moveName, firstSteps, {
        conditional: true,
        nativeModeKey: modeBinding.key,
        requiredWhen: seedRequirement === undefined ? undefined : [seedRequirement],
      }),
    );

    const modeSteps = firstSteps.filter(
      (step): step is SelectModeStep => step.kind === "selectMode",
    );
    if (modeSteps.length === 0) {
      paths.push([...seedInputs, ...inputsFromProcedure(move.moveName, firstSteps)]);
      continue;
    }

    for (const step of modeSteps) {
      for (const mode of step.modes) {
        const nextSteps =
          getMoveProcedure(
            input.state,
            input.staticResources,
            input.actorId as PlayerId,
            move.moveName,
            { ...seed, [modeBinding.key]: modeBinding.coerce(mode.id) },
          ) ?? [];
        const branchRequirement = appendRequirementCondition(seedRequirement, {
          inputId: modeBinding.key,
          value: mode.id,
        });
        discovered.push(
          ...inputsFromProcedure(move.moveName, nextSteps, {
            conditional: true,
            requiredWhen: [branchRequirement],
          }),
        );
        paths.push([
          ...seedInputs,
          ...inputsFromProcedure(move.moveName, firstSteps, {
            nativeModeKey: modeBinding.key,
          }),
          ...inputsFromProcedure(move.moveName, nextSteps),
        ]);
      }
    }
  }

  return applyUniversalRequirements(mergeInteractionInputs(discovered), paths);
}

function applyUniversalRequirements(
  inputs: readonly InteractionInput[],
  paths: readonly (readonly InteractionInput[])[],
): InteractionInput[] {
  if (paths.length === 0) return [...inputs];
  return inputs.map((input) => {
    if (input.kind !== "entity-selection" && input.kind !== "option-selection") return input;
    const min = Math.min(
      ...paths.map((path) => {
        const matching = path.find(
          (candidate) => candidate.id === input.id && candidate.kind === input.kind,
        );
        return matching?.kind === "entity-selection" || matching?.kind === "option-selection"
          ? matching.min
          : 0;
      }),
    );
    const withUniversalMin =
      input.kind === "entity-selection" || input.kind === "option-selection"
        ? { ...input, min }
        : input;
    if (min === 0) return withUniversalMin;
    const { requiredWhen: _requiredWhen, ...requiredInput } = input;
    return { ...requiredInput, min, required: true };
  });
}

function requirementFromSeed(
  seed: Readonly<Record<string, unknown>>,
): InputRequirement | undefined {
  const all = Object.entries(seed).flatMap(([inputId, value]) => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return [{ inputId, value }];
    }
    if (Array.isArray(value)) {
      return value.flatMap((item) =>
        typeof item === "string" || typeof item === "number" || typeof item === "boolean"
          ? [{ inputId, value: item }]
          : [],
      );
    }
    return [];
  });
  return all.length === 0 ? undefined : { all };
}

function appendRequirementCondition(
  requirement: InputRequirement | undefined,
  condition: InputRequirement["all"][number],
): InputRequirement {
  return { all: [...(requirement?.all ?? []), condition] };
}

function inputsFromSeed(seed: Readonly<Record<string, unknown>>, selectableCount: number) {
  return Object.entries(seed).flatMap(([key, value]): InteractionInput[] => {
    const ids =
      typeof value === "string"
        ? [value]
        : Array.isArray(value) && value.every((entry) => typeof entry === "string")
          ? value
          : [];
    if (ids.length === 0) return [];
    return [
      entityInput(
        key,
        "source",
        "card",
        { min: 1, max: Array.isArray(value) ? selectableCount : 1 },
        ids,
      ),
    ];
  });
}

function mergeInteractionInputs(inputs: readonly InteractionInput[]): InteractionInput[] {
  const merged = new Map<string, InteractionInput>();

  for (const input of inputs) {
    const current = merged.get(input.id);
    if (!current || current.kind !== input.kind) {
      merged.set(input.id, input);
      continue;
    }

    if (current.kind === "entity-selection" && input.kind === "entity-selection") {
      const candidates = uniqueCandidates([...current.candidates, ...input.candidates]);
      const min = Math.max(current.min, input.min);
      merged.set(input.id, {
        ...current,
        role: current.role === "cost" || input.role !== "cost" ? current.role : "cost",
        min,
        max: Math.min(candidates.length, Math.max(current.max, input.max)),
        required: current.required === true || input.required === true,
        requiredWhen: mergeRequirements(current.requiredWhen, input.requiredWhen),
        candidates,
      });
      continue;
    }

    if (current.kind === "option-selection" && input.kind === "option-selection") {
      const options = [
        ...current.options,
        ...input.options.filter(
          (option) => !current.options.some((candidate) => candidate.id === option.id),
        ),
      ];
      const min = Math.max(current.min, input.min);
      merged.set(input.id, {
        ...current,
        min,
        max: Math.min(options.length, Math.max(current.max, input.max)),
        required: current.required === true || input.required === true,
        requiredWhen: mergeRequirements(current.requiredWhen, input.requiredWhen),
        options,
      });
    }
  }

  return [...merged.values()];
}

function mergeRequirements(
  left: InteractionInput["requiredWhen"],
  right: InteractionInput["requiredWhen"],
): InteractionInput["requiredWhen"] {
  const requirements = [...(left ?? []), ...(right ?? [])];
  const unique = requirements.filter(
    (requirement, index) =>
      requirements.findIndex(
        (candidate) => JSON.stringify(candidate) === JSON.stringify(requirement),
      ) === index,
  );
  return unique.length === 0 ? undefined : unique;
}

function uniqueCandidates(candidates: readonly EntityCandidate[]): EntityCandidate[] {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    const id = candidate.entity.instanceId;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function actionFromPendingChoice(
  choice: PendingChoicePrompt,
  stateVersion: number,
): InteractionAction {
  switch (choice.kind) {
    case "targetSelection":
      return resolveEffectAction(stateVersion, choice.effectId, "choose-targets", [
        pendingEffectInput(choice.effectId),
        ...(choice.groups.length > 1
          ? choice.groups.map((group, index) =>
              entityInput(
                `targetGroups.${index}`,
                "target",
                "card",
                { min: group.minTargets, max: group.maxTargets },
                group.legalTargetIds,
                {
                  key: "gundam.choice.targetGroup",
                  params: {
                    prompt: choice.prompt,
                    groupIndex: index + 1,
                    groupCount: choice.groups.length,
                  },
                },
              ),
            )
          : [
              entityInput(
                "targets",
                "target",
                "card",
                { min: choice.minTargets, max: choice.maxTargets },
                choice.legalTargetIds,
                { key: "gundam.choice.targets", params: { prompt: choice.prompt } },
              ),
            ]),
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
          options: choice.candidates.map((candidate) => ({
            id: candidate.effectId,
            text: {
              key: "gundam.choice.effect",
              params: {
                effectId: candidate.effectId,
                sourceCardId: candidate.sourceCardId,
                label: candidate.label,
              },
            },
            enabled: true,
          })),
        },
      ]);
    case "deckLook":
      return deckLookAction(choice, stateVersion);
  }
}

function deckLookAction(
  choice: Extract<PendingChoicePrompt, { kind: "deckLook" }>,
  stateVersion: number,
): InteractionAction {
  const common: InteractionInput[] = [pendingEffectInput(choice.effectId)];
  const promptText = { key: "gundam.choice.deckLook", params: { prompt: choice.prompt } };

  if (choice.acceptOptionalDirectiveIndex !== undefined) {
    common.push({
      kind: "boolean",
      id: `optionalAnswers.${choice.acceptOptionalDirectiveIndex}`,
      text: { key: "gundam.choice.optional", params: { prompt: choice.prompt } },
      required: true,
      trueText: { key: "gundam.choice.yes" },
      falseText: { key: "gundam.choice.no" },
    });
  }

  if (choice.legalTutorCardIds.length > 0) {
    common.push(
      entityInput(
        `deckLookAnswers.${choice.directiveIndex}.tutorCardId`,
        "target",
        "card",
        { min: 0, max: 1 },
        choice.legalTutorCardIds,
      ),
    );
  }

  // Random-bottom resolution deliberately gives the player no ordering
  // control. Still publish an explicit completion choice so a human can
  // decline an optional tutor (or continue when no tutor is legal) and the
  // adapter can submit the required empty DeckLookAnswer through the generic
  // interaction protocol.
  if (choice.randomizeRemainingToBottom) {
    common.push({
      kind: "option-selection",
      id: `deckLookAnswers.${choice.directiveIndex}.completion`,
      text: promptText,
      required: true,
      min: 1,
      max: 1,
      options: [
        {
          id: "complete",
          text: { key: "gundam.choice.deckLook.complete" },
          enabled: true,
        },
      ],
    });
  }

  const destinations = deckLookDestinations(choice);
  return resolveEffectAction(stateVersion, choice.effectId, "order-cards", [
    ...common,
    ...destinations.map(
      (destination): InteractionInput => ({
        kind: "ordering",
        id: `deckLookAnswers.${choice.directiveIndex}.${destination}`,
        text: {
          ...promptText,
          params: { ...promptText.params, destination },
        },
        required: false,
        entityKind: "card",
        min: 0,
        max: choice.revealedCardIds.length,
        candidates: choice.revealedCardIds.map((instanceId) => ({
          entity: { kind: "card", instanceId },
          enabled: true,
        })),
      }),
    ),
  ]);
}

function deckLookDestinations(
  choice: Extract<PendingChoicePrompt, { kind: "deckLook" }>,
): readonly ("toTop" | "toBottom" | "toTrash")[] {
  if (choice.randomizeRemainingToBottom) return [];
  if (choice.returnMode === "topOrTrash") return ["toTop", "toTrash"];
  if (choice.returnMode === "topAndBottom") return ["toTop", "toBottom"];
  if (choice.remainingDestination === "trash") return ["toTop", "toTrash"];
  if (choice.remainingDestination === "bottom") return ["toTop", "toBottom"];
  return ["toBottom"];
}

function inputsFromProcedure(
  moveName: GundamMoveName,
  steps: readonly MoveStepOption[],
  options: {
    readonly conditional?: boolean;
    readonly nativeModeKey?: string;
    readonly requiredWhen?: InteractionInput["requiredWhen"];
  } = {},
): InteractionInput[] {
  return steps.flatMap((step, index): InteractionInput[] => {
    switch (step.kind) {
      case "confirm":
        return [];
      case "selectCost":
        return [
          {
            ...entityInput(
              `cost.${index}`,
              "cost",
              "resource",
              { min: 1, max: step.candidateIds.length },
              step.candidateIds,
            ),
            required: !options.conditional,
            requiredWhen: options.requiredWhen,
          },
        ];
      case "selectMode":
        return [
          {
            kind: "option-selection",
            id: options.nativeModeKey ?? `mode.${index}`,
            text: { key: `gundam.move.${moveName}.mode` },
            required: !options.conditional,
            requiredWhen: options.requiredWhen,
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
          {
            ...entityInput(
              binding.key,
              gundamTargetInteractionRole(step),
              "card",
              { min: step.minTargets, max: step.maxTargets },
              step.candidateIds,
            ),
            required: !options.conditional && step.minTargets > 0,
            requiredWhen: step.minTargets > 0 ? options.requiredWhen : undefined,
          },
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
  role: EntitySelectionRole,
  kind: EntityCandidate["entity"]["kind"],
  limit: { min: number; max: number },
  ids: readonly string[],
  text?: InteractionText,
): InteractionInput {
  return {
    kind: "entity-selection",
    id,
    text: text ?? { key: `gundam.input.${id}` },
    required: limit.min > 0,
    role,
    entityKinds: [kind],
    min: limit.min,
    max: limit.max,
    ordered: false,
    candidates: ids.map((instanceId) => ({ entity: { kind, instanceId }, enabled: true })),
  };
}

function targetPayload(moveName: GundamMoveName, submission: InteractionSubmission): NativePayload {
  const payload: NativePayload = {};
  const modeBinding = selectModeInputBinding(moveName);
  for (const [key, value] of Object.entries(submission.values)) {
    if (key === "cardId") continue;
    if (key.startsWith("mode.")) {
      payload[modeBinding.key] = modeBinding.coerce(String(requireSingleOption(value, key)));
    } else if (key === modeBinding.key) {
      payload[modeBinding.key] = modeBinding.coerce(String(requireSingleOption(value, key)));
    } else if (key.startsWith("cost.")) payload.cost = value;
    else payload[key] = value;
  }
  return payload;
}

function requireSingleOption(value: unknown, key: string): string | number {
  if (typeof value === "string" || typeof value === "number") return value;
  if (
    Array.isArray(value) &&
    value.length === 1 &&
    (typeof value[0] === "string" || typeof value[0] === "number")
  ) {
    return value[0];
  }
  throw new Error(`Interaction value "${key}" must select exactly one option.`);
}

function resolveEffectPayload(submission: InteractionSubmission): NativePayload {
  const payload: NativePayload = {
    pendingEffectId: requireString(submission, "pendingEffectId"),
  };
  const groupedTargets = targetGroupValues(submission);
  const targets = groupedTargets ?? optionalStringArray(submission, "targets");
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
        if (field === "completion") {
          const completion = requireSingleOption(value, key);
          if (completion !== "complete") {
            throw new Error(`Interaction value "${key}" must complete the deck-look choice.`);
          }
          payload.deckLookAnswers = { ...current, [indexStr]: answer };
          continue;
        }
        payload.deckLookAnswers = {
          ...current,
          [indexStr]: {
            ...answer,
            [field]: field === "tutorCardId" && Array.isArray(value) ? value[0] : value,
          },
        };
      }
    }
  }
  return payload;
}

function targetGroupValues(submission: InteractionSubmission): string[] | undefined {
  const groups = Object.entries(submission.values)
    .flatMap(([key, value]) => {
      const match = /^targetGroups\.(\d+)$/.exec(key);
      if (!match) return [];
      if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
        throw new Error(`Interaction value "${key}" must be a string array.`);
      }
      return [{ index: Number(match[1]), targets: value as string[] }];
    })
    .sort((a, b) => a.index - b.index);
  return groups.length === 0 ? undefined : groups.flatMap((group) => group.targets);
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
