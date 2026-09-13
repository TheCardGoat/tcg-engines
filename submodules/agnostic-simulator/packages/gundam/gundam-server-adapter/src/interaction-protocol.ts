import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityCandidate,
  type InteractionAction,
  type InteractionInput,
  type InteractionResolutionContext,
  type InteractionSubmission,
  type InteractionSubmissionValue,
  type InteractionText,
} from "@tcg/protocol";
import {
  enumerateAvailableMovesDetailed,
  getMoveProcedure,
  gundamZones,
  isGundamZoneId,
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
  if (step.role === "cost" || step.role === "resource") return "cost";
  return "target";
}

export function buildGundamInteractionView(input: {
  actorId: string;
  stateVersion: number;
  state: MatchState;
  staticResources: MatchStaticResources;
  pendingChoice: PendingChoicePrompt | undefined;
  publicPendingChoice?: PendingChoicePrompt;
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
    resolution: gundamResolutionContext(input),
    actions,
  };
}

function gundamResolutionContext(input: {
  actorId: string;
  state: MatchState;
  staticResources: MatchStaticResources;
  pendingChoice: PendingChoicePrompt | undefined;
  publicPendingChoice?: PendingChoicePrompt;
}): InteractionResolutionContext | undefined {
  const pendingEffects = (
    input.state.G as
      | {
          pendingEffects?: readonly {
            id: string;
            controllerId: string;
            sourceCardId: string;
            kind?: string;
            effect: {
              sourceText: string;
              directives: readonly unknown[];
              activation?: { timing?: readonly string[] };
            };
          }[];
        }
      | undefined
  )?.pendingEffects;
  if (!pendingEffects?.length) return undefined;
  const publicEffects = pendingEffects.filter((effect) => effect.kind !== "sentinel");
  const visibleEffects = publicEffects.length > 0 ? publicEffects : pendingEffects;

  const choice = input.publicPendingChoice ?? input.pendingChoice;
  const current =
    visibleEffects.find((effect) => effect.id === choice?.effectId) ?? visibleEffects[0]!;
  const sourceRegistration = input.staticResources.cardsMaps.instances.get(current.sourceCardId);
  const sourceDefinition = sourceRegistration
    ? input.staticResources.getDefinition(sourceRegistration.definitionId)
    : undefined;
  const sourceName = sourceDefinition?.name ?? "Effect";
  const timing = current.effect.activation?.timing?.[0];
  const effectLabel = timing ? `${sourceName} — ${formatTiming(timing)}` : sourceName;
  const directiveIndex =
    choice && "directiveIndex" in choice && choice.directiveIndex >= 0 ? choice.directiveIndex : 0;
  const stepCount = Math.max(1, current.effect.directives.length);
  const source = resolutionSourceForViewer(
    input.state,
    current.sourceCardId,
    current.controllerId,
    input.actorId,
  );

  return {
    actingPlayerId: choice?.controllerId ?? current.controllerId,
    pendingCount: visibleEffects.length,
    currentEffect: {
      id: current.id,
      text: { key: "gundam.effect.current", params: { label: effectLabel } },
      ...(source ? { source } : {}),
    },
    currentStep: {
      index: Math.min(directiveIndex + 1, stepCount),
      count: stepCount,
      text: {
        key: "gundam.effect.step",
        params: { prompt: choice?.prompt ?? current.effect.sourceText },
      },
      requirement: gundamResolutionRequirement(choice),
    },
  };
}

function resolutionSourceForViewer(
  state: MatchState,
  sourceCardId: string,
  controllerId: string,
  viewerId: string,
): InteractionResolutionContext["currentEffect"]["source"] {
  const zoneKey = state.ctx.zones.private.cardIndex[sourceCardId]?.zoneKey;
  const zoneId = zoneKey?.split(":")[0];
  const sourceIsPublic =
    zoneId !== undefined && isGundamZoneId(zoneId) && gundamZones[zoneId].visibility === "public";

  if (viewerId !== controllerId && !sourceIsPublic) return undefined;

  return {
    kind: "card",
    instanceId: sourceCardId,
    ownerId: controllerId,
    ...(zoneKey ? { zoneId } : {}),
  };
}

function gundamResolutionRequirement(
  choice: PendingChoicePrompt | undefined,
): InteractionResolutionContext["currentStep"]["requirement"] {
  if (!choice) return undefined;
  switch (choice.kind) {
    case "targetSelection":
      return {
        kind: "entity-selection",
        text: { key: "gundam.choice.targets", params: { prompt: choice.prompt } },
        required: choice.optionalDirectiveIndex === undefined && choice.minTargets > 0,
        min: choice.minTargets,
        max: choice.maxTargets,
      };
    case "optional":
      return {
        kind: "boolean",
        text: { key: "gundam.choice.optional", params: { prompt: choice.prompt } },
        required: false,
      };
    case "chooseOne":
    case "ordering":
      return {
        kind: "option-selection",
        text: { key: `gundam.choice.${choice.kind}`, params: { prompt: choice.prompt } },
        required: true,
        min: 1,
        max: 1,
      };
    case "deckLook":
      return {
        kind: "entity-partition",
        text: { key: "gundam.choice.deckLook", params: { prompt: choice.prompt } },
        required: true,
      };
  }
}

function formatTiming(timing: string): string {
  return timing
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function gundamSubmissionToPayload(submission: InteractionSubmission): {
  moveType: string;
  payload: NativePayload;
} {
  if (submission.actionId === "resolveEffect") {
    return { moveType: "resolveEffect", payload: resolveEffectPayload(submission) };
  }

  if (submission.actionId === "chooseFirstPlayer") {
    return {
      moveType: submission.actionId,
      payload: { playerId: String(requireSingleOption(submission.values.playerId, "playerId")) },
    };
  }

  if (submission.actionId === "alterHand") {
    const wantsRedraw = submission.values.wantsRedraw;
    if (typeof wantsRedraw !== "boolean") {
      throw new Error('Interaction value "wantsRedraw" must be a boolean.');
    }
    return { moveType: submission.actionId, payload: { wantsRedraw } };
  }

  const moveName = submission.actionId as GundamMoveName;
  const cardId = optionalSingleString(submission, "cardId");
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
  const interactionInputs =
    move.moveName === "discardToHandLimit"
      ? handLimitInputs(move, input)
      : move.requiresCardSelection
        ? stagedInputsFromAvailableMove(move, input)
        : (setupInputs(move.moveName, input.state) ??
          inputsFromProcedure(
            move.moveName,
            getMoveProcedure(
              input.state,
              input.staticResources,
              input.actorId as PlayerId,
              move.moveName,
              {},
            ) ?? [],
          ));

  return {
    id: move.moveName,
    requestId: requestId(input.stateVersion, move.moveName),
    intent: intentForMove(move.moveName),
    text: {
      key: `gundam.move.${move.moveName}`,
      params: { label: humanizeIdentifier(move.moveName) },
    },
    enabled: !move.requiresCardSelection || move.selectableCardIds.length > 0,
    inputs: interactionInputs,
  };
}

function handLimitInputs(
  move: AvailableMove,
  input: { actorId: string; state: MatchState; staticResources: MatchStaticResources },
): InteractionInput[] {
  // These cards are the whole discard choice, not a single source followed
  // by another target. Preserve the engine's exact Hand Step cardinality.
  const steps =
    getMoveProcedure(
      input.state,
      input.staticResources,
      input.actorId as PlayerId,
      move.moveName,
      {},
    ) ?? [];
  return steps.flatMap((step): InteractionInput[] => {
    if (step.kind !== "selectTarget") return [];
    return [
      {
        kind: "entity-selection",
        id: "cardIds",
        role: "source",
        entityKinds: ["card"],
        required: true,
        min: step.minTargets,
        max: step.maxTargets,
        ordered: false,
        text: {
          key: "gundam.input.discardToHandLimit",
          params: {
            label: `Choose ${step.minTargets} card${step.minTargets === 1 ? "" : "s"} to discard.`,
          },
        },
        candidates: step.candidateIds.map((instanceId) => {
          const registration = input.staticResources.cardsMaps.instances.get(instanceId);
          const definition = registration
            ? input.staticResources.getDefinition(registration.definitionId)
            : undefined;
          return {
            entity: { kind: "card", instanceId },
            enabled: true,
            text: { key: "gundam.card.name", params: { label: definition?.name ?? "Card" } },
          };
        }),
      },
    ];
  });
}

/**
 * Setup moves are discrete decisions rather than card procedures, but they
 * still need to publish their complete input contract for remote clients.
 */
function setupInputs(moveName: GundamMoveName, state: MatchState): InteractionInput[] | null {
  if (moveName === "chooseFirstPlayer") {
    return [
      {
        kind: "option-selection",
        id: "playerId",
        text: { key: "gundam.setup.chooseFirstPlayer" },
        required: true,
        min: 1,
        max: 1,
        options: state.ctx.playerIds.map((playerId) => ({
          id: playerId,
          text: { key: "gundam.setup.player", params: { playerId } },
          enabled: true,
        })),
      },
    ];
  }

  if (moveName === "alterHand") {
    return [
      {
        kind: "boolean",
        id: "wantsRedraw",
        text: { key: "gundam.setup.mulligan" },
        required: true,
        trueText: { key: "gundam.setup.mulligan.redraw" },
        falseText: { key: "gundam.setup.mulligan.keep" },
      },
    ];
  }

  return null;
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
    const matchingPathInputs = paths.map((path) =>
      path.find((candidate) => candidate.id === input.id && candidate.kind === input.kind),
    );
    const pathMinimums = paths.flatMap((path) => {
      const matching = path.find(
        (candidate) => candidate.id === input.id && candidate.kind === input.kind,
      );
      if (matching?.kind === "entity-selection" || matching?.kind === "option-selection") {
        return [matching.min];
      }
      return input.requiredWhen === undefined ? [0] : [];
    });
    const min = pathMinimums.length > 0 ? Math.min(...pathMinimums) : input.min;
    const withUniversalMin =
      input.kind === "entity-selection" || input.kind === "option-selection"
        ? { ...input, min }
        : input;
    const inputExistsOnEveryPath = matchingPathInputs.every((matching) => matching !== undefined);
    if (min === 0 || !inputExistsOnEveryPath) return withUniversalMin;
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
    case "targetSelection": {
      const partitionInput = targetPartitionInput(choice);
      const targetInputs = partitionInput
        ? [partitionInput]
        : choice.groups.length > 1
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
            ];
      if (choice.optionalDirectiveIndex === undefined) {
        return resolveEffectAction(stateVersion, choice.effectId, "choose-targets", [
          pendingEffectInput(choice.effectId),
          ...targetInputs,
        ]);
      }

      const optionalInputId = `optionalAnswers.${choice.optionalDirectiveIndex}`;
      const acceptRequirement: InputRequirement = {
        all: [{ inputId: optionalInputId, value: true }],
      };
      return resolveEffectAction(stateVersion, choice.effectId, "choose-targets", [
        pendingEffectInput(choice.effectId),
        {
          kind: "boolean",
          id: optionalInputId,
          text: { key: "gundam.choice.optional", params: { prompt: choice.prompt } },
          required: true,
          trueText: { key: "gundam.choice.yes", params: { label: "Resolve" } },
          falseText: { key: "gundam.choice.no", params: { label: "Skip" } },
        },
        ...targetInputs.map((input) => ({
          ...input,
          required: false,
          requiredWhen: [acceptRequirement],
        })),
      ]);
    }
    case "optional":
      return resolveEffectAction(stateVersion, choice.effectId, "choose-option", [
        pendingEffectInput(choice.effectId),
        {
          kind: "boolean",
          id: `optionalAnswers.${choice.directiveIndex}`,
          text: { key: "gundam.choice.optional", params: { prompt: choice.prompt } },
          required: true,
          trueText: { key: "gundam.choice.yes", params: { label: "Resolve" } },
          falseText: { key: "gundam.choice.no", params: { label: "Skip" } },
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
                label: compactPendingEffectLabel(candidate.label),
                rulesText: candidate.label,
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

function compactPendingEffectLabel(label: string): string {
  const sourceSeparator = label.indexOf(":");
  if (sourceSeparator <= 0) return label;
  return label.slice(0, sourceSeparator).trim();
}

function targetPartitionInput(
  choice: Extract<PendingChoicePrompt, { kind: "targetSelection" }>,
): Extract<InteractionInput, { kind: "entity-partition" }> | undefined {
  const candidateSet = choice.candidateSet;
  if (!candidateSet || choice.groups.length !== 1) return undefined;
  const denseHandChoice =
    candidateSet.zone === "hand" && (choice.maxTargets > 1 || candidateSet.cardIds.length >= 5);
  if (candidateSet.kind !== "temporary" && !denseHandChoice) return undefined;

  const isDiscard = choice.actionKind === "discard" || choice.actionKind === "discardChosen";
  const routeLabel = isDiscard ? "Discard" : "Add to Hand";
  const remainderLabel =
    candidateSet.zone === "hand"
      ? "Remaining cards stay in your Hand"
      : "Remaining cards stay in Trash";
  const candidateSetLabel =
    candidateSet.kind === "temporary"
      ? "Cards placed in Trash"
      : candidateSet.zone === "hand"
        ? "Your Hand"
        : "Available cards";

  return {
    kind: "entity-partition",
    id: "targetPartition",
    text: { key: "gundam.choice.targets", params: { prompt: choice.prompt } },
    candidateSetText: {
      key: "gundam.choice.candidateSet",
      params: { label: candidateSetLabel },
    },
    required: choice.minTargets > 0,
    entityKind: "card",
    candidates: candidateSet.cardIds.map((instanceId) => ({
      entity: { kind: "card", instanceId },
      enabled: true,
    })),
    routes: [
      {
        id: "targets",
        text: { key: "gundam.choice.route", params: { label: routeLabel } },
        kind: "extract",
        ordered: false,
        min: choice.minTargets,
        max: choice.maxTargets,
        candidateIds: [...choice.legalTargetIds],
      },
    ],
    assignment: "remainder-automatic",
    remainderText: {
      key: "gundam.choice.remainder",
      params: { label: remainderLabel },
    },
  };
}

function deckLookAction(
  choice: Extract<PendingChoicePrompt, { kind: "deckLook" }>,
  stateVersion: number,
): InteractionAction {
  const promptText = { key: "gundam.choice.deckLook", params: { prompt: choice.prompt } };
  const routes: Extract<InteractionInput, { kind: "entity-partition" }>["routes"] = [];
  if (choice.legalTutorCardIds.length > 0) {
    routes.push({
      id: "tutorCardId",
      text: {
        key: "gundam.choice.deckLook.tutor",
        params: { label: deckLookTutorLabel(choice.tutorDestination) },
      },
      kind: "extract",
      ordered: false,
      min: 0,
      max: 1,
      candidateIds: [...choice.legalTutorCardIds],
    });
  }
  if (!choice.randomizeRemainingToBottom) {
    for (const destination of deckLookDestinations(choice)) {
      // chooseTop + remainingDestination requires exactly one card on top
      // (engine: toTop.length === Math.min(1, remaining.length)). Cap the route
      // so Confirm is not enabled for multi-card toTop partitions the engine rejects.
      const chooseTopSingle =
        destination === "toTop" &&
        choice.returnMode === "chooseTop" &&
        Boolean(choice.remainingDestination);
      routes.push({
        id: destination,
        text: {
          ...promptText,
          params: { ...promptText.params, label: deckLookDestinationLabel(destination) },
        },
        kind: "destination",
        ordered: true,
        min: 0,
        max: chooseTopSingle ? 1 : choice.revealedCardIds.length,
        ...(chooseTopSingle ? { minWhenRemainingAtLeast: { count: 1, min: 1 } } : {}),
        ...(destination === "toBottom" && choice.returnMode === "topAndBottom"
          ? { minWhenRemainingAtLeast: { count: 2, min: 1 } }
          : {}),
      });
    }
  }

  return resolveEffectAction(stateVersion, choice.effectId, "order-cards", [
    pendingEffectInput(choice.effectId),
    {
      kind: "entity-partition",
      id: `deckLookAnswers.${choice.directiveIndex}`,
      text: promptText,
      required: true,
      entityKind: "card",
      candidateSetText: {
        key: "gundam.choice.deckLook.revealed",
        params: { label: "Revealed cards" },
      },
      candidates: choice.revealedCardIds.map((instanceId) => ({
        entity: { kind: "card", instanceId },
        enabled: true,
      })),
      routes,
      assignment: choice.randomizeRemainingToBottom ? "remainder-automatic" : "exhaustive",
      ...(choice.randomizeRemainingToBottom
        ? {
            remainderText: {
              key: "gundam.choice.deckLook.randomBottom",
              params: { label: "Remaining cards are randomized to the bottom of the Deck" },
            },
          }
        : {}),
    },
  ]);
}

function deckLookTutorLabel(destination: "hand" | "battleArea" | "deckTop"): string {
  if (destination === "battleArea") return "Deploy";
  if (destination === "deckTop") return "Top of Deck";
  return "Add to Hand";
}

function deckLookDestinationLabel(destination: "toTop" | "toBottom" | "toTrash"): string {
  if (destination === "toTop") return "Top of Deck";
  if (destination === "toBottom") return "Bottom of Deck";
  return "Trash";
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
    implicit: true,
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
    text: text ?? {
      key: `gundam.input.${id}`,
      params: { label: entityInputLabel(role) },
    },
    required: limit.min > 0,
    role,
    entityKinds: [kind],
    min: limit.min,
    max: limit.max,
    ordered: false,
    candidates: ids.map((instanceId) => ({ entity: { kind, instanceId }, enabled: true })),
  };
}

function entityInputLabel(role: EntitySelectionRole): string {
  if (role === "cost") return "Select cards to pay the activation cost.";
  if (role === "defender") return "Select an attack target.";
  if (role === "source") return "Select a card.";
  return "Select a target.";
}

function humanizeIdentifier(value: string): string {
  const words = value.replace(/([a-z\d])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ");
  return `${words.slice(0, 1).toUpperCase()}${words.slice(1)}`;
}

function targetPayload(moveName: GundamMoveName, submission: InteractionSubmission): NativePayload {
  const payload: NativePayload =
    isPriorityPassMove(moveName) && submission.automation?.kind === "no-valid-action"
      ? { automatic: true }
      : {};
  const modeBinding = selectModeInputBinding(moveName);
  for (const [key, value] of Object.entries(submission.values)) {
    if (key === "cardId") continue;
    if (key.startsWith("mode.")) {
      payload[modeBinding.key] = modeBinding.coerce(String(requireSingleOption(value, key)));
    } else if (key === modeBinding.key) {
      payload[modeBinding.key] = modeBinding.coerce(String(requireSingleOption(value, key)));
    } else if (key.startsWith("cost.")) payload.cost = value;
    else payload[key] = nativeActionValue(key, value);
  }
  return payload;
}

function nativeActionValue(key: string, value: InteractionSubmissionValue): unknown {
  if (!Array.isArray(value) || value.length !== 1) return value;
  if (key === "targets" || key === "cardIds" || key === "paymentResourceIds") return value;
  return value[0];
}

function isPriorityPassMove(
  moveName: GundamMoveName,
): moveName is "passBlock" | "passBattleAction" | "passActionStep" {
  return (
    moveName === "passBlock" || moveName === "passBattleAction" || moveName === "passActionStep"
  );
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
    pendingEffectId: String(
      requireSingleOption(submission.values.pendingEffectId, "pendingEffectId"),
    ),
  };
  const groupedTargets = targetGroupValues(submission);
  const partitionTargets = stringArrayRecordValue(submission.values.targetPartition)?.targets;
  const targets = groupedTargets ?? partitionTargets ?? optionalStringArray(submission, "targets");
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
      const [indexStr, ...rest] = parts;
      if (indexStr && /^\d+$/.test(indexStr) && rest.length === 0 && isStringArrayRecord(value)) {
        const current = asRecord(payload.deckLookAnswers);
        const tutor = value.tutorCardId?.[0];
        payload.deckLookAnswers = {
          ...current,
          [indexStr]: {
            ...(tutor ? { tutorCardId: tutor } : {}),
            ...(value.toTop ? { toTop: value.toTop } : {}),
            ...(value.toBottom ? { toBottom: value.toBottom } : {}),
            ...(value.toTrash ? { toTrash: value.toTrash } : {}),
          },
        };
      }
    }
  }
  return payload;
}

function stringArrayRecordValue(value: unknown): Record<string, string[]> | undefined {
  return isStringArrayRecord(value) ? value : undefined;
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

function isStringArrayRecord(value: unknown): value is Record<string, string[]> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (entry) => Array.isArray(entry) && entry.every((item) => typeof item === "string"),
    )
  );
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

function optionalSingleString(submission: InteractionSubmission, key: string): string | undefined {
  const value = submission.values[key];
  if (typeof value === "string") return value;
  return Array.isArray(value) && value.length === 1 && typeof value[0] === "string"
    ? value[0]
    : undefined;
}

function optionalStringArray(submission: InteractionSubmission, key: string): string[] | undefined {
  const value = submission.values[key];
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Interaction value "${key}" must be a string array.`);
  }
  return value;
}
