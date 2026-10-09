import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { Effect } from "@tcg/cyberpunk-types";
import type {
  AttackState,
  DefeatReplacementContinuation,
  FightResult,
  MatchState,
  PreventGigStealPendingChoice,
} from "../types/match-state.ts";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";
import {
  filterGigsByAttackerPowerCap,
  findFriendlyDefeatRedirect,
  findSacrificialAttachedGear,
  getEffectivePower,
  getEffectiveRules,
  listSacrificialAttachedGear,
  markDefeatAtEndOfTurnIfAttacked,
} from "../active-effects/index.ts";
import { availableEddies, canSpendSelectedEddies } from "./eddie-resources.ts";
import {
  continueTriggerResolution,
  enqueueEventTriggers,
  processEventTriggers,
  resumeCurrentTrigger,
} from "../ability-executor.ts";
import { getDefinitionFor } from "../state/lookups.ts";
import { maybeEndAttackIfParticipantsLeft } from "./end-attack.ts";
import { removeFromGameIfLegendMovesToInvalidArea } from "./remove-from-game.ts";
import { captureDefeatedCardSnapshot } from "../state/defeated-card-snapshot.ts";
import { resumeSuspendedEndTurn } from "./pass-phase.ts";
import { formatStolenGigSummary, type StolenGigLogEntry } from "../logging/stolen-gig-summary.ts";
export interface ResolveAttackInput extends MoveInput {
  args: {
    gigIdsToSteal?: string[];
    pass?: boolean;
  };
}

export const resolveAttackMove: MoveDefinition<ResolveAttackInput> = {
  available({ state, playerId }) {
    const attack = state.G.attackState;
    if (!attack) return false;
    if (attack.step === "react" && attack.rivalId === playerId) return true;
    if (attack.step === "attack" && state.G.turnMetadata.activePlayerId === playerId) return true;
    if (
      (attack.step === "fight" || attack.step === "fightResult" || attack.step === "steal") &&
      state.G.turnMetadata.activePlayerId === playerId
    )
      return true;
    return false;
  },

  validate({ state, playerId }) {
    const attack = state.G.attackState;
    if (!attack) return { valid: false, error: "No attack in progress", errorCode: "NO_ATTACK" };
    // Only React is a player decision; the other steps are mechanical.
    if (attack.step === "react" && attack.rivalId !== playerId)
      return {
        valid: false,
        error: "Another player is resolving combat",
        errorCode: "NOT_PRIORITY_OWNER",
      };
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const attack = state.G.attackState;
    if (!attack) return;
    if (maybeEndAttackIfParticipantsLeft(state, operations)) return;

    if (attack.step === "attack") {
      operations.game.setAttackState({ ...attack, step: "react" });
      return;
    }

    if (attack.step === "react") {
      if (input.args.pass) {
        const nextStep = attack.kind === "fight" ? "fight" : "steal";
        const attackerName = state.G.cardIndex[attack.attackerId as string]
          ? getDefinitionFor(state.G, attack.attackerId as string).displayName
          : "";
        operations.log.emit({
          type: "reactPass",
          playerId,
          timestamp: Date.now(),
          turnNumber: state.G.turnMetadata.turnNumber,
          attackerId: attack.attackerId,
          attackerName,
        });
        operations.game.setAttackState({ ...attack, step: nextStep });
      }
      return;
    }

    if (attack.step === "fight") {
      executeFight(state, playerId, operations, attack);
      return;
    }

    if (attack.step === "fightResult") {
      executeFightResult(state, operations, attack);
      return;
    }

    if (attack.step === "steal") {
      executeSteal(state, playerId, input, operations, attack);
    }
  },
};

function executeFight(
  state: import("../types/match-state.ts").MatchState,
  playerId: import("../types/branded.ts").PlayerId,
  operations: import("../operations/index.ts").Operations,
  attack: AttackState,
) {
  if (!attack.defenderId) return;

  // CR 9.16: both the attacking and defending Units fight when the Fight
  // Step actually begins. Mark them here, after reactions and redirects have
  // settled, so an attack that ends early does not satisfy "fights."
  markDefeatAtEndOfTurnIfAttacked(state, attack.attackerId);
  markDefeatAtEndOfTurnIfAttacked(state, attack.defenderId);

  const attackerPower = getEffectivePower(state, attack.attackerId as string);
  const defenderPower = getEffectivePower(state, attack.defenderId as string);

  const autoWinner = fightAutoWinner(state, attack);

  let result: FightResult;
  if (autoWinner === "attacker") {
    result = "attackerWins";
  } else if (autoWinner === "defender") {
    result = "defenderWins";
  } else if (attackerPower > defenderPower) {
    result = "attackerWins";
  } else if (defenderPower > attackerPower) {
    result = "defenderWins";
  } else {
    result = "mutual";
  }

  // Losers whose defeat a sacrificial Gear will absorb (CR: defeat the Gear
  // instead). Resolved up front so the fight log and the result beat can label
  // the substitution; executeDefeat still performs it mechanically.
  const attackerCanDefeat = attackerPower > 0;
  const defenderCanDefeat = defenderPower > 0;
  const fightLosers: (CardInstanceId | null)[] =
    result === "mutual"
      ? [attack.attackerId, attack.defenderId]
      : result === "attackerWins"
        ? [attack.defenderId]
        : [attack.attackerId];
  const preventedCardIds = fightLosers.filter((cardId): cardId is CardInstanceId => {
    if (!cardId) return false;
    if (cardId === attack.attackerId ? !defenderCanDefeat : !attackerCanDefeat) return false;
    const card = state.G.cardIndex[cardId as string];
    if (!card || card.zone !== "field") return false;
    return findSacrificialAttachedGear(state, cardId as string) !== null;
  });
  const preventionSourceCardNames = preventedCardIds.map(
    (cardId) =>
      getDefinitionFor(state.G, findSacrificialAttachedGear(state, cardId as string) as string)
        .displayName,
  );

  const resolvedAttack: AttackState = {
    ...attack,
    kind: "fight",
    step: "fightResult",
    fightResolution: {
      result,
      attackerPower,
      defenderPower,
      protectedCardIds: [],
      preventionSourceCardNames,
      ...(preventedCardIds.length > 0 ? { preventedCardIds } : {}),
    },
  };
  // CR 9.18: store the determined result while fight triggers resolve. The
  // following mechanical step applies the result only after that window drains.
  operations.game.setAttackState(resolvedAttack);
  const fightResolvedEvent = {
    type: "attackResolved" as const,
    attackerId: attack.attackerId,
    defenderId: attack.defenderId,
    rivalId: attack.rivalId,
    attackKind: "fight" as const,
    result,
    ...(preventedCardIds.length > 0 ? { preventedCardIds } : {}),
    playerId,
  };
  operations.event.emit(fightResolvedEvent);
  enqueueEventTriggers(fightResolvedEvent, state, operations);
  enqueueFightActiveEffects(state, operations, resolvedAttack, fightResolvedEvent);
  continueTriggerResolution(state, operations);
}

function executeFightResult(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  attack: Extract<AttackState, { step: "fightResult" }>,
): void {
  const resolution = attack.fightResolution;
  if (
    state.G.turnMetadata.pendingChoice ||
    state.G.turnMetadata.currentTrigger ||
    state.G.turnMetadata.triggerQueue.length > 0
  )
    return;
  const defenderId = attack.defenderId;
  if (!defenderId) throw new Error("Fight result requires a defender");
  const attackerName = getDefinitionFor(state.G, attack.attackerId as string).displayName;
  const defenderName = getDefinitionFor(state.G, defenderId as string).displayName;
  operations.event.emit({
    type: "actionLog",
    messageKey: fightMessageKey(resolution.result, resolution.protectedCardIds, attack),
    params: {
      attackerName,
      defenderName,
      attackerPower: resolution.attackerPower,
      defenderPower: resolution.defenderPower,
      ...(resolution.preventionSourceCardNames.length > 0
        ? { sourceCardName: resolution.preventionSourceCardNames.join(" and ") }
        : {}),
    },
    playerId: state.G.turnMetadata.activePlayerId,
    category: "combat",
    cardIds: [attack.attackerId as string, defenderId as string],
  });
  executeDefeat(state, operations, attack);
}

function fightMessageKey(
  result: FightResult,
  protectedCardIds: CardInstanceId[],
  attack: Extract<AttackState, { step: "fightResult" }>,
): import("../types/game-events.ts").ActionLogMessageKey {
  const prevented = attack.fightResolution?.preventedCardIds ?? [];
  const attackerProtected =
    protectedCardIds.includes(attack.attackerId) || prevented.includes(attack.attackerId);
  const defenderProtected =
    attack.defenderId !== null &&
    (protectedCardIds.includes(attack.defenderId) || prevented.includes(attack.defenderId));
  if (defenderProtected && result === "attackerWins") {
    return "move.resolveAttack.fight.attackerWins.prevented";
  }
  if (attackerProtected && result === "defenderWins") {
    return "move.resolveAttack.fight.defenderWins.prevented";
  }
  if (attackerProtected && defenderProtected && result === "mutual") {
    return "move.resolveAttack.fight.mutual.bothPrevented";
  }
  if (attackerProtected && result === "mutual") {
    return "move.resolveAttack.fight.mutual.attackerPrevented";
  }
  if (defenderProtected && result === "mutual") {
    return "move.resolveAttack.fight.mutual.prevented";
  }
  switch (result) {
    case "attackerWins":
      return "move.resolveAttack.fight.attackerWins";
    case "defenderWins":
      return "move.resolveAttack.fight.defenderWins";
    case "mutual":
      return "move.resolveAttack.fight.mutual";
  }
}

/**
 * Defeat a host card and fire {Defeated} on both the host and any attached Gear
 * that left the field with it (e.g. The Relic — Experimental Biochip).
 */
function sacrificeGearInsteadOfHost(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  hostId: CardInstanceId,
  gearId: CardInstanceId,
  defeatedBy: CardInstanceId | null,
  playerId: PlayerId,
  eventMode: "deferred" | "immediate" = "immediate",
): void {
  const snapshot = captureDefeatedCardSnapshot(state, gearId);
  operations.card.detachGear(gearId);
  operations.zone.moveCard(gearId, "trash", playerId);
  const gear = state.G.cardIndex[gearId as string];
  const gearEvent = {
    type: "cardDefeated" as const,
    cardId: gearId,
    defeatedBy,
    playerId: gear?.controllerId ?? playerId,
    hostId,
    snapshot,
  };
  operations.event.emit(gearEvent);
  if (eventMode === "immediate") processEventTriggers(gearEvent, state, operations);
}

function defeatHostAndAttachedGear(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  hostId: import("../types/branded.ts").CardInstanceId,
  defeatedBy: import("../types/branded.ts").CardInstanceId | null,
  playerId: PlayerId,
  eventMode: "deferred" | "immediate" = "immediate",
): void {
  const sacrificialGearId = findSacrificialAttachedGear(state, hostId as string);
  if (sacrificialGearId) {
    sacrificeGearInsteadOfHost(
      state,
      operations,
      hostId,
      sacrificialGearId,
      defeatedBy,
      playerId,
      eventMode,
    );
    return;
  }
  const host = state.G.cardIndex[hostId as string];
  const hostSnapshot = captureDefeatedCardSnapshot(state, hostId);
  const attachedGearIds = [...(host?.meta.attachedGearIds ?? [])];
  const attachedGearSnapshots = attachedGearIds.map((gearId) => ({
    gearId,
    snapshot: captureDefeatedCardSnapshot(state, gearId),
  }));
  const defeatedHostId = host?.meta.attachedToId;
  if (defeatedHostId) {
    operations.card.detachGear(hostId);
  }
  operations.card.moveAttachedGear(hostId, "trash", { detachAfterMove: true });
  operations.zone.moveCard(hostId, "trash", playerId);
  const hostEvent = {
    type: "cardDefeated" as const,
    cardId: hostId,
    defeatedBy,
    playerId,
    snapshot: hostSnapshot,
    // Defeated Gear must retain its former host for host-targeted triggers.
    ...(defeatedHostId ? { hostId: defeatedHostId } : {}),
  };
  operations.event.emit(hostEvent);
  if (eventMode === "immediate") enqueueEventTriggers(hostEvent, state, operations);
  removeFromGameIfLegendMovesToInvalidArea(state, operations, hostId);
  if (eventMode === "immediate") continueTriggerResolution(state, operations);

  for (const { gearId, snapshot } of attachedGearSnapshots) {
    const gear = state.G.cardIndex[gearId as string];
    if (!gear) continue;
    const gearEvent = {
      type: "cardDefeated" as const,
      cardId: gearId as import("../types/branded.ts").CardInstanceId,
      defeatedBy,
      playerId: gear.controllerId,
      hostId,
      snapshot,
    };
    operations.event.emit(gearEvent);
    if (eventMode === "immediate") processEventTriggers(gearEvent, state, operations);
  }
}

function offerFriendlyDefeatRedirect(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  remaining: readonly CardInstanceId[],
  continuation: DefeatReplacementContinuation,
  skippedReplacementIds: ReadonlySet<string> = new Set(),
): boolean {
  const redirectable = remaining.find((cardId) => {
    const jackieId = findFriendlyDefeatRedirect(state, cardId as string, skippedReplacementIds);
    if (!jackieId) return false;
    const jackie = state.G.cardIndex[jackieId as string];
    if (!jackie) return false;
    return availableEddies(state, jackie.controllerId) >= 1;
  });
  if (!redirectable) return false;
  const jackieId = findFriendlyDefeatRedirect(
    state,
    redirectable as string,
    skippedReplacementIds,
  )!;
  const jackie = state.G.cardIndex[jackieId as string]!;
  operations.game.setPendingChoice({
    type: "redirectDefeat",
    chooserId: jackie.controllerId,
    effectId: jackieId as string,
    payload: {
      protectedCardId: redirectable,
      replacementCardId: jackieId,
      cost: 1,
      continuation: {
        ...continuation,
        remainingCardIds: remaining.filter((id) => id !== redirectable),
      },
      skippedReplacementIds: [...skippedReplacementIds] as CardInstanceId[],
    },
  });
  return true;
}

function offerSacrificialGearChoice(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  hostId: CardInstanceId,
  gearIds: readonly CardInstanceId[],
  remainingCardIds: readonly CardInstanceId[],
  continuation: DefeatReplacementContinuation,
  defeatedBy: CardInstanceId | null,
): boolean {
  const host = state.G.cardIndex[hostId as string];
  if (!host || gearIds.length < 2) return false;
  operations.game.setPendingChoice({
    type: "chooseSacrificialGear",
    chooserId: host.controllerId,
    effectId: hostId as string,
    payload: {
      hostId,
      gearIds: [...gearIds],
      continuation: { ...continuation, remainingCardIds: [...remainingCardIds] },
      defeatedBy,
    },
  });
  return true;
}

function continuePendingDefeats(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  pendingDefeats: readonly CardInstanceId[],
  continuation: DefeatReplacementContinuation,
  attack?: AttackState,
  skippedReplacementIds: ReadonlySet<string> = new Set(),
  resumingChoice = false,
): void {
  const eventMode = continuation.kind === "effect" && !resumingChoice ? "deferred" : "immediate";
  const remaining: CardInstanceId[] = [];
  for (let i = 0; i < pendingDefeats.length; i++) {
    const cardId = pendingDefeats[i]!;
    if (!state.G.cardIndex[cardId as string]) continue;
    if (continuation.kind === "fight" && state.G.cardIndex[cardId as string]?.zone !== "field")
      continue;
    const gears = listSacrificialAttachedGear(state, cardId as string);
    if (gears.length >= 2) {
      const rest = [...remaining, ...pendingDefeats.slice(i + 1)];
      const defeatedBy = defeatSourceFor(cardId, continuation, attack);
      offerSacrificialGearChoice(state, operations, cardId, gears, rest, continuation, defeatedBy);
      return;
    }
    if (gears.length === 1) {
      const card = state.G.cardIndex[cardId as string];
      defeatHostAndAttachedGear(
        state,
        operations,
        cardId,
        defeatSourceFor(cardId, continuation, attack),
        card!.controllerId,
        eventMode,
      );
      continue;
    }
    remaining.push(cardId);
  }

  if (
    offerFriendlyDefeatRedirect(state, operations, remaining, continuation, skippedReplacementIds)
  ) {
    return;
  }

  for (const cardId of remaining) {
    const card = state.G.cardIndex[cardId as string];
    if (!card) continue;
    if (continuation.kind === "fight" && card.zone !== "field") continue;
    defeatHostAndAttachedGear(
      state,
      operations,
      cardId,
      defeatSourceFor(cardId, continuation, attack),
      card.controllerId,
      eventMode,
    );
  }

  if (continuation.kind === "fight" && attack) {
    operations.game.setAttackState(null);
  }
}

function defeatSourceFor(
  cardId: CardInstanceId,
  continuation: DefeatReplacementContinuation,
  attack?: AttackState,
): CardInstanceId | null {
  if (continuation.kind === "effect") return continuation.defeatedBy;
  if (continuation.kind === "endOfTurn" || !attack) return null;
  return cardId === attack.attackerId ? (attack.defenderId ?? null) : attack.attackerId;
}

/** Route card-effect defeats through the same CR 10.24–10.29 sequence as combat. */
export function resolveEffectDefeats(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  cardIds: readonly CardInstanceId[],
  defeatedBy: CardInstanceId,
): void {
  continuePendingDefeats(state, operations, cardIds, {
    kind: "effect",
    remainingCardIds: [],
    defeatedBy,
  });
}

/** Route delayed rule-processing defeats through the shared replacement sequence. */
export function resolveEndOfTurnDefeats(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  cardIds: readonly CardInstanceId[],
): void {
  continuePendingDefeats(state, operations, cardIds, {
    kind: "endOfTurn",
    remainingCardIds: [],
  });
}

function executeDefeat(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  attack: Extract<AttackState, { step: "fightResult" }>,
) {
  const resolution = attack.fightResolution;
  const { result, protectedCardIds } = resolution;
  const defenderId = attack.defenderId;
  // CR 9.19 applies the result fixed at power comparison. A fight trigger can
  // remove the opposing Unit first; use its last valid fight power in that
  // case so its already determined result can still defeat a surviving loser.
  const attackerPower =
    state.G.cardIndex[attack.attackerId as string]?.zone === "field"
      ? getEffectivePower(state, attack.attackerId as string)
      : resolution.attackerPower;
  const defenderPower =
    defenderId && state.G.cardIndex[defenderId as string]?.zone === "field"
      ? getEffectivePower(state, defenderId as string)
      : resolution.defenderPower;
  // CR 9.19.2 — a Unit with 0 power cannot defeat a Unit as the result of a fight.
  const attackerCanDefeat = attackerPower > 0;
  const defenderCanDefeat = defenderPower > 0;

  const pendingDefeats: CardInstanceId[] = [];

  if (
    (result === "attackerWins" || result === "mutual") &&
    defenderId &&
    state.G.cardIndex[defenderId as string]?.zone === "field" &&
    attackerCanDefeat &&
    !protectedCardIds.includes(defenderId) &&
    !getEffectiveRules(state, defenderId as string).includes("cantBeDefeatedInFight")
  ) {
    pendingDefeats.push(defenderId);
  }

  if (
    (result === "defenderWins" || result === "mutual") &&
    state.G.cardIndex[attack.attackerId as string]?.zone === "field" &&
    defenderCanDefeat &&
    !protectedCardIds.includes(attack.attackerId) &&
    !getEffectiveRules(state, attack.attackerId as string).includes("cantBeDefeatedInFight")
  ) {
    pendingDefeats.push(attack.attackerId);
  }

  continuePendingDefeats(
    state,
    operations,
    pendingDefeats,
    {
      kind: "fight",
      remainingCardIds: [],
      fightPlayerId: state.G.turnMetadata.activePlayerId,
    },
    attack,
  );
}

export interface ResolveRedirectDefeatInput {
  args: {
    pass?: boolean;
    paymentSourceIds?: string[];
  };
}

export const resolveRedirectDefeatMove: MoveDefinition<ResolveRedirectDefeatInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "redirectDefeat") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "redirectDefeat") {
      return {
        valid: false,
        error: "No redirectDefeat pending",
        errorCode: "NO_PENDING_CHOICE",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (choice.payload.continuation.kind === "fight" && !state.G.attackState) {
      return { valid: false, error: "No attack in progress", errorCode: "NO_ATTACK" };
    }
    if (
      !input.args.pass &&
      input.args.paymentSourceIds !== undefined &&
      !canSpendSelectedEddies(
        state.G,
        playerId,
        choice.payload.cost,
        input.args.paymentSourceIds as CardInstanceId[],
      )
    ) {
      return { valid: false, error: "Invalid payment sources", errorCode: "INVALID_PAYMENT" };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "redirectDefeat") return;
    const attack = state.G.attackState ?? undefined;

    operations.game.setPendingChoice(undefined);
    const { protectedCardId, replacementCardId, continuation, skippedReplacementIds } =
      choice.payload;

    if (!input.args.pass) {
      const replacementCard = state.G.cardIndex[replacementCardId as string];
      const protectedCard = state.G.cardIndex[protectedCardId as string];
      operations.event.emit({
        type: "actionLog",
        messageKey: "move.resolveRedirectDefeat",
        params: {
          replacementCardName: replacementCard
            ? getDefinitionFor(state.G, replacementCardId as string).displayName
            : "The replacement card",
          protectedCardName: protectedCard
            ? getDefinitionFor(state.G, protectedCardId as string).displayName
            : "the friendly Unit",
          cost: choice.payload.cost,
        },
        playerId,
        category: "replacement",
        cardIds: [replacementCardId as string, protectedCardId as string],
      });
      operations.game.spendEddies(
        playerId,
        choice.payload.cost,
        "redirectDefeat",
        input.args.paymentSourceIds === undefined
          ? undefined
          : { sourceIds: input.args.paymentSourceIds as CardInstanceId[] },
      );
      defeatHostAndAttachedGear(
        state,
        operations,
        replacementCardId,
        defeatSourceFor(protectedCardId, continuation, attack),
        replacementCard?.controllerId ?? playerId,
        "immediate",
      );
    } else {
      const skipped = new Set<string>([
        ...(skippedReplacementIds ?? []).map((id) => id as string),
        replacementCardId as string,
      ]);
      continuePendingDefeats(
        state,
        operations,
        [protectedCardId, ...continuation.remainingCardIds],
        { ...continuation, remainingCardIds: [] },
        attack,
        skipped,
        true,
      );
      finishNonFightReplacement(continuation, state, operations);
      return;
    }
    continuePendingDefeats(
      state,
      operations,
      continuation.remainingCardIds,
      { ...continuation, remainingCardIds: [] },
      attack,
      new Set(),
      true,
    );
    finishNonFightReplacement(continuation, state, operations);
  },
};

function finishNonFightReplacement(
  continuation: DefeatReplacementContinuation,
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
): void {
  if (continuation.kind === "fight" || state.G.turnMetadata.pendingChoice) return;
  if (continuation.kind === "effect") resumeCurrentTrigger(state, operations);
  else resumeSuspendedEndTurn(state, operations);
}

export interface ResolveSacrificialGearInput {
  args: {
    cardId: string;
  };
}

export const resolveSacrificialGearMove: MoveDefinition<ResolveSacrificialGearInput> = {
  handlesPendingChoice: true,

  available({ state, playerId }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseSacrificialGear") return false;
    return (choice.chooserId as string) === (playerId as string);
  },

  validate({ state, playerId, input }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseSacrificialGear") {
      return {
        valid: false,
        error: "No chooseSacrificialGear pending",
        errorCode: "NO_PENDING_CHOICE",
      };
    }
    if ((choice.chooserId as string) !== (playerId as string)) {
      return { valid: false, error: "Not your choice to resolve", errorCode: "NOT_YOUR_CHOICE" };
    }
    if (choice.payload.continuation.kind === "fight" && !state.G.attackState) {
      return { valid: false, error: "No attack in progress", errorCode: "NO_ATTACK" };
    }
    const cardId = input.args.cardId;
    if (!choice.payload.gearIds.some((id) => (id as string) === cardId)) {
      return {
        valid: false,
        error: "That Gear is not a legal replacement",
        errorCode: "INVALID_TARGET",
      };
    }
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const choice = state.G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseSacrificialGear") return;
    const attack = state.G.attackState ?? undefined;

    operations.game.setPendingChoice(undefined);
    const { hostId, continuation, defeatedBy } = choice.payload;
    const gearId = input.args.cardId as CardInstanceId;
    const host = state.G.cardIndex[hostId as string];
    sacrificeGearInsteadOfHost(
      state,
      operations,
      hostId,
      gearId,
      defeatedBy,
      host?.controllerId ?? playerId,
      "immediate",
    );
    continuePendingDefeats(
      state,
      operations,
      continuation.remainingCardIds,
      continuation,
      attack,
      new Set(),
      true,
    );
    finishNonFightReplacement(continuation, state, operations);
  },
};

function enqueueFightActiveEffects(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  attack: Extract<AttackState, { step: "fightResult" }>,
  event: Extract<import("../types/game-events.ts").GameEvent, { type: "attackResolved" }>,
): void {
  const defenderId = attack.defenderId;
  if (!defenderId) throw new Error("Fight result requires a defender");
  const attacker = state.G.cardIndex[attack.attackerId as string];
  const defender = state.G.cardIndex[defenderId as string];
  if (!attacker || !defender) throw new Error("Fight participants must exist at result admission");
  const result = attack.fightResolution.result;
  const winnerId =
    result === "attackerWins" ? attack.attackerId : result === "defenderWins" ? defenderId : null;
  const loserIds =
    result === "mutual"
      ? [attack.attackerId, defenderId]
      : [result === "attackerWins" ? defenderId : attack.attackerId];
  const powerMargin = Math.abs(
    attack.fightResolution.attackerPower - attack.fightResolution.defenderPower,
  );
  const matching = state.G.activeEffects.filter((effect) => {
    if (!effect.playerId) return false;
    switch (effect.kind) {
      case "defeatRivalOnNextFriendlyFightLoss":
        return loserIds.some(
          (id) => state.G.cardIndex[id as string]?.controllerId === effect.playerId,
        );
      case "preventNextRivalFightDefeat":
        return (
          effect.playerId === attacker.controllerId || effect.playerId === defender.controllerId
        );
      case "nextFightWinGigSteal":
        return (
          winnerId !== null &&
          state.G.cardIndex[winnerId as string]?.controllerId === effect.playerId &&
          powerMargin >= (effect.minPowerMargin ?? 3)
        );
      default:
        return false;
    }
  });

  for (const effect of matching) {
    if (!effect.playerId) throw new Error("Pending fight effect requires a controller");
    operations.game.removeActiveEffect(effect.id);
    let resolution: Extract<
      import("../types/match-state.ts").QueuedTrigger,
      { kind: "delayed" }
    >["resolution"];
    let boundTargets: Record<string, string[]> = {};
    let abilityText: string;
    if (effect.kind === "defeatRivalOnNextFriendlyFightLoss") {
      const opposingId = effect.playerId === attacker.controllerId ? defenderId : attack.attackerId;
      boundTargets = { opposingUnit: [opposingId as string] };
      const effects: Effect[] = [
        { effect: "defeat", target: { selector: "bound", id: "opposingUnit" } },
      ];
      resolution = { kind: "effects", effects };
      abilityText =
        "The next time a friendly Unit loses a fight this turn, defeat the opposing rival Unit.";
    } else if (effect.kind === "preventNextRivalFightDefeat") {
      const protectedCardId =
        effect.playerId === attacker.controllerId ? attack.attackerId : defenderId;
      resolution = { kind: "fightProtection", protectedCardId };
      abilityText =
        "The next time a rival Unit fights this turn, it doesn't defeat the opposing friendly Unit.";
    } else if (effect.kind === "nextFightWinGigSteal") {
      if (!winnerId) throw new Error("Fight-win effect requires a winner");
      boundTargets = { winningUnit: [winnerId as string] };
      const effects: Effect[] = [
        {
          effect: "stealGig",
          target: {
            selector: "gig",
            controller: "rival",
            amount: 1,
            selection: { mode: "choose", min: 1, max: 1 },
          },
          source: { selector: "bound", id: "winningUnit" },
        },
      ];
      resolution = { kind: "effects", effects };
      abilityText =
        "The next time a friendly Unit wins a fight by 3+ power this turn, it also steals a Gig.";
    } else {
      throw new Error(`Unsupported pending fight effect: ${effect.kind}`);
    }
    const order = state.G.turnMetadata.nextTriggerId++;
    state.G.turnMetadata.triggerQueue.push({
      kind: "delayed",
      id: `trigger-${order}`,
      sourceCardId: effect.sourceCardId,
      sourcePlayerId: effect.playerId,
      activeEffectId: effect.id,
      sourceAbilityIndex: effect.abilityIndex,
      abilityText,
      event,
      contextTargets: {},
      boundTargets,
      resolution,
      order,
    });
  }
}

function fightAutoWinner(
  state: import("../types/match-state.ts").MatchState,
  attack: AttackState,
): "attacker" | "defender" | null {
  if (!attack.defenderId) return null;
  const attackerDef = getDefinitionFor(state.G, attack.attackerId as string);
  const defenderDef = getDefinitionFor(state.G, attack.defenderId as string);
  const attackerClasses = new Set<string>(attackerDef?.classifications ?? []);
  const defenderClasses = new Set<string>(defenderDef?.classifications ?? []);

  for (const effect of state.G.activeEffects) {
    if (effect.kind !== "winsFightsAgainst") continue;
    const targets = effect.winsFightsAgainst?.classifications ?? [];
    if (targets.length === 0) continue;
    const targetsDefender = targets.some((label) => defenderClasses.has(label));
    const targetsAttacker = targets.some((label) => attackerClasses.has(label));
    if ((effect.targetCardId as string) === (attack.attackerId as string) && targetsDefender) {
      return "attacker";
    }
    if ((effect.targetCardId as string) === (attack.defenderId as string) && targetsAttacker) {
      return "defender";
    }
  }
  return null;
}

function executeSteal(
  state: import("../types/match-state.ts").MatchState,
  playerId: import("../types/branded.ts").PlayerId,
  input: ResolveAttackInput,
  operations: import("../operations/index.ts").Operations,
  attack: AttackState,
) {
  const attackerName = state.G.cardIndex[attack.attackerId as string]
    ? getDefinitionFor(state.G, attack.attackerId as string).displayName
    : "";
  const attackerPower = getEffectivePower(state, attack.attackerId as string);

  const opponent = state.G.players[attack.rivalId as string];
  if (!opponent || opponent.gigArea.length === 0) {
    operations.event.emit({
      type: "attackResolved",
      attackerId: attack.attackerId,
      defenderId: null,
      rivalId: attack.rivalId,
      attackKind: "direct",
      result: "gigsStolen",
      gigsStolen: 0,
      playerId,
    });

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.resolveAttack.direct",
      params: {
        attackerName,
        attackerPower,
        count: 0,
        stolenGigs: formatStolenGigSummary([]),
      },
      playerId,
    });
    operations.game.setAttackState(null);
    return;
  }

  // CR 9.23.3.1: choose from every Gig in the defending area regardless of value.
  // Power-cap restrictions apply afterward (CR 9.23.4), immediately before the steal.
  const eligibleDieIds = opponent.gigArea;
  const gigsToSteal = Math.min(
    getProjectedDirectAttackGigStealCount(state, attack) ?? 0,
    eligibleDieIds.length,
  );

  if (
    input.args.gigIdsToSteal === undefined &&
    gigsToSteal > 0 &&
    eligibleDieIds.length > gigsToSteal
  ) {
    operations.game.setPendingChoice({
      type: "chooseGigsToSteal",
      chooserId: playerId,
      effectId: attack.attackerId as string,
      payload: {
        count: gigsToSteal,
        attackerId: attack.attackerId,
        rivalId: attack.rivalId,
        eligibleDieIds,
      },
    });
    return;
  }

  const gigIds = input.args.gigIdsToSteal ?? eligibleDieIds.slice(0, gigsToSteal);
  const selectedGigIds = gigIds
    .slice(0, gigsToSteal)
    .map((id) => id as import("../types/branded.ts").GigDieId);
  const resolvedGigIds = filterGigsByAttackerPowerCap(
    state,
    attack.attackerId,
    attack.rivalId,
    selectedGigIds,
  );
  const prevention = buildGigStealPrevention(
    state,
    attack,
    resolvedGigIds,
    attackerName,
    attackerPower,
  );
  if (prevention) {
    operations.game.setPendingChoice(prevention);
    return;
  }
  performGigSteal({
    state,
    operations,
    attack,
    gigIds: resolvedGigIds,
    playerId,
    attackerName,
    attackerPower,
  });
  operations.game.setAttackState(null);
}

export function performGigSteal(opts: {
  state: import("../types/match-state.ts").MatchState;
  operations: import("../operations/index.ts").Operations;
  attack: NonNullable<import("../types/match-state.ts").MatchState["G"]["attackState"]>;
  gigIds: readonly import("../types/branded.ts").GigDieId[];
  playerId: import("../types/branded.ts").PlayerId;
  attackerName: string;
  attackerPower: number;
}): StolenGigLogEntry[] {
  const { state, operations, attack, gigIds, playerId, attackerName, attackerPower } = opts;
  const stolenGigs = gigIds.flatMap((gigId) => {
    const die = state.G.gigDice[gigId as string];
    return die ? [{ dieType: die.dieType, faceValue: die.faceValue }] : [];
  });
  if (gigIds.length > 0) {
    markDefeatAtEndOfTurnIfAttacked(state, attack.attackerId);
  }
  for (const gigId of gigIds) {
    operations.gig.moveGig(gigId, playerId, attack.attackerId);
  }
  if (gigIds[0]) {
    processEventTriggers(
      {
        type: "gigStolen" as const,
        dieId: gigIds[0],
        dieIds: [...gigIds],
        fromPlayerId: attack.rivalId,
        toPlayerId: playerId,
        sourceCardId: attack.attackerId,
      },
      state,
      operations,
    );
  }
  const stolenCount = gigIds.length;
  operations.event.emit({
    type: "attackResolved",
    attackerId: attack.attackerId,
    defenderId: null,
    rivalId: attack.rivalId,
    attackKind: "direct",
    result: "gigsStolen",
    gigsStolen: stolenCount,
    playerId,
  });
  operations.event.emit({
    type: "actionLog",
    messageKey: "move.resolveAttack.direct",
    params: {
      attackerName,
      attackerPower,
      count: stolenCount,
      stolenGigs: formatStolenGigSummary(stolenGigs),
    },
    playerId,
  });
  return stolenGigs;
}

/**
 * Builds a `preventGigSteal` pending choice for the defender when they control
 * a card with the `preventsGigStealByDiscard` rule (e.g. Alt Cunningham —
 * Mother of Daemons) and at least one of the stolen Gigs can be matched by a
 * discardable hand card whose cost equals its face value. Returns `null` when
 * no prevention source is present or no Gig can be prevented, so the steal
 * proceeds uninterrupted.
 */
export function buildGigStealPrevention(
  state: MatchState,
  attack: AttackState,
  gigIds: readonly GigDieId[],
  attackerName: string,
  attackerPower: number,
): PreventGigStealPendingChoice | null {
  if (gigIds.length === 0) return null;
  const defenderId = attack.rivalId;
  const defender = state.G.players[defenderId as string];
  if (!defender) return null;

  let sourceCardId: CardInstanceId | undefined;
  for (const zone of ["field", "legendArea"] as const) {
    for (const cardId of defender.zones[zone] ?? []) {
      if (getEffectiveRules(state, cardId as string).includes("preventsGigStealByDiscard")) {
        sourceCardId = cardId as CardInstanceId;
        break;
      }
    }
    if (sourceCardId) break;
  }
  if (!sourceCardId) return null;

  const stealEntries = gigIds
    .map((dieId) => {
      const die = state.G.gigDice[dieId as string];
      return die ? { dieId, value: die.faceValue } : null;
    })
    .filter((entry): entry is { dieId: GigDieId; value: number } => entry !== null);

  const handEntries: Array<{ cardId: CardInstanceId; cost: number }> = [];
  for (const cardId of defender.zones.hand ?? []) {
    const def = getDefinitionFor(state.G, cardId as string);
    if (def && typeof def.cost === "number") {
      handEntries.push({ cardId: cardId as CardInstanceId, cost: def.cost });
    }
  }

  const stealValues = new Set(stealEntries.map((entry) => entry.value));
  const canPreventAny = handEntries.some((entry) => stealValues.has(entry.cost));
  if (!canPreventAny) return null;

  return {
    type: "preventGigSteal",
    chooserId: defenderId,
    effectId: sourceCardId as string,
    payload: {
      attackerId: attack.attackerId,
      rivalId: defenderId,
      attackerName,
      attackerPower,
      stealEntries,
      handEntries,
    },
  };
}

/**
 * Builds the same prevention choice for a Unit-attributed card effect. Card
 * effects resume through the trigger executor, so their resolution metadata
 * is retained on the pending choice instead of manufacturing an attack state.
 */
export function buildEffectGigStealPrevention(input: {
  state: MatchState;
  thiefId: CardInstanceId;
  defenderId: PlayerId;
  gigIds: readonly GigDieId[];
  sourcePlayerId: PlayerId;
  sourceCardId: CardInstanceId;
}): PreventGigStealPendingChoice | null {
  const thief = input.state.G.cardIndex[input.thiefId as string];
  const thiefDef = getDefinitionFor(input.state.G, input.thiefId as string);
  if (!thief || thiefDef.type !== "unit") return null;

  const choice = buildGigStealPrevention(
    input.state,
    {
      attackerId: input.thiefId,
      rivalId: input.defenderId,
    } as AttackState,
    input.gigIds,
    thiefDef.displayName,
    getEffectivePower(input.state, input.thiefId as string),
  );
  if (!choice) return null;

  choice.payload.effectSteal = {
    sourcePlayerId: input.sourcePlayerId,
    sourceCardId: input.sourceCardId,
    sourceCardName: getDefinitionFor(input.state.G, input.sourceCardId as string).displayName,
  };
  return choice;
}

export function getProjectedDirectAttackGigStealCount(
  state: MatchState,
  attack: AttackState | null = state.G.attackState,
): number | null {
  if (!attack || attack.kind !== "direct" || attack.redirectedByBlocker) {
    return null;
  }

  const opponent = state.G.players[attack.rivalId as string];
  if (!opponent || opponent.gigArea.length === 0) {
    return 0;
  }

  const power = getEffectivePower(state, attack.attackerId as string);
  // Base rule (gameplay guide): "Steal 1 Gig on a successful direct attack,
  // plus 1 additional Gig for every full 10 power on the attacking Unit."
  // A Unit with power 0 doesn't steal any Gigs — power must be strictly
  // positive for the base steal to apply.
  if (power <= 0) return 0;
  const base = 1 + Math.floor(power / 10);
  const rules = getEffectiveRules(state, attack.attackerId as string);
  const reduction = rules.includes("stealsOneFewerGig") ? 1 : 0;
  return Math.min(Math.max(0, base - reduction), opponent.gigArea.length);
}
