/**
 * Naruto ↔ interaction-protocol mapping.
 *
 * `buildNarutoInteractionView` projects the engine's 12-action union (plus
 * the `pendingChoice` / counter-step routers) into a protocol
 * `EngineInteractionView`. `narutoSubmissionToAction` translates a validated
 * `InteractionSubmission` back into the native action union.
 *
 * Per-action intent mapping (design doc §4):
 *
 * | Naruto action                | actionId                     | intent           | inputs |
 * |------------------------------|------------------------------|------------------|--------|
 * | MULLIGAN                     | mulligan                     | mulligan         | boolean keep |
 * | SUMMON                       | summon                       | play-card        | handUid (entity, source) |
 * | SET_SUPPORT                  | set-support                  | play-card        | handUid (entity, source) |
 * | ACTIVATE_SUPPORT             | activate-support             | activate         | supportUid (entity, source) |
 * | ACTIVATE_SUPPORT_FROM_HAND   | activate-support-from-hand   | activate         | handUid (entity, source) |
 * | ACTIVATE_CHARACTER           | activate-character           | activate         | uid (entity, source) |
 * | LEADER_EFFECT                | leader-effect                | activate         | none (source = leader) |
 * | RECOVERY                     | recovery                     | activate         | none (source = leader) |
 * | DECLARE_ATTACK               | declare-attack               | attack           | attackerUid + targetUid (two entity selections) |
 * | PASS_COUNTER                 | pass-counter                 | pass             | none |
 * | RESOLVE_CHOICE               | resolve-choice               | choose-targets   | key (entity, target; optional when cancellable) |
 * | END_TURN                     | end-turn                     | pass             | none |
 *
 * DECLARE_ATTACK's two required selections follow the cyberpunk
 * `selectPair` precedent: two `entity-selection` inputs (roles "attacker"
 * and "defender") on one action; the browser surface may flatten them into
 * synthetic pair entities. Leaders are addressed by the engine's
 * `leader:<playerId>` uid convention.
 */

import {
  INTERACTION_PROTOCOL_VERSION,
  type EngineInteractionView,
  type EntityCandidate,
  type EntitySelectionRole,
  type InteractionAction,
  type InteractionInput,
  type InteractionSubmission,
  type InteractionText,
} from "@tcg/protocol";
import {
  PROVISIONAL_RULES,
  canAct,
  canBeAttacked,
  canSummonEx,
  cardOf,
  characterAbilityBlock,
  characterAttackBlock,
  deciderOf,
  handSupportBlock,
  hasCharacterRoom,
  leaderAttackBlock,
  leaderEffectBlock,
  leaderUid,
  otherPlayer,
  supportBlock,
  type Action,
  type BlockReason,
  type GameState,
  type PlayerId,
} from "@tcg-engines/naruto-engine";

import { actorIdForPlayer, type NarutoSeatMap } from "./state-mapper";

export const NARUTO_ACTION_IDS = [
  "mulligan",
  "summon",
  "set-support",
  "activate-support",
  "activate-support-from-hand",
  "activate-character",
  "leader-effect",
  "recovery",
  "declare-attack",
  "pass-counter",
  "resolve-choice",
  "end-turn",
] as const;

export type NarutoInteractionActionId = (typeof NARUTO_ACTION_IDS)[number];

export function buildNarutoInteractionView(input: {
  state: GameState;
  seats: NarutoSeatMap;
  actorId: string;
  stateVersion: number;
}): EngineInteractionView {
  const { state, seats, actorId, stateVersion } = input;
  const player = actorId === seats.p1 ? "p1" : actorId === seats.p2 ? "p2" : null;

  if (player === null) {
    return view({ actorId, stateVersion, status: "idle", actions: [] });
  }

  if (state.winner !== null) {
    return view({ actorId, stateVersion, status: "game-over", actions: [] });
  }

  if (state.pendingChoice) {
    if (state.pendingChoice.player !== player) {
      return view({ actorId, stateVersion, status: "waiting", actions: [] });
    }
    return view({
      actorId,
      stateVersion,
      status: "choosing",
      actions: [resolveChoiceAction(state, seats, player, stateVersion)],
    });
  }

  if (state.awaitingMulligan !== null) {
    if (state.awaitingMulligan !== player) {
      return view({ actorId, stateVersion, status: "waiting", actions: [] });
    }
    return view({
      actorId,
      stateVersion,
      status: "ready",
      actions: [mulliganAction(stateVersion)],
    });
  }

  if (state.step === "counter") {
    if (state.priority !== player) {
      return view({ actorId, stateVersion, status: "waiting", actions: [] });
    }
    return view({
      actorId,
      stateVersion,
      status: "ready",
      actions: counterStepActions(state, player, stateVersion),
    });
  }

  if (deciderOf(state) !== player) {
    return view({ actorId, stateVersion, status: "waiting", actions: [] });
  }

  return view({
    actorId,
    stateVersion,
    status: "ready",
    actions: mainPhaseActions(state, player, stateVersion),
  });
}

/**
 * Translate a validated submission back into the native action union.
 * Throws `Error` on malformed values; callers (submitInteraction) convert
 * the throw into a `DispatchFailure`.
 */
export function narutoSubmissionToAction(input: {
  submission: InteractionSubmission;
  state: GameState;
  player: PlayerId;
}): Action {
  const { submission, state, player } = input;
  switch (submission.actionId) {
    case "mulligan":
      return { type: "MULLIGAN", player, keep: requireBoolean(submission, "keep") };
    case "summon":
      return { type: "SUMMON", player, handUid: requireString(submission, "handUid") };
    case "set-support":
      return { type: "SET_SUPPORT", player, handUid: requireString(submission, "handUid") };
    case "activate-support": {
      const supportUid = requireString(submission, "supportUid");
      const slot = state.players[player].supports.findIndex(
        (support) => support?.uid === supportUid,
      );
      if (slot < 0) {
        throw new Error(`Support "${supportUid}" is not set for ${player}.`);
      }
      return { type: "ACTIVATE_SUPPORT", player, slot };
    }
    case "activate-support-from-hand":
      return {
        type: "ACTIVATE_SUPPORT_FROM_HAND",
        player,
        handUid: requireString(submission, "handUid"),
      };
    case "activate-character":
      return { type: "ACTIVATE_CHARACTER", player, uid: requireString(submission, "uid") };
    case "leader-effect":
      return { type: "LEADER_EFFECT", player };
    case "recovery":
      return { type: "RECOVERY", player };
    case "declare-attack": {
      const attackerUid = requireString(submission, "attackerUid");
      const targetValue = requireString(submission, "targetUid");
      const attackerKind = attackerUid === leaderUid(player) ? "leader" : "character";
      if (targetValue === leaderUid(otherPlayer(player))) {
        return {
          type: "DECLARE_ATTACK",
          player,
          attackerUid,
          attackerKind,
          targetKind: "leader",
          targetUid: null,
        };
      }
      return {
        type: "DECLARE_ATTACK",
        player,
        attackerUid,
        attackerKind,
        targetKind: "character",
        targetUid: targetValue,
      };
    }
    case "pass-counter":
      return { type: "PASS_COUNTER", player };
    case "resolve-choice": {
      const key = submission.values.key;
      if (key === undefined || key === null) return { type: "RESOLVE_CHOICE", player, key: null };
      if (typeof key !== "string") {
        throw new Error('Interaction value "key" must be a string or null.');
      }
      return { type: "RESOLVE_CHOICE", player, key };
    }
    case "end-turn":
      return { type: "END_TURN", player };
    default:
      throw new Error(`Unknown naruto interaction action "${submission.actionId}".`);
  }
}

// ---------------------------------------------------------------------------
// View builders
// ---------------------------------------------------------------------------

function view(input: {
  actorId: string;
  stateVersion: number;
  status: EngineInteractionView["status"];
  actions: InteractionAction[];
}): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "naruto",
    actorId: input.actorId,
    stateVersion: input.stateVersion,
    status: input.status,
    actions: input.actions,
  };
}

function mulliganAction(stateVersion: number): InteractionAction {
  return {
    id: "mulligan",
    requestId: requestId(stateVersion, "mulligan"),
    intent: "mulligan",
    text: { key: "naruto.action.mulligan" },
    enabled: true,
    inputs: [
      {
        kind: "boolean",
        id: "keep",
        text: { key: "naruto.input.mulligan.keep" },
        trueText: { key: "naruto.input.mulligan.keep.true" },
        falseText: { key: "naruto.input.mulligan.keep.false" },
      },
    ],
  };
}

function resolveChoiceAction(
  state: GameState,
  seats: NarutoSeatMap,
  player: PlayerId,
  stateVersion: number,
): InteractionAction {
  const choice = state.pendingChoice;
  if (!choice) {
    throw new Error("resolveChoiceAction requires a pending choice.");
  }
  const candidates: EntityCandidate[] = choice.options.map((option) => ({
    entity: {
      kind: "card",
      instanceId: option.key,
      ownerId: actorIdForPlayer(seats, option.owner),
    },
    text: {
      key: "naruto.choice.option",
      params: { cardId: option.cardId, zone: option.zone },
    },
    enabled: true,
  }));
  const bounds = selectionBounds(candidates.length, !choice.cancellable);
  return {
    id: "resolve-choice",
    requestId: requestId(stateVersion, "resolve-choice"),
    intent: "choose-targets",
    text: {
      key: choice.promptKey,
      params: { effect: choice.effect, source: choice.source, ...choice.data },
    },
    enabled: choice.cancellable || candidates.length > 0,
    source: { kind: "card", instanceId: choice.source },
    inputs: [
      entityInput({
        id: "key",
        role: "target",
        text: { key: choice.promptKey },
        candidates,
        min: bounds.min,
        max: bounds.max,
      }),
    ],
  };
}

function counterStepActions(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction[] {
  return [
    activateSupportAction(state, player, stateVersion),
    activateSupportFromHandAction(state, player, stateVersion),
    passCounterAction(stateVersion),
  ];
}

function mainPhaseActions(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction[] {
  const actions: InteractionAction[] = [
    summonAction(state, player, stateVersion),
    setSupportAction(state, player, stateVersion),
    activateSupportAction(state, player, stateVersion),
    activateSupportFromHandAction(state, player, stateVersion),
    activateCharacterAction(state, player, stateVersion),
  ];
  const leaderEffect = leaderEffectAction(state, player, stateVersion);
  if (leaderEffect) actions.push(leaderEffect);
  actions.push(recoveryAction(state, player, stateVersion));
  actions.push(declareAttackAction(state, player, stateVersion));
  actions.push(endTurnAction(state, player, stateVersion));
  return actions;
}

function summonAction(state: GameState, player: PlayerId, stateVersion: number): InteractionAction {
  const me = state.players[player];
  const room = hasCharacterRoom(state, player);
  const normalSummonUsed = me.summonsUsedThisTurn >= PROVISIONAL_RULES.normalSummonsPerTurn;
  const candidates: EntityCandidate[] = me.hand.flatMap((instance) => {
    const card = cardOf(instance);
    if (!card || (card.cardType !== "character" && card.cardType !== "ex_character")) return [];
    let disabled: InteractionText | undefined;
    if (!room) {
      disabled = blockText("noSlot");
    } else if (card.cardType === "ex_character") {
      if (!canSummonEx(state, player, card.id)) {
        disabled = { key: "naruto.block.exRequirements", params: { cardId: card.id } };
      }
    } else if (normalSummonUsed) {
      disabled = blockText("alreadyUsed");
    }
    return [
      {
        entity: { kind: "card" as const, instanceId: instance.uid },
        text: { key: "naruto.card", params: { cardId: card.id, name: card.nameEn } },
        enabled: disabled === undefined,
        ...(disabled ? { disabledText: disabled } : {}),
      },
    ];
  });
  return candidateAction({
    stateVersion,
    id: "summon",
    intent: "play-card",
    candidates,
    input: entityInput({
      id: "handUid",
      role: "source",
      text: { key: "naruto.input.summon.handUid" },
      candidates,
      ...selectionBounds(countEnabled(candidates), true),
    }),
  });
}

function setSupportAction(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction {
  const me = state.players[player];
  const hasFreeSlot = me.supports.some((support) => support === null);
  const candidates: EntityCandidate[] = me.hand.flatMap((instance) => {
    const card = cardOf(instance);
    if (!card?.support) return [];
    const disabled = hasFreeSlot ? undefined : blockText("noSlot");
    return [
      {
        entity: { kind: "card" as const, instanceId: instance.uid },
        text: { key: "naruto.card", params: { cardId: card.id, name: card.nameEn } },
        enabled: disabled === undefined,
        ...(disabled ? { disabledText: disabled } : {}),
      },
    ];
  });
  return candidateAction({
    stateVersion,
    id: "set-support",
    intent: "play-card",
    candidates,
    input: entityInput({
      id: "handUid",
      role: "source",
      text: { key: "naruto.input.setSupport.handUid" },
      candidates,
      ...selectionBounds(countEnabled(candidates), true),
    }),
  });
}

function activateSupportAction(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction {
  const me = state.players[player];
  const candidates: EntityCandidate[] = me.supports.flatMap((support, slot) => {
    if (!support || support.revealed) return [];
    const block = supportBlock(state, player, slot);
    const card = cardOf(support);
    return [
      {
        entity: { kind: "card" as const, instanceId: support.uid },
        text: {
          key: "naruto.card",
          params: { cardId: support.cardId, name: card?.support?.name ?? card?.nameEn ?? "" },
        },
        enabled: block === null,
        ...(block ? { disabledText: blockText(block) } : {}),
      },
    ];
  });
  return candidateAction({
    stateVersion,
    id: "activate-support",
    intent: "activate",
    candidates,
    input: entityInput({
      id: "supportUid",
      role: "source",
      text: { key: "naruto.input.activateSupport.supportUid" },
      candidates,
      ...selectionBounds(countEnabled(candidates), true),
    }),
  });
}

function activateSupportFromHandAction(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction {
  const me = state.players[player];
  const candidates: EntityCandidate[] = me.hand.flatMap((instance) => {
    const card = cardOf(instance);
    if (!card?.support) return [];
    const block = handSupportBlock(state, player, instance.uid);
    return [
      {
        entity: { kind: "card" as const, instanceId: instance.uid },
        text: {
          key: "naruto.card",
          params: { cardId: card.id, name: card.support.name },
        },
        enabled: block === null,
        ...(block ? { disabledText: blockText(block) } : {}),
      },
    ];
  });
  return candidateAction({
    stateVersion,
    id: "activate-support-from-hand",
    intent: "activate",
    candidates,
    input: entityInput({
      id: "handUid",
      role: "source",
      text: { key: "naruto.input.activateSupportFromHand.handUid" },
      candidates,
      ...selectionBounds(countEnabled(candidates), true),
    }),
  });
}

function activateCharacterAction(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction {
  const me = state.players[player];
  const candidates: EntityCandidate[] = me.characters.flatMap((character) => {
    if (!character) return [];
    const block = characterAbilityBlock(state, player, character.uid);
    // "conditionUnmet" means the card has no Activate: Main ability at all —
    // leave vanilla characters out of the candidate list entirely.
    if (block === "conditionUnmet") return [];
    const card = cardOf(character);
    return [
      {
        entity: { kind: "card" as const, instanceId: character.uid },
        text: {
          key: "naruto.card",
          params: { cardId: character.cardId, name: card?.nameEn ?? "" },
        },
        enabled: block === null,
        ...(block ? { disabledText: blockText(block) } : {}),
      },
    ];
  });
  return candidateAction({
    stateVersion,
    id: "activate-character",
    intent: "activate",
    candidates,
    input: entityInput({
      id: "uid",
      role: "source",
      text: { key: "naruto.input.activateCharacter.uid" },
      candidates,
      ...selectionBounds(countEnabled(candidates), true),
    }),
  });
}

function leaderEffectAction(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction | null {
  const block = leaderEffectBlock(state, player);
  // "conditionUnmet" means this leader has no activatable effect.
  if (block === "conditionUnmet") return null;
  return {
    id: "leader-effect",
    requestId: requestId(stateVersion, "leader-effect"),
    intent: "activate",
    text: { key: "naruto.action.leaderEffect" },
    enabled: block === null,
    ...(block ? { disabledText: blockText(block) } : {}),
    source: { kind: "card", instanceId: leaderUid(player) },
    inputs: [],
  };
}

function recoveryAction(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction {
  const me = state.players[player];
  let block: BlockReason | null = null;
  if (state.turn < PROVISIONAL_RULES.recoveryFromTurn) block = "tooEarly";
  else if (me.leaderRested) block = "rested";
  else if (state.turn < me.chakraLockedUntilTurn) block = "frozen";
  return {
    id: "recovery",
    requestId: requestId(stateVersion, "recovery"),
    intent: "activate",
    text: { key: "naruto.action.recovery" },
    enabled: block === null,
    ...(block ? { disabledText: blockText(block) } : {}),
    source: { kind: "card", instanceId: leaderUid(player) },
    inputs: [],
  };
}

function declareAttackAction(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction {
  const opponent = otherPlayer(player);
  const me = state.players[player];

  const attackerCandidates: EntityCandidate[] = [];
  if (PROVISIONAL_RULES.leaderCanAttack) {
    const block = leaderAttackBlock(state, player);
    const leader = state.players[player].leaderId;
    attackerCandidates.push({
      entity: { kind: "card", instanceId: leaderUid(player) },
      text: { key: "naruto.card", params: { cardId: leader, name: leader } },
      enabled: block === null,
      ...(block ? { disabledText: blockText(block) } : {}),
    });
  }
  for (const character of me.characters) {
    if (!character) continue;
    const block = characterAttackBlock(state, player, character.uid);
    const card = cardOf(character);
    attackerCandidates.push({
      entity: { kind: "card", instanceId: character.uid },
      text: { key: "naruto.card", params: { cardId: character.cardId, name: card?.nameEn ?? "" } },
      enabled: block === null,
      ...(block ? { disabledText: blockText(block) } : {}),
    });
  }

  const targetCandidates: EntityCandidate[] = [
    {
      entity: { kind: "card", instanceId: leaderUid(opponent) },
      text: { key: "naruto.card", params: { cardId: state.players[opponent].leaderId } },
      enabled: true,
    },
  ];
  for (const character of state.players[opponent].characters) {
    if (!character || !canBeAttacked(state, character.uid)) continue;
    const card = cardOf(character);
    targetCandidates.push({
      entity: { kind: "card", instanceId: character.uid },
      text: { key: "naruto.card", params: { cardId: character.cardId, name: card?.nameEn ?? "" } },
      enabled: true,
    });
  }

  const enabledAttackers = countEnabled(attackerCandidates);
  const enabledTargets = countEnabled(targetCandidates);
  const enabled = enabledAttackers > 0 && enabledTargets > 0;
  return {
    id: "declare-attack",
    requestId: requestId(stateVersion, "declare-attack"),
    intent: "attack",
    text: { key: "naruto.action.declareAttack" },
    enabled,
    ...(enabled ? {} : { disabledText: { key: "naruto.action.declareAttack.disabled" } }),
    inputs: [
      entityInput({
        id: "attackerUid",
        role: "attacker",
        text: { key: "naruto.input.declareAttack.attackerUid" },
        candidates: attackerCandidates,
        ...selectionBounds(enabledAttackers, true),
      }),
      entityInput({
        id: "targetUid",
        role: "defender",
        text: { key: "naruto.input.declareAttack.targetUid" },
        candidates: targetCandidates,
        ...selectionBounds(enabledTargets, true),
      }),
    ],
  };
}

function passCounterAction(stateVersion: number): InteractionAction {
  return {
    id: "pass-counter",
    requestId: requestId(stateVersion, "pass-counter"),
    intent: "pass",
    text: { key: "naruto.action.passCounter" },
    enabled: true,
    inputs: [],
  };
}

function endTurnAction(
  state: GameState,
  player: PlayerId,
  stateVersion: number,
): InteractionAction {
  const enabled = canAct(state, player);
  return {
    id: "end-turn",
    requestId: requestId(stateVersion, "end-turn"),
    intent: "pass",
    text: { key: "naruto.action.endTurn" },
    enabled,
    ...(enabled ? {} : { disabledText: blockText("notYourTurn") }),
    inputs: [],
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function candidateAction(input: {
  stateVersion: number;
  id: NarutoInteractionActionId;
  intent: InteractionAction["intent"];
  candidates: readonly EntityCandidate[];
  input: InteractionInput;
}): InteractionAction {
  const enabled = countEnabled(input.candidates) > 0;
  return {
    id: input.id,
    requestId: requestId(input.stateVersion, input.id),
    intent: input.intent,
    text: { key: `naruto.action.${camel(input.id)}` },
    enabled,
    ...(enabled ? {} : { disabledText: { key: `naruto.action.${input.id}.disabled` } }),
    inputs: [input.input],
  };
}

function camel(id: string): string {
  // "activate-support-from-hand" -> "activateSupportFromHand"
  return id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function entityInput(args: {
  id: string;
  role: EntitySelectionRole;
  text: InteractionText;
  candidates: EntityCandidate[];
  min: number;
  max: number;
}): InteractionInput {
  return {
    kind: "entity-selection",
    id: args.id,
    role: args.role,
    text: args.text,
    entityKinds: ["card"],
    min: args.min,
    max: args.max,
    ordered: false,
    candidates: args.candidates,
  };
}

/**
 * Bounds that satisfy the protocol's `hasAvailableBounds` refinement:
 * `min` and `max` must both fit within the ENABLED candidate count.
 */
function selectionBounds(enabledCount: number, required: boolean): { min: number; max: number } {
  if (enabledCount === 0) return { min: 0, max: 0 };
  return required ? { min: 1, max: 1 } : { min: 0, max: 1 };
}

function countEnabled(candidates: readonly EntityCandidate[]): number {
  return candidates.filter((candidate) => candidate.enabled !== false).length;
}

function blockText(reason: BlockReason): InteractionText {
  return { key: `naruto.block.${reason}`, params: { reason } };
}

function requestId(stateVersion: number, id: string): string {
  return `naruto:${stateVersion}:${id}`;
}

function requireString(submission: InteractionSubmission, key: string): string {
  const value = submission.values[key];
  if (typeof value !== "string") {
    throw new Error(`Interaction value "${key}" must be a string.`);
  }
  return value;
}

function requireBoolean(submission: InteractionSubmission, key: string): boolean {
  const value = submission.values[key];
  if (typeof value !== "boolean") {
    throw new Error(`Interaction value "${key}" must be a boolean.`);
  }
  return value;
}
