import {
  baseCost,
  effectBlocksFor,
  cardName,
  enqueueResolution,
  emitEvent,
  emitLog,
  enqueueEffectsForTrigger,
  enqueueInPlayEffectsForTrigger,
  getCardForInstance,
  getCardCounter,
  getCardPower,
  getInstance,
  getKeywords,
  getPlayer,
  hasFlagModifier,
  isKeywordActivationPrevented,
  nextIdentifier,
  otherSeat,
  restCard,
} from "./shared.ts";
import {
  canAttackActiveByPermanentEffect,
  isAttackPreventedByPermanentEffect,
  isAttackTargetAllowedByPermanentEffects,
  isKoPreventedByModifier,
} from "./effects/permanent.ts";
import { findKoReplacement } from "./effects/replacements.ts";
import { matchesTargetFilter } from "./effects/targeting.ts";
import { cleanupBattleModifiers, createChoicePrompt, moveCard } from "./state.ts";
import type { GameCommand, MatchSeat, MatchState, PromptOption } from "./types.ts";

function battleKoReplacementSource(state: MatchState, targetId: string) {
  const battle = state.battle;
  if (!battle) {
    return null;
  }
  return findKoReplacement(
    state,
    targetId,
    getInstance(state, battle.attackerId).controller,
    "battle",
  );
}

function koBattleCharacter(state: MatchState) {
  const battle = state.battle;
  if (!battle) {
    return;
  }
  const target = getInstance(state, battle.targetId);
  const defendingSeat = target.controller;
  const attachedDon = target.attachedDon;
  if (target.attachedDon > 0) {
    getPlayer(state, defendingSeat).restedDon += target.attachedDon;
    target.attachedDon = 0;
  }
  moveCard(state, battle.targetId, target.owner, "trash", {
    faceUp: true,
    publicKnowledge: true,
  });
  const triggerEvent = {
    instanceId: battle.targetId,
    instanceController: defendingSeat,
    effectController: getInstance(state, battle.attackerId).controller,
    sourceInstanceId: battle.attackerId,
    koCause: "battle" as const,
    attachedDon,
  };
  enqueueEffectsForTrigger(state, battle.targetId, defendingSeat, "onKo", undefined, triggerEvent);
  enqueueEffectsForTrigger(
    state,
    battle.targetId,
    defendingSeat,
    "whenCharacterKod",
    undefined,
    triggerEvent,
  );
  enqueueInPlayEffectsForTrigger(state, "whenCharacterKod", triggerEvent);
  enqueueInPlayEffectsForTrigger(state, "whenCharacterRemoved", triggerEvent);
  battle.result = "ko";
  emitLog(state, "system", `${cardName(getCardForInstance(state, battle.targetId))} is K.O.'d.`, {
    targetIds: [battle.targetId],
    eventId: battle.id,
    visibility: "public",
  });
}

function enqueueLifeRemovedAfterDamage(
  state: MatchState,
  lifeCardId: string,
  defendingSeat: MatchSeat,
  effectController: MatchSeat,
) {
  enqueueInPlayEffectsForTrigger(state, "whenLifeRemoved", {
    instanceId: lifeCardId,
    effectController,
    targetInstanceId: getPlayer(state, defendingSeat).leaderInstanceId,
  });
}

export function completeBattleResolution(state: MatchState) {
  const battle = state.battle;
  if (!battle || battle.completionQueued) {
    return;
  }
  const attacker = getInstance(state, battle.attackerId);
  if (
    attacker.zone === "leader" &&
    getCardForInstance(state, battle.targetId).cardType === "character" &&
    battle.result !== "pending"
  ) {
    attacker.battledOpponentCharacterOnTurn = state.turnNumber;
  }
  emitEvent(state, "battleResolved", "system", {
    sourceCardId: getInstance(state, battle.attackerId).cardId,
    sourceInstanceId: battle.attackerId,
    targetIds: [battle.targetId],
    eventId: battle.id,
    visibility: "public",
    data: {
      result: battle.result,
      attackPower: battle.attackPower,
      defensePower: battle.defensePower,
    },
  });
  battle.completionQueued = true;
  enqueueResolution(state, {
    kind: "battleEndEffects",
    battleId: battle.id,
    attackerId: battle.attackerId,
    attackerController: attacker.controller,
    targetId: battle.targetId,
  });
}

export function finalizeBattleCleanup(state: MatchState, battleId: string) {
  const battle = state.battle;
  if (!battle || battle.id !== battleId || !battle.completionQueued) {
    return;
  }
  cleanupBattleModifiers(state, battle.id);
  state.battle = null;
}

export function beginBattleCounterStep(state: MatchState) {
  if (!state.battle) {
    return;
  }

  const defendingSeat = state.battle.defendingSeat;
  const player = getPlayer(state, defendingSeat);
  const options: PromptOption[] = player.hand.map((instanceId) => {
    const card = getCardForInstance(state, instanceId);
    const counter = getCardCounter(state, instanceId);
    const isCharacterCounter = card.cardType === "character" && counter > 0;
    const isEventCounter = card.cardType === "event" && effectBlocksFor(card, "counter").length > 0;
    const label = isCharacterCounter
      ? `${cardName(card)} (+${counter})`
      : isEventCounter
        ? `${cardName(card)} (Counter)`
        : cardName(card);
    return {
      id: instanceId,
      label,
      value: instanceId,
      targetId: instanceId,
      enabled: isCharacterCounter || (isEventCounter && player.activeDon >= baseCost(card)),
    };
  });

  if (options.length === 0) {
    return;
  }

  createChoicePrompt(state, {
    choiceKind: "selectCards",
    seat: defendingSeat,
    label: `${getPlayer(state, defendingSeat).playerName} counter step`,
    details: "Select counter cards or pass.",
    sourceCardId: getInstance(state, state.battle.attackerId).cardId,
    sourceInstanceId: state.battle.attackerId,
    eventId: state.battle.id,
    options,
    minSelections: 0,
    maxSelections: options.length,
    context: {
      battleId: state.battle.id,
    },
    resolutionContext: {
      intent: "battleCounter",
      battleId: state.battle.id,
    },
  });
}

function createBattleLifeTriggerPrompt(
  state: MatchState,
  battle: NonNullable<MatchState["battle"]>,
  lifeCardId: string,
  resume: "continueDamage" | "completeBattle",
) {
  const defendingSeat = getInstance(state, battle.targetId).controller;
  const defender = getPlayer(state, defendingSeat);
  const lifeCard = getCardForInstance(state, lifeCardId);
  createChoicePrompt(state, {
    choiceKind: "confirm",
    seat: defendingSeat,
    label: `${defender.playerName} may activate a trigger`,
    details: `Resolve ${cardName(lifeCard)} from life?`,
    sourceCardId: lifeCard.id,
    sourceInstanceId: lifeCardId,
    eventId: battle.id,
    options: [
      { id: "activate", label: "Activate trigger", value: "activate" },
      { id: "skip", label: "Skip trigger", value: "skip" },
    ],
    minSelections: 0,
    maxSelections: 1,
    context: { battleId: battle.id },
    resolutionContext: {
      intent: "lifeTrigger",
      sourceInstanceId: lifeCardId,
      controller: defendingSeat,
      trigger: "trigger",
      damageKind: "battle",
      battleId: battle.id,
      resume,
    },
  });
}

export function queueBattleLifeTriggerPrompt(
  state: MatchState,
  battleId: string,
  lifeCardId: string,
) {
  const battle = state.battle;
  if (!battle || battle.id !== battleId) {
    return;
  }
  const lifeCard = state.cards[lifeCardId];
  const defendingSeat = getInstance(state, battle.targetId).controller;
  if (!lifeCard || lifeCard.controller !== defendingSeat || lifeCard.zone !== "resolution") {
    enqueueResolution(state, { kind: "battleDamageComplete", battleId });
    return;
  }
  createBattleLifeTriggerPrompt(state, battle, lifeCardId, "completeBattle");
}

function enqueueBattleDamageEffects(state: MatchState, battle: NonNullable<MatchState["battle"]>) {
  const attacker = getInstance(state, battle.attackerId);
  const defendingSeat = getInstance(state, battle.targetId).controller;
  const triggerEvent = {
    instanceId: battle.attackerId,
    effectController: attacker.controller,
    sourceInstanceId: battle.attackerId,
    targetInstanceId: battle.targetId,
  };
  enqueueEffectsForTrigger(
    state,
    battle.attackerId,
    attacker.controller,
    "whenDealsDamage",
    undefined,
    triggerEvent,
  );
  enqueueInPlayEffectsForTrigger(state, "whenYouDealDamage", triggerEvent, [attacker.controller]);
  enqueueInPlayEffectsForTrigger(
    state,
    "whenYouTakeDamage",
    {
      instanceId: battle.targetId,
      effectController: attacker.controller,
      targetInstanceId: battle.targetId,
    },
    [defendingSeat],
  );
}

export function continueLeaderDamage(state: MatchState) {
  const battle = state.battle;
  if (!battle || battle.damageRemaining === null) {
    return;
  }
  if (battle.damageRemaining === 0) {
    enqueueBattleDamageEffects(state, battle);
    enqueueResolution(state, { kind: "battleDamageComplete", battleId: battle.id });
    return;
  }

  const target = getInstance(state, battle.targetId);
  const defendingSeat = target.controller;
  const defender = getPlayer(state, defendingSeat);
  if (defender.life.length === 0) {
    if (battle.result === "hit") {
      battle.damageRemaining = 0;
      completeBattleResolution(state);
      return;
    }
    state.status = "finished";
    state.phase = "finished";
    state.winner = otherSeat(defendingSeat);
    battle.result = "hit";
    battle.damageRemaining = 0;
    emitEvent(state, "winnerDeclared", state.winner, {
      sourceCardId: getInstance(state, battle.attackerId).cardId,
      sourceInstanceId: battle.attackerId,
      targetIds: [battle.targetId],
      eventId: battle.id,
      visibility: "public",
      data: { winner: state.winner },
    });
    emitLog(
      state,
      "system",
      `${getPlayer(state, state.winner).playerName} wins by dealing the final damage.`,
      {
        sourceCardId: getInstance(state, battle.attackerId).cardId,
        sourceInstanceId: battle.attackerId,
        targetIds: [battle.targetId],
        eventId: battle.id,
        visibility: "public",
      },
    );
    completeBattleResolution(state);
    return;
  }

  const lifeCardId = defender.life[0]!;
  const lifeCard = getCardForInstance(state, lifeCardId);
  const banished = getKeywords(state, battle.attackerId).has("banish");
  const hasPrintedTrigger =
    (lifeCard.cardType === "character" ||
      lifeCard.cardType === "event" ||
      lifeCard.cardType === "stage") &&
    Boolean(lifeCard.trigger);
  const hasTrigger =
    !banished && (hasPrintedTrigger || effectBlocksFor(lifeCard, "trigger").length > 0);
  moveCard(
    state,
    lifeCardId,
    banished ? getInstance(state, lifeCardId).owner : defendingSeat,
    banished ? "trash" : hasTrigger ? "resolution" : "hand",
    {
      faceUp: banished || hasTrigger,
      publicKnowledge: banished || hasTrigger,
      visibility: banished ? "public" : "private",
      suppressLog: true,
      deferLifeRemovedTrigger: hasTrigger,
    },
  );
  battle.result = "hit";
  battle.damageRemaining -= 1;
  emitLog(
    state,
    "system",
    banished
      ? `${defender.playerName} trashes 1 Life card due to [Banish].`
      : `${defender.playerName} takes 1 damage.`,
    {
      targetIds: [battle.targetId],
      eventId: battle.id,
      visibility: banished ? "public" : "private",
      privateMessages: {
        [defendingSeat]: banished
          ? `${cardName(lifeCard)} was trashed from your Life by [Banish].`
          : hasTrigger
            ? `You revealed ${cardName(lifeCard)} from Life for its [Trigger].`
            : `You took ${cardName(lifeCard)} from Life to hand.`,
      },
      judgeMessage: banished
        ? `${defender.playerName} trashes ${cardName(lifeCard)} from Life due to [Banish].`
        : hasTrigger
          ? `${defender.playerName} reveals ${cardName(lifeCard)} from Life for its [Trigger].`
          : `${defender.playerName} takes ${cardName(lifeCard)} from Life to hand.`,
    },
  );

  if (hasTrigger) {
    if (battle.damageRemaining > 0) {
      createBattleLifeTriggerPrompt(state, battle, lifeCardId, "continueDamage");
      return;
    }
    enqueueResolution(state, {
      kind: "battleLifeTriggerPrompt",
      battleId: battle.id,
      lifeCardId,
    });
    enqueueBattleDamageEffects(state, battle);
    return;
  }

  if (battle.damageRemaining > 0) {
    enqueueResolution(state, { kind: "battleDamageContinue", battleId: battle.id });
    return;
  }
  enqueueBattleDamageEffects(state, battle);
  enqueueResolution(state, { kind: "battleDamageComplete", battleId: battle.id });
}

export function finalizeBattle(state: MatchState) {
  const battle = state.battle;
  if (!battle) {
    return;
  }

  const targetId = battle.targetId;
  const target = getInstance(state, targetId);
  battle.attackPower = getCardPower(state, battle.attackerId);
  battle.defensePower = getCardPower(state, targetId) + battle.counterTotal;
  battle.step = "damage";

  if (battle.attackPower >= battle.defensePower) {
    if (target.zone === "leader") {
      battle.damageRemaining = getKeywords(state, battle.attackerId).has("doubleAttack") ? 2 : 1;
      continueLeaderDamage(state);
      return;
    } else {
      const defendingSeat = target.controller;
      const defender = getPlayer(state, defendingSeat);
      if (isKoPreventedByModifier(state, battle.targetId, battle.attackerId, "battle")) {
        battle.result = "no_damage";
        emitLog(
          state,
          "system",
          `${cardName(getCardForInstance(state, battle.targetId))} cannot be K.O.'d.`,
          {
            targetIds: [battle.targetId],
            eventId: battle.id,
            visibility: "public",
          },
        );
        completeBattleResolution(state);
        return;
      }
      const replacementSource = battleKoReplacementSource(state, battle.targetId);
      const replacementAction = replacementSource?.effect.replacementAction;
      const trashReplacement =
        replacementAction?.action === "trashFromHand" && replacementAction.amount === 1
          ? replacementAction
          : null;
      const replacementHandIds = defender.hand.filter((instanceId) =>
        (trashReplacement?.filters ?? []).every((filter) => {
          const result = matchesTargetFilter(
            state,
            replacementSource?.sourceInstanceId ?? defender.leaderInstanceId,
            instanceId,
            filter,
          );
          return result.supported && result.matches;
        }),
      );
      const hasSnapshotTrashReplacement = hasFlagModifier(
        state,
        battle.targetId,
        "battleKoReplacement",
      );
      const canOfferTrashReplacement =
        (hasSnapshotTrashReplacement || trashReplacement !== null) && replacementHandIds.length > 0;
      const canOfferActionReplacement =
        replacementAction !== undefined && replacementAction.action !== "trashFromHand";
      if (canOfferActionReplacement && replacementSource?.effect.mandatory) {
        getInstance(state, replacementSource!.sourceInstanceId).usedEffectKeys.push(
          replacementSource!.effectKey,
        );
        enqueueResolution(
          state,
          {
            kind: "effectAction",
            sourceInstanceId: replacementSource!.sourceInstanceId,
            controller: defendingSeat,
            action: replacementAction,
            previousActionTargetIds: [battle.targetId],
          },
          { next: true },
        );
        battle.result = "no_damage";
        completeBattleResolution(state);
        return;
      }
      if (canOfferTrashReplacement || canOfferActionReplacement) {
        const isActionReplacement = canOfferActionReplacement;
        createChoicePrompt(state, {
          choiceKind: isActionReplacement ? "confirm" : "selectCards",
          seat: defendingSeat,
          label: `${defender.playerName} may replace the battle K.O.`,
          details: isActionReplacement
            ? "Apply the replacement effect instead of allowing the K.O.?"
            : "Trash 1 card from hand instead, or choose none to allow the K.O.",
          sourceCardId: getInstance(
            state,
            replacementSource?.sourceInstanceId ?? defender.leaderInstanceId,
          ).cardId,
          sourceInstanceId: replacementSource?.sourceInstanceId ?? defender.leaderInstanceId,
          eventId: battle.id,
          options: isActionReplacement
            ? [
                { id: "no", label: "Allow K.O.", value: "no" },
                { id: "yes", label: "Apply replacement", value: "yes" },
              ]
            : replacementHandIds.map((instanceId) => ({
                id: instanceId,
                label: cardName(getCardForInstance(state, instanceId)),
                value: instanceId,
                targetId: instanceId,
              })),
          minSelections: 0,
          maxSelections: 1,
          context: { battleId: battle.id, replacement: "battleKo" },
          resolutionContext: {
            intent: "battleKoReplacement",
            battleId: battle.id,
            targetId: battle.targetId,
            controller: defendingSeat,
            candidateIds: replacementHandIds,
            sourceInstanceId: replacementSource?.sourceInstanceId,
            replacementEffectIndex: replacementSource?.replacementEffectIndex,
            replacementEvent: replacementSource?.effect.replacedEvent,
            replacementEffectKey: replacementSource?.effectKey,
            replacementAction: isActionReplacement ? replacementAction : undefined,
          },
        });
        return;
      }
      koBattleCharacter(state);
    }
  } else {
    battle.result = battle.blockerId ? "blocked" : "no_damage";
    emitLog(state, "system", "The attack does not deal damage.", {
      eventId: battle.id,
      visibility: "public",
    });
  }

  completeBattleResolution(state);
}

export function continueEffectDamage(
  state: MatchState,
  sourceInstanceId: string,
  controller: MatchSeat,
  targetSeat: MatchSeat,
  remaining: number,
) {
  if (state.status === "finished") {
    return;
  }

  const target = getPlayer(state, targetSeat);
  if (remaining === 0) {
    const dealtDamageEvent = {
      instanceId: sourceInstanceId,
      effectController: controller,
      sourceInstanceId,
      targetInstanceId: target.leaderInstanceId,
    };
    enqueueInPlayEffectsForTrigger(state, "whenYouDealDamage", dealtDamageEvent, [controller]);
    enqueueInPlayEffectsForTrigger(
      state,
      "whenYouTakeDamage",
      {
        instanceId: target.leaderInstanceId,
        effectController: controller,
        targetInstanceId: target.leaderInstanceId,
        sourceInstanceId,
      },
      [targetSeat],
    );
    return;
  }
  if (target.life.length === 0) {
    state.status = "finished";
    state.phase = "finished";
    state.winner = controller;
    emitEvent(state, "winnerDeclared", controller, {
      sourceCardId: getInstance(state, sourceInstanceId).cardId,
      sourceInstanceId,
      targetIds: [target.leaderInstanceId],
      visibility: "public",
      data: { winner: controller },
    });
    emitLog(
      state,
      "system",
      `${getPlayer(state, controller).playerName} wins by dealing the final damage.`,
      {
        sourceCardId: getInstance(state, sourceInstanceId).cardId,
        sourceInstanceId,
        targetIds: [target.leaderInstanceId],
        visibility: "public",
      },
    );
    return;
  }

  const lifeCardId = target.life[0]!;
  const lifeCard = getCardForInstance(state, lifeCardId);
  const hasPrintedTrigger =
    (lifeCard.cardType === "character" ||
      lifeCard.cardType === "event" ||
      lifeCard.cardType === "stage") &&
    Boolean(lifeCard.trigger);
  const hasTrigger = hasPrintedTrigger || effectBlocksFor(lifeCard, "trigger").length > 0;
  moveCard(state, lifeCardId, targetSeat, hasTrigger ? "resolution" : "hand", {
    faceUp: hasTrigger,
    publicKnowledge: hasTrigger,
    visibility: "private",
    suppressLog: true,
    deferLifeRemovedTrigger: hasTrigger,
  });
  emitLog(state, "system", `${target.playerName} takes 1 damage.`, {
    sourceCardId: getInstance(state, sourceInstanceId).cardId,
    sourceInstanceId,
    targetIds: [target.leaderInstanceId],
    visibility: "private",
    privateMessages: {
      [targetSeat]: hasTrigger
        ? `You revealed ${cardName(lifeCard)} from Life for its [Trigger].`
        : `You took ${cardName(lifeCard)} from Life to hand.`,
    },
    judgeMessage: hasTrigger
      ? `${target.playerName} reveals ${cardName(lifeCard)} from Life for its [Trigger].`
      : `${target.playerName} takes ${cardName(lifeCard)} from Life to hand.`,
  });

  const damageRemaining = remaining - 1;
  if (hasTrigger) {
    createChoicePrompt(state, {
      choiceKind: "confirm",
      seat: targetSeat,
      label: `${target.playerName} may activate a trigger`,
      details: `Resolve ${cardName(lifeCard)} from life?`,
      sourceCardId: lifeCard.id,
      sourceInstanceId: lifeCardId,
      eventId: null,
      options: [
        { id: "activate", label: "Activate trigger", value: "activate" },
        { id: "skip", label: "Skip trigger", value: "skip" },
      ],
      minSelections: 0,
      maxSelections: 1,
      context: { damageKind: "effect" },
      resolutionContext: {
        intent: "lifeTrigger",
        sourceInstanceId: lifeCardId,
        controller: targetSeat,
        trigger: "trigger",
        damageKind: "effect",
        damageSourceInstanceId: sourceInstanceId,
        damageController: controller,
        damageTargetSeat: targetSeat,
        damageRemaining,
      },
    });
    return;
  }

  if (damageRemaining > 0) {
    enqueueResolution(
      state,
      {
        kind: "effectDamageContinue",
        sourceInstanceId,
        controller,
        targetSeat,
        remaining: damageRemaining,
      },
      { next: true },
    );
    return;
  }
  continueEffectDamage(state, sourceInstanceId, controller, targetSeat, 0);
}

export function blockerCandidates(
  state: MatchState,
  seat: MatchSeat,
  attackTargetId?: string,
): string[] {
  const player = getPlayer(state, seat);
  return [
    ...(player.leaderInstanceId !== attackTargetId ? [player.leaderInstanceId] : []),
    ...player.characterArea.filter((instanceId): instanceId is string => Boolean(instanceId)),
  ].filter((instanceId) => {
    const instance = getInstance(state, instanceId);
    return (
      !instance.rested &&
      !hasFlagModifier(state, instanceId, "cannotBeRested") &&
      !isKeywordActivationPrevented(state, instanceId, "blocker") &&
      getKeywords(state, instanceId).has("blocker")
    );
  });
}

export function canAttackWith(state: MatchState, seat: MatchSeat, attackerId: string): boolean {
  const attacker = getInstance(state, attackerId);
  if (
    attacker.controller !== seat ||
    (attacker.zone !== "leader" && attacker.zone !== "character")
  ) {
    return false;
  }
  if (
    attacker.rested ||
    hasFlagModifier(state, attackerId, "cannotBeRested") ||
    hasFlagModifier(state, attackerId, "cannotAttack") ||
    isAttackPreventedByPermanentEffect(state, attackerId)
  ) {
    return false;
  }
  if (state.turnNumber === 1 && state.activeSeat === state.config.firstPlayer) {
    return false;
  }
  if (attacker.zone === "character" && attacker.playedOnTurn === state.turnNumber) {
    const keywords = getKeywords(state, attackerId);
    if (!keywords.has("rush") && !keywords.has("rushCharacter")) {
      return false;
    }
  }
  return true;
}

export function legalAttackTargets(
  state: MatchState,
  seat: MatchSeat,
  attackerId: string,
): string[] {
  const defender = getPlayer(state, otherSeat(seat));
  const attacker = getInstance(state, attackerId);
  const keywords = getKeywords(state, attackerId);
  const hasRushCharacterOnly =
    attacker.zone === "character" &&
    attacker.playedOnTurn === state.turnNumber &&
    keywords.has("rushCharacter") &&
    !keywords.has("rush");
  const targets = hasRushCharacterOnly ? [] : [defender.leaderInstanceId];
  for (const instanceId of defender.characterArea) {
    if (!instanceId) {
      continue;
    }
    const target = getInstance(state, instanceId);
    if (
      target.rested ||
      hasFlagModifier(state, attackerId, "canAttackActive") ||
      canAttackActiveByPermanentEffect(state, attackerId)
    ) {
      targets.push(instanceId);
    }
  }
  const restrictions = Object.values(state.modifiers).filter(
    (modifier) =>
      modifier.type === "attackRestriction" &&
      (modifier.targetId === attackerId ||
        (modifier.playerScope === true &&
          modifier.targetId === getPlayer(state, attacker.controller).leaderInstanceId)),
  );
  return targets.filter(
    (targetId) =>
      isAttackTargetAllowedByPermanentEffects(state, attackerId, targetId) &&
      restrictions.every((modifier) => {
        const matches = (modifier.attackTargetFilters ?? []).every((filter) => {
          const result = matchesTargetFilter(state, attackerId, targetId, filter);
          return result.supported && result.matches;
        });
        return modifier.attackRestriction === "cannotAttack" ? !matches : matches;
      }),
  );
}

export function attackHandTrashCost(state: MatchState, attackerId: string): number {
  return Object.values(state.modifiers)
    .filter(
      (modifier) =>
        modifier.type === "flag" &&
        modifier.flag === "attackHandTrashCost" &&
        modifier.targetId === attackerId,
    )
    .reduce((total, modifier) => total + (modifier.value ?? 0), 0);
}

export function beginAttack(
  state: MatchState,
  seat: MatchSeat,
  attackerId: string,
  targetId: string,
) {
  const attacker = getInstance(state, attackerId);
  restCard(state, attackerId, seat);
  state.battle = {
    id: nextIdentifier(state, "battle"),
    attackerId,
    originalTargetId: targetId,
    targetId,
    defendingSeat: otherSeat(seat),
    step: "block",
    blockerId: null,
    counterCardIds: [],
    counterTotal: 0,
    attackPower: getCardPower(state, attackerId),
    defensePower: getCardPower(state, targetId),
    damageRemaining: null,
    result: "pending",
  };
  emitEvent(state, "attackDeclared", seat, {
    sourceCardId: attacker.cardId,
    sourceInstanceId: attackerId,
    targetIds: [targetId],
    eventId: state.battle.id,
    visibility: "public",
  });
  emitLog(
    state,
    seat,
    `${cardName(getCardForInstance(state, attackerId))} attacks ${cardName(getCardForInstance(state, targetId))}.`,
    {
      sourceCardId: attacker.cardId,
      sourceInstanceId: attackerId,
      targetIds: [targetId],
      eventId: state.battle.id,
      visibility: "public",
    },
  );
  const attackEvent = {
    instanceId: attackerId,
    effectController: seat,
    targetInstanceId: targetId,
  };
  enqueueEffectsForTrigger(state, attackerId, seat, "whenAttacking", undefined, attackEvent);
  enqueueInPlayEffectsForTrigger(state, "onOpponentAttack", attackEvent, [otherSeat(seat)]);
  enqueueResolution(state, { kind: "battleBlockStep", battleId: state.battle.id });
}

export function resolvePrompt(
  state: MatchState,
  command: Extract<GameCommand, { type: "resolvePrompt" }>,
): boolean {
  const prompt = state.promptQueue.find((candidate) => candidate.id === command.promptId);
  if (!prompt || prompt.seat !== command.seat) {
    return false;
  }

  switch (prompt.resolutionContext?.intent) {
    case "battleAttackHandTrashCost": {
      const context = prompt.resolutionContext;
      const selectedIds = command.selectedIds ?? [];
      const hand = getPlayer(state, context.controller).hand;
      if (
        selectedIds.length !== context.amount ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) => !context.candidateIds.includes(instanceId) || !hand.includes(instanceId),
        )
      ) {
        return false;
      }
      for (const instanceId of selectedIds) {
        moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: context.controller,
        });
      }
      beginAttack(state, context.controller, context.attackerId, context.targetId);
      return true;
    }
    case "battleBlocker": {
      const battle = state.battle;
      if (!battle) {
        return true;
      }
      const selectedIds =
        command.selectedIds ??
        (command.optionId && command.optionId !== "skip" ? [command.optionId] : []);
      const legalIds = prompt.options
        .filter((option) => option.enabled !== false)
        .map((option) => option.id);
      if (
        selectedIds.length > 1 ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !legalIds.includes(instanceId))
      ) {
        return false;
      }
      const blockerId = selectedIds[0] && selectedIds[0] !== "skip" ? selectedIds[0] : null;
      if (blockerId) {
        battle.blockerId = blockerId;
        battle.targetId = blockerId;
        restCard(state, blockerId, command.seat);
        const blockEvent = {
          instanceId: blockerId,
          effectController: command.seat,
          targetInstanceId: battle.attackerId,
        };
        enqueueEffectsForTrigger(state, blockerId, command.seat, "onBlock", undefined, blockEvent);
        enqueueInPlayEffectsForTrigger(state, "whenBlockerActivated", blockEvent);
        emitLog(
          state,
          command.seat,
          `${cardName(getCardForInstance(state, blockerId))} blocks the attack.`,
          {
            targetIds: [blockerId],
            eventId: battle.id,
            visibility: "public",
          },
        );
      } else {
        emitLog(
          state,
          command.seat,
          `${getPlayer(state, command.seat).playerName} declines to block.`,
          {
            eventId: battle.id,
            visibility: "public",
          },
        );
      }
      battle.step = "counter";
      enqueueResolution(state, {
        kind: "battleCounterStep",
        battleId: battle.id,
      });
      return true;
    }
    case "battleCounter": {
      const battle = state.battle;
      if (!battle) {
        return true;
      }
      const selectedIds = command.selectedIds ?? [];
      const player = getPlayer(state, command.seat);
      if (
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some((instanceId) => !player.hand.includes(instanceId))
      ) {
        return false;
      }
      const selectedCards = selectedIds.map((instanceId) => ({
        card: getCardForInstance(state, instanceId),
        counter: getCardCounter(state, instanceId),
      }));
      if (
        selectedCards.some(
          ({ card, counter }) =>
            !(card.cardType === "character" && counter > 0) &&
            !(card.cardType === "event" && effectBlocksFor(card, "counter").length > 0),
        )
      ) {
        return false;
      }
      const eventCost = selectedCards.reduce(
        (total, { card }) => total + (card.cardType === "event" ? baseCost(card) : 0),
        0,
      );
      if (eventCost > player.activeDon) {
        return false;
      }
      player.activeDon -= eventCost;
      player.restedDon += eventCost;
      let counterTotal = 0;

      for (const instanceId of selectedIds) {
        const card = getCardForInstance(state, instanceId);
        if (card.cardType === "character" && getCardCounter(state, instanceId) > 0) {
          counterTotal += getCardCounter(state, instanceId);
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
          });
        } else if (card.cardType === "event") {
          moveCard(state, instanceId, getInstance(state, instanceId).owner, "trash", {
            faceUp: true,
            publicKnowledge: true,
            actor: command.seat,
          });
          enqueueEffectsForTrigger(state, instanceId, command.seat, "counter", undefined);
          const triggerEvent = { instanceId, effectController: command.seat };
          enqueueInPlayEffectsForTrigger(state, "whenYouActivateEvent", triggerEvent, [
            command.seat,
          ]);
          enqueueInPlayEffectsForTrigger(state, "whenOpponentActivatesEvent", triggerEvent, [
            otherSeat(command.seat),
          ]);
        }
      }

      battle.counterCardIds = selectedIds;
      battle.counterTotal += counterTotal;
      enqueueResolution(state, {
        kind: "battleFinalize",
        battleId: battle.id,
      });
      return true;
    }
    case "battleKoReplacement": {
      const context = prompt.resolutionContext;
      const battle = state.battle;
      if (
        !battle ||
        battle.id !== context.battleId ||
        battle.targetId !== context.targetId ||
        command.seat !== context.controller
      ) {
        return false;
      }
      if (context.replacementAction) {
        if (command.optionId !== "yes" && command.optionId !== "no") {
          return false;
        }
        if (command.optionId === "yes") {
          if (
            context.sourceInstanceId !== undefined &&
            context.replacementEffectIndex !== undefined
          ) {
            getInstance(state, context.sourceInstanceId).usedEffectKeys.push(
              context.replacementEffectKey ??
                `replacement:${context.replacementEvent ?? "ko"}:${context.replacementEffectIndex}`,
            );
          }
          enqueueResolution(
            state,
            {
              kind: "effectAction",
              sourceInstanceId:
                context.sourceInstanceId ?? getPlayer(state, context.controller).leaderInstanceId,
              controller: context.controller,
              action: context.replacementAction,
              previousActionTargetIds: [context.targetId],
            },
            { next: true },
          );
          battle.result = "no_damage";
        } else {
          koBattleCharacter(state);
        }
        completeBattleResolution(state);
        return true;
      }
      const selectedIds = command.selectedIds ?? [];
      const hand = getPlayer(state, context.controller).hand;
      if (
        selectedIds.length > 1 ||
        new Set(selectedIds).size !== selectedIds.length ||
        selectedIds.some(
          (instanceId) => !context.candidateIds.includes(instanceId) || !hand.includes(instanceId),
        )
      ) {
        return false;
      }
      const replacementId = selectedIds[0];
      if (replacementId) {
        if (
          context.sourceInstanceId !== undefined &&
          context.replacementEffectIndex !== undefined
        ) {
          getInstance(state, context.sourceInstanceId).usedEffectKeys.push(
            context.replacementEffectKey ??
              `replacement:${context.replacementEvent ?? "ko"}:${context.replacementEffectIndex}`,
          );
        }
        moveCard(state, replacementId, getInstance(state, replacementId).owner, "trash", {
          faceUp: true,
          publicKnowledge: true,
          actor: context.controller,
        });
        battle.result = "no_damage";
        emitLog(
          state,
          context.controller,
          `${getPlayer(state, context.controller).playerName} trashes ${cardName(getCardForInstance(state, replacementId))} instead of the Character being K.O.'d in battle.`,
          {
            sourceCardId: getInstance(state, replacementId).cardId,
            sourceInstanceId: replacementId,
            targetIds: [context.targetId],
            eventId: battle.id,
            visibility: "public",
          },
        );
      } else {
        koBattleCharacter(state);
      }
      completeBattleResolution(state);
      return true;
    }
    case "lifeTrigger": {
      const lifeCardId = prompt.sourceInstanceId;
      if (command.optionId === "activate" && prompt.sourceInstanceId) {
        enqueueEffectsForTrigger(
          state,
          prompt.sourceInstanceId,
          command.seat,
          "trigger",
          undefined,
        );
        enqueueInPlayEffectsForTrigger(state, "whenTriggerActivates", {
          instanceId: prompt.sourceInstanceId,
          effectController: command.seat,
          sourceInstanceId: prompt.sourceInstanceId,
          sourceFromZone: "life",
        });
      } else if (prompt.sourceInstanceId) {
        moveCard(state, prompt.sourceInstanceId, command.seat, "hand", {
          faceUp: false,
          publicKnowledge: false,
          actor: command.seat,
          visibility: "private",
        });
        enqueueInPlayEffectsForTrigger(
          state,
          "whenLifeAddedToHand",
          {
            instanceId: prompt.sourceInstanceId,
            effectController: command.seat,
            targetInstanceId: getPlayer(state, command.seat).leaderInstanceId,
          },
          [command.seat],
        );
        emitLog(
          state,
          command.seat,
          `${getPlayer(state, command.seat).playerName} skips the trigger and adds the card to hand.`,
          {
            sourceCardId: prompt.sourceCardId,
            sourceInstanceId: prompt.sourceInstanceId,
            visibility: "private",
            privateMessages: {
              [command.seat]: `You skipped ${cardName(getCardForInstance(state, prompt.sourceInstanceId))}'s [Trigger] and added it to your hand.`,
            },
          },
        );
      } else {
        emitLog(
          state,
          command.seat,
          `${getPlayer(state, command.seat).playerName} skips the trigger.`,
          {
            sourceCardId: prompt.sourceCardId,
            sourceInstanceId: prompt.sourceInstanceId,
            visibility: "public",
          },
        );
      }
      if (lifeCardId) {
        if (prompt.resolutionContext.damageKind === "battle") {
          const battle = state.battle;
          if (battle) {
            enqueueLifeRemovedAfterDamage(
              state,
              lifeCardId,
              command.seat,
              getInstance(state, battle.attackerId).controller,
            );
          }
        } else {
          enqueueLifeRemovedAfterDamage(
            state,
            lifeCardId,
            command.seat,
            prompt.resolutionContext.damageController,
          );
        }
      }
      if (prompt.resolutionContext.damageKind === "battle") {
        enqueueResolution(state, {
          kind:
            prompt.resolutionContext.resume === "continueDamage"
              ? "battleDamageContinue"
              : "battleDamageComplete",
          battleId: prompt.resolutionContext.battleId,
        });
      } else {
        enqueueResolution(state, {
          kind: "effectDamageContinue",
          sourceInstanceId: prompt.resolutionContext.damageSourceInstanceId,
          controller: prompt.resolutionContext.damageController,
          targetSeat: prompt.resolutionContext.damageTargetSeat,
          remaining: prompt.resolutionContext.damageRemaining,
        });
      }
      return true;
    }
    case "judge":
      emitLog(state, "judge", command.note ?? "Judge acknowledged the prompt.", {
        sourceCardId: prompt.sourceCardId,
        sourceInstanceId: prompt.sourceInstanceId,
        visibility: "judge",
        judgeMessage: command.note ?? "Judge acknowledged the prompt.",
      });
      return true;
    default:
      return false;
  }
}
