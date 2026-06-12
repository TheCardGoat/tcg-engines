import { getCard } from "../../cards/src/index.ts";
import type { Action, Target, TargetFilter } from "@tcg/op-types";
import { getLegalCommands } from "./engine/legal.ts";
import type { OPCard } from "@tcg/op-types";
import type {
  CardInstance,
  CardZone,
  ChoiceKind,
  LegalCommandDescriptor,
  MatchSeat,
  MatchState,
  PlayerView,
  ProjectedActionCandidate,
  ProjectedCard,
  ProjectedDecision,
  ProjectedDecisionConstraint,
  ProjectedDecisionKind,
  ProjectedDecisionStep,
  ProjectedEntityCandidate,
  ProjectedEntityKind,
  ProjectedEntityRef,
  ProjectedLogEntry,
  ProjectedPlayerState,
  ProjectedPrompt,
  PromptOption,
  PromptState,
  Viewer,
} from "./types.ts";

function getCardName(card: OPCard): string {
  return card.i18n.en.name;
}

function basePower(card: OPCard): number | null {
  if (card.cardType === "leader" || card.cardType === "character") {
    return card.power ?? null;
  }

  return null;
}

function baseCost(card: OPCard): number | null {
  if (card.cardType === "character" || card.cardType === "event" || card.cardType === "stage") {
    return card.cost;
  }

  return null;
}

function getModifierTotal(state: MatchState, instanceId: string, type: "power" | "cost"): number {
  let total = 0;

  for (const modifier of Object.values(state.modifiers)) {
    if (
      modifier.targetId !== instanceId ||
      modifier.type !== type ||
      modifier.value === undefined
    ) {
      continue;
    }

    total += modifier.value;
  }

  return total;
}

function canSeeCard(viewer: Viewer, instance: CardInstance): boolean {
  if (viewer === "judge") {
    return true;
  }

  if (instance.publicKnowledge || instance.zone === "leader" || instance.zone === "character") {
    return true;
  }

  if (instance.zone === "hand" && viewer === instance.owner) {
    return true;
  }

  return false;
}

function canSeeLog(viewer: Viewer, visibility: ProjectedLogEntry["visibility"]): boolean {
  if (viewer === "judge") {
    return true;
  }
  if (visibility === "public") {
    return true;
  }
  if (visibility === "private") {
    return viewer !== "spectator";
  }
  return false;
}

function projectCard(
  state: MatchState,
  viewer: Viewer,
  instanceId: string | null,
): ProjectedCard | null {
  if (!instanceId) {
    return null;
  }

  const instance = state.cards[instanceId];
  const card = getCard(instance.cardId);
  const visible = canSeeCard(viewer, instance);

  return {
    instanceId: visible ? instance.instanceId : null,
    cardId: visible ? instance.cardId : null,
    name: visible ? getCardName(card) : null,
    owner: instance.owner,
    zone: instance.zone,
    rested: instance.rested,
    attachedDon: instance.attachedDon,
    power:
      visible && basePower(card) !== null
        ? basePower(card)! +
          getModifierTotal(state, instance.instanceId, "power") +
          instance.attachedDon * 1000
        : null,
    cost:
      visible && baseCost(card) !== null
        ? baseCost(card)! + getModifierTotal(state, instance.instanceId, "cost")
        : null,
    hidden: !visible,
  };
}

function projectZone(
  state: MatchState,
  viewer: Viewer,
  zoneIds: string[],
  concealAll: boolean,
): ProjectedCard[] {
  if (concealAll && viewer !== "judge") {
    return zoneIds.map((instanceId) => {
      const instance = state.cards[instanceId];
      return {
        instanceId: null,
        cardId: null,
        name: null,
        owner: instance.owner,
        zone: instance.zone,
        rested: instance.rested,
        attachedDon: instance.attachedDon,
        power: null,
        cost: null,
        hidden: true,
      };
    });
  }

  return zoneIds.map((instanceId) => projectCard(state, viewer, instanceId)!);
}

function projectPlayer(state: MatchState, viewer: Viewer, seat: MatchSeat): ProjectedPlayerState {
  const player = state.players[seat];

  return {
    seat,
    playerName: player.playerName,
    leader: projectCard(state, viewer, player.leaderInstanceId)!,
    handCount: player.hand.length,
    deckCount: player.deck.length,
    lifeCount: player.life.length,
    trash: projectZone(state, viewer, player.trash, false),
    stage: projectCard(state, viewer, player.stageArea),
    characters: player.characterArea.map((instanceId) => projectCard(state, viewer, instanceId)),
    hand: projectZone(state, viewer, player.hand, viewer !== seat),
    life: projectZone(state, viewer, player.life, true),
    deckTop: player.deck.length > 0 ? projectCard(state, viewer, player.deck[0] ?? null) : null,
    activeDon: player.activeDon,
    restedDon: player.restedDon,
    donDeckCount: player.donDeckCount,
  };
}

function projectPrompts(state: MatchState, viewer: Viewer): ProjectedPrompt[] {
  return state.promptQueue
    .filter((prompt) => {
      if (prompt.status !== "pending") {
        return false;
      }
      if (viewer === "judge") {
        return true;
      }

      return prompt.seat === viewer;
    })
    .map((prompt) => ({
      id: prompt.id,
      kind: prompt.kind,
      choiceKind: prompt.choiceKind,
      seat: prompt.seat,
      label: prompt.label,
      details: prompt.details,
      options: prompt.options,
      minSelections: prompt.minSelections,
      maxSelections: prompt.maxSelections,
    }));
}

function canSeePrompt(viewer: Viewer, prompt: PromptState): boolean {
  if (prompt.status !== "pending") {
    return false;
  }
  if (viewer === "judge") {
    return true;
  }

  return prompt.seat === viewer;
}

function entityRefForCard(state: MatchState, instanceId: string): ProjectedEntityRef {
  const instance = state.cards[instanceId];
  return {
    kind: "card",
    id: instanceId,
    ownerId: instance?.owner,
    zoneId: instance?.zone,
  };
}

function entityRefForOption(option: PromptOption): ProjectedEntityRef {
  return {
    kind: "option",
    id: option.id,
  };
}

function candidateForPromptOption(
  state: MatchState,
  option: PromptOption,
): ProjectedEntityCandidate {
  if (option.targetId && state.cards[option.targetId]) {
    const card = getCardForPromptOption(state, option);
    const instance = state.cards[option.targetId];
    return {
      ref: entityRefForCard(state, option.targetId),
      label: option.label,
      legal: true,
      publicInfo: {
        cardId: instance?.cardId ?? null,
        name: card ? getCardName(card) : option.label,
        owner: instance?.owner ?? null,
        zone: instance?.zone ?? null,
        rested: instance?.rested ?? null,
        attachedDon: instance?.attachedDon ?? null,
        cost: card ? baseCost(card) : null,
        power: card ? basePower(card) : null,
      },
    };
  }

  return {
    ref: entityRefForOption(option),
    label: option.label,
    legal: true,
  };
}

function getCardForPromptOption(state: MatchState, option: PromptOption): OPCard | null {
  if (!option.targetId) {
    return null;
  }
  const instance = state.cards[option.targetId];
  return instance ? getCard(instance.cardId) : null;
}

function operatorForComparison(
  comparison: Extract<TargetFilter, { comparison: string }>["comparison"],
): ProjectedDecisionConstraint["operator"] {
  switch (comparison) {
    case "eq":
      return "eq";
    case "lt":
      return "lt";
    case "lte":
      return "lte";
    case "gt":
      return "gt";
    case "gte":
      return "gte";
  }
}

function constraintForFilter(filter: TargetFilter): ProjectedDecisionConstraint {
  switch (filter.filter) {
    case "name":
      return { id: "name", label: `Name is ${filter.value}`, operator: "eq", value: filter.value };
    case "excludeName":
      return {
        id: "excludeName",
        label: `Name is not ${filter.value}`,
        operator: "neq",
        value: filter.value,
      };
    case "excludeSelf":
      return { id: "excludeSelf", label: "Not the source card" };
    case "trait":
      return {
        id: "trait",
        label: filter.negate ? `Does not have ${filter.value}` : `Has ${filter.value}`,
        operator: filter.negate ? "neq" : "includes",
        value: filter.value,
      };
    case "attribute":
      return {
        id: "attribute",
        label: `Attribute is ${filter.value}`,
        operator: "eq",
        value: filter.value,
      };
    case "cost":
    case "baseCost":
      return {
        id: filter.filter,
        label: `${filter.filter === "baseCost" ? "Base cost" : "Cost"} ${filter.comparison} ${filter.value}`,
        operator: operatorForComparison(filter.comparison),
        value: filter.value,
      };
    case "power":
    case "basePower":
      return {
        id: filter.filter,
        label: `${filter.filter === "basePower" ? "Base power" : "Power"} ${filter.comparison} ${filter.value}`,
        operator: operatorForComparison(filter.comparison),
        value: filter.value,
      };
    case "color":
      return {
        id: "color",
        label: `Color includes ${filter.value}`,
        operator: "includes",
        value: filter.value,
      };
    case "cardCategory":
      return {
        id: "cardCategory",
        label: `Card type is ${filter.value}`,
        operator: "eq",
        value: filter.value,
      };
    case "state":
      return { id: "state", label: `Card is ${filter.value}`, operator: "eq", value: filter.value };
    case "hasKeyword":
      return {
        id: "hasKeyword",
        label: `Has ${filter.value}`,
        operator: "includes",
        value: filter.value,
      };
    case "hasTrigger":
      return {
        id: "hasTrigger",
        label: filter.value ? "Has trigger" : "Does not have trigger",
        operator: "eq",
        value: filter.value,
      };
    case "hasEffectType":
      return {
        id: "hasEffectType",
        label: filter.negate ? `Does not have ${filter.value}` : `Has ${filter.value}`,
        operator: filter.negate ? "neq" : "includes",
        value: filter.value,
      };
    case "player":
      return {
        id: "player",
        label: filter.value === "self" ? "Controlled by you" : "Controlled by opponent",
        operator: "eq",
        value: filter.value,
      };
    case "dynamicCost":
      return {
        id: "dynamicCost",
        label: `Dynamic cost from ${filter.source}`,
        operator: operatorForComparison(filter.comparison),
        gameSpecific: true,
      };
    case "noBaseEffect":
      return { id: "noBaseEffect", label: "No base effect" };
  }
}

function constraintsForTarget(target: Target | null): ProjectedDecisionConstraint[] {
  if (!target) {
    return [];
  }

  const constraints: ProjectedDecisionConstraint[] = [
    {
      id: "player",
      label: target.player === "self" ? "Your cards" : "Opponent cards",
      operator: "eq",
      value: target.player,
    },
    {
      id: "zones",
      label: `Zones: ${target.zones.join(", ")}`,
      gameSpecific: true,
    },
  ];

  if (target.self) {
    constraints.push({ id: "self", label: "Source card only" });
  }

  for (const filter of target.filters ?? []) {
    constraints.push(constraintForFilter(filter));
  }

  if (target.totalConstraint) {
    constraints.push({
      id: "totalConstraint",
      label: `Total ${target.totalConstraint.property} ${target.totalConstraint.comparison} ${target.totalConstraint.value}`,
      operator: operatorForComparison(target.totalConstraint.comparison),
      value: target.totalConstraint.value,
      gameSpecific: true,
    });
  }

  return constraints;
}

function targetFromPrompt(prompt: PromptState): Target | null {
  const context = prompt.resolutionContext;
  if (context?.intent !== "effectTargetSelection") {
    return null;
  }
  const action = context.action as Action;
  return "target" in action ? action.target : null;
}

function decisionKindForPrompt(prompt: PromptState): ProjectedDecisionKind {
  if (prompt.kind === "judge") {
    return "chooseOption";
  }

  switch (prompt.choiceKind) {
    case "selectTargets":
      return "selectTargets";
    case "selectCards":
      return "selectCards";
    case "confirm":
      return "confirm";
    case "costPayment":
      return "payCost";
    default:
      return "chooseOption";
  }
}

function entityKindsForChoice(choiceKind: ChoiceKind | null): ProjectedEntityKind[] {
  switch (choiceKind) {
    case "selectTargets":
    case "selectCards":
    case "costPayment":
      return ["card"];
    case "confirm":
    default:
      return ["option"];
  }
}

function stepForPrompt(state: MatchState, prompt: PromptState): ProjectedDecisionStep {
  const candidates = prompt.options.map((option) => candidateForPromptOption(state, option));
  const target = targetFromPrompt(prompt);

  if (prompt.choiceKind === "confirm") {
    return {
      id: `${prompt.id}:confirm`,
      kind: "confirm",
      label: prompt.details || prompt.label,
      confirmLabel:
        prompt.options.find((option) => option.id === "yes" || option.id === "activate")?.label ??
        "Confirm",
      cancelLabel:
        prompt.options.find((option) => option.id === "no" || option.id === "skip")?.label ??
        "Cancel",
      options: prompt.options,
    };
  }

  if (prompt.choiceKind === "costPayment") {
    return {
      id: `${prompt.id}:cost`,
      kind: "payCost",
      label: prompt.details || prompt.label,
      costType: typeof prompt.context.cost === "string" ? prompt.context.cost : undefined,
      entityKinds: entityKindsForChoice(prompt.choiceKind),
      min: prompt.minSelections,
      max: prompt.maxSelections,
      candidates,
      constraints: constraintsForTarget(target),
      selected: [],
    };
  }

  if (prompt.choiceKind === "selectTargets" || prompt.choiceKind === "selectCards") {
    return {
      id: `${prompt.id}:${prompt.choiceKind}`,
      kind: "selectEntity",
      role: prompt.choiceKind === "selectTargets" ? "target" : "card",
      label: prompt.details || prompt.label,
      entityKinds: entityKindsForChoice(prompt.choiceKind),
      min: prompt.minSelections,
      max: prompt.maxSelections,
      candidates,
      constraints: constraintsForTarget(target),
      selected: [],
      allowDuplicates: false,
      optional: prompt.minSelections === 0,
      uiHints: {
        highlightZones: target?.zones,
        preferredPresentation: prompt.choiceKind === "selectTargets" ? "board" : "modal",
        emptyMessage: "No legal selections are available.",
      },
    };
  }

  return {
    id: `${prompt.id}:option`,
    kind: "chooseOption",
    label: prompt.details || prompt.label,
    options: prompt.options,
    min: prompt.minSelections,
    max: prompt.maxSelections,
  };
}

function sourceRefForPrompt(prompt: PromptState): ProjectedEntityRef | undefined {
  if (!prompt.sourceInstanceId) {
    return undefined;
  }

  return {
    kind: "card",
    id: prompt.sourceInstanceId,
  };
}

function projectPromptDecision(state: MatchState, prompt: PromptState): ProjectedDecision {
  const step = stepForPrompt(state, prompt);
  const kind = decisionKindForPrompt(prompt);

  return {
    id: prompt.id,
    gameId: "one-piece",
    actorId: prompt.seat,
    priority: prompt.seat === "judge" ? "judge" : "active",
    kind,
    title: prompt.label,
    message: prompt.details,
    source: sourceRefForPrompt(prompt),
    timing: {
      phase: state.phase,
      step: state.battle?.step,
      trigger: typeof prompt.context.trigger === "string" ? prompt.context.trigger : undefined,
    },
    steps: [step],
    currentStepId: step.id,
    canCancel: prompt.minSelections === 0 || prompt.choiceKind === "confirm",
    cancelLabel: prompt.choiceKind === "confirm" ? "Decline" : "Skip",
    canPass: prompt.minSelections === 0,
    passLabel: "Pass",
    validation: {
      errors: [],
    },
    submit: {
      commandType: prompt.seat === "judge" ? "judgeResolvePrompt" : "resolvePrompt",
      payloadSchemaVersion: 1,
      promptId: prompt.id,
      requiredStepIds: prompt.minSelections > 0 ? [step.id] : [],
    },
    extensions: {
      choiceKind: prompt.choiceKind,
      promptKind: prompt.kind,
      resolutionIntent: prompt.resolutionContext?.intent ?? null,
    },
  };
}

function refForCommandSource(command: LegalCommandDescriptor): ProjectedEntityRef | undefined {
  if (!command.sourceId) {
    return undefined;
  }

  return {
    kind: "card",
    id: command.sourceId,
  };
}

function actionForCommand(
  state: MatchState,
  command: LegalCommandDescriptor,
): ProjectedActionCandidate {
  return {
    id: [
      command.type,
      command.sourceId,
      command.promptId,
      command.targetIds?.join("."),
      command.slotChoices?.join("."),
    ]
      .filter(Boolean)
      .join(":"),
    label: command.label,
    commandType: command.type,
    source: refForCommandSource(command),
    targets: command.targetIds
      ?.filter((targetId) => state.cards[targetId])
      .map((targetId) => entityRefForCard(state, targetId)),
    slotChoices: command.slotChoices,
    options: command.options,
  };
}

function projectActionDecision(
  state: MatchState,
  viewer: MatchSeat | "judge",
): ProjectedDecision | null {
  const commands = getLegalCommands(state, viewer).filter(
    (command) => command.type !== "resolvePrompt" && command.type !== "judgeResolvePrompt",
  );

  if (commands.length === 0) {
    return null;
  }

  const step: ProjectedDecisionStep = {
    id: `actions:${viewer}`,
    kind: "chooseAction",
    label: "Choose an action",
    actions: commands.map((command) => actionForCommand(state, command)),
  };

  return {
    id: `actions:${viewer}`,
    gameId: "one-piece",
    actorId: viewer,
    priority: viewer === "judge" ? "judge" : "active",
    kind: "chooseAction",
    title: "Available actions",
    message: "Choose an available game action.",
    timing: {
      phase: state.phase,
      step: state.battle?.step,
    },
    steps: [step],
    currentStepId: step.id,
    canCancel: false,
    canPass: commands.some((command) => command.type === "endTurn"),
    passLabel: "End turn",
    validation: {
      errors: [],
    },
    submit: {
      commandType: commands[0]!.type,
      payloadSchemaVersion: 1,
      requiredStepIds: [step.id],
    },
  };
}

function projectDecisions(state: MatchState, viewer: Viewer): ProjectedDecision[] {
  const decisions = state.promptQueue
    .filter((prompt) => canSeePrompt(viewer, prompt))
    .map((prompt) => projectPromptDecision(state, prompt));

  if (viewer !== "spectator") {
    const actionDecision = projectActionDecision(state, viewer);
    if (actionDecision) {
      decisions.push(actionDecision);
    }
  }

  return decisions;
}

function projectLogs(state: MatchState, viewer: Viewer): ProjectedLogEntry[] {
  const projected: ProjectedLogEntry[] = [];

  for (const log of state.logHistory) {
    if (!canSeeLog(viewer, log.visibility)) {
      continue;
    }

    if (viewer === "judge") {
      projected.push({
        id: log.id,
        turn: log.turn,
        phase: log.phase,
        sequence: log.sequence,
        actor: log.actor,
        sourceCardId: log.sourceCardId,
        sourceInstanceId: log.sourceInstanceId,
        targetIds: log.targetIds,
        eventId: log.eventId,
        visibility: log.visibility,
        message:
          log.judgeMessage ?? log.privateMessages.north ?? log.privateMessages.south ?? log.message,
      });
      continue;
    }

    projected.push({
      id: log.id,
      turn: log.turn,
      phase: log.phase,
      sequence: log.sequence,
      actor: log.actor,
      sourceCardId: log.sourceCardId,
      sourceInstanceId: log.sourceInstanceId,
      targetIds: log.targetIds,
      eventId: log.eventId,
      visibility: log.visibility,
      message: viewer === "spectator" ? log.message : (log.privateMessages[viewer] ?? log.message),
    });
  }

  return projected;
}

export function projectStateForSeat(state: MatchState, viewer: Viewer): PlayerView {
  return {
    viewer,
    status: state.status,
    activeSeat: state.activeSeat,
    turnNumber: state.turnNumber,
    phase: state.phase,
    winner: state.winner,
    players: {
      north: projectPlayer(state, viewer, "north"),
      south: projectPlayer(state, viewer, "south"),
    },
    prompts: projectPrompts(state, viewer),
    decisions: projectDecisions(state, viewer),
    battle: state.battle,
    logs: projectLogs(state, viewer),
  };
}

export function cardZoneSummary(state: MatchState, seat: MatchSeat, zone: CardZone): string[] {
  const player = state.players[seat];

  switch (zone) {
    case "deck":
      return player.deck;
    case "hand":
      return player.hand;
    case "life":
      return player.life;
    case "trash":
      return player.trash;
    case "character":
      return player.characterArea.filter((instanceId): instanceId is string => Boolean(instanceId));
    case "stage":
      return player.stageArea ? [player.stageArea] : [];
    case "leader":
      return [player.leaderInstanceId];
  }
}
