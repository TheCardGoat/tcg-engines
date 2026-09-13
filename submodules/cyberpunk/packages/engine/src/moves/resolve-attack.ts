import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type {
  ActiveEffect,
  AttackState,
  FightResult,
  MatchState,
  PreventGigStealPendingChoice,
} from "../types/match-state.ts";
import type { CardInstanceId, GigDieId, PlayerId } from "../types/branded.ts";
import {
  filterGigsByAttackerPowerCap,
  findSacrificialAttachedGear,
  getEffectivePower,
  getEffectiveRules,
  markDefeatAtEndOfTurnIfAttacked,
} from "../active-effects/index.ts";
import { processEventTriggers } from "../ability-executor.ts";
import { getDefinitionFor, tryDefOf } from "../state/lookups.ts";
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
      (attack.step === "fight" || attack.step === "steal") &&
      state.G.turnMetadata.activePlayerId === playerId
    )
      return true;
    return false;
  },

  validate({ state, playerId: _playerId }) {
    const attack = state.G.attackState;
    if (!attack) return { valid: false, error: "No attack in progress", errorCode: "NO_ATTACK" };
    return { valid: true };
  },

  execute({ state, playerId, input, operations }) {
    const attack = state.G.attackState;
    if (!attack) return;

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

  const attackerName = state.G.cardIndex[attack.attackerId as string]
    ? getDefinitionFor(state.G, attack.attackerId as string).displayName
    : "";
  const defenderName = state.G.cardIndex[attack.defenderId as string]
    ? getDefinitionFor(state.G, attack.defenderId as string).displayName
    : "";
  const prevention = consumeNextRivalFightProtection(state, operations, attack);
  const messageKey = fightMessageKey(result, prevention !== undefined);

  operations.event.emit({
    type: "actionLog",
    messageKey,
    params: {
      attackerName,
      defenderName,
      attackerPower,
      defenderPower,
      ...(prevention ? { sourceCardName: prevention.sourceCardName } : {}),
    },
    playerId,
  });

  executeDefeat(
    state,
    playerId,
    operations,
    { ...attack, fightResult: result },
    prevention?.cardId,
  );
}

function fightMessageKey(
  result: FightResult,
  defeatWasPrevented: boolean,
): import("../types/game-events.ts").ActionLogMessageKey {
  if (defeatWasPrevented && result === "attackerWins") {
    return "move.resolveAttack.fight.attackerWins.prevented";
  }
  if (defeatWasPrevented && result === "mutual") {
    return "move.resolveAttack.fight.mutual.prevented";
  }
  return `move.resolveAttack.fight.${result}` as import("../types/game-events.ts").ActionLogMessageKey;
}

function removeFromGameIfGoSolo(
  state: import("../types/match-state.ts").MatchState,
  cardId: import("../types/branded.ts").CardInstanceId,
): void {
  const card = state.G.cardIndex[cardId as string];
  if (!card) return;
  const def = tryDefOf(card);
  if (!def?.keywords?.includes("goSolo")) return;

  const player = state.G.players[card.controllerId as string];
  if (player) {
    const idx = player.zones[card.zone].indexOf(cardId);
    if (idx !== -1) player.zones[card.zone].splice(idx, 1);
  }
  delete state.G.cardIndex[cardId as string];
}

/**
 * Defeat a host card and fire {Defeated} on both the host and any attached Gear
 * that left the field with it (e.g. The Relic — Experimental Biochip).
 */
function defeatHostAndAttachedGear(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  hostId: import("../types/branded.ts").CardInstanceId,
  defeatedBy: import("../types/branded.ts").CardInstanceId | null,
  playerId: PlayerId,
): void {
  const sacrificialGearId = findSacrificialAttachedGear(state, hostId as string);
  if (sacrificialGearId) {
    operations.card.detachGear(sacrificialGearId);
    operations.zone.moveCard(sacrificialGearId, "trash", playerId);
    const gear = state.G.cardIndex[sacrificialGearId as string];
    const gearEvent = {
      type: "cardDefeated" as const,
      cardId: sacrificialGearId,
      defeatedBy,
      playerId: gear?.controllerId ?? playerId,
      hadAttachedCards: false,
      hostId,
    };
    operations.event.emit(gearEvent);
    processEventTriggers(gearEvent, state, operations);
    return;
  }
  const host = state.G.cardIndex[hostId as string];
  const attachedGearIds = [...(host?.meta.attachedGearIds ?? [])];
  const hadAttachedCards = attachedGearIds.length > 0;
  operations.card.moveAttachedGear(hostId, "trash", { detachAfterMove: true });
  operations.zone.moveCard(hostId, "trash", playerId);
  const hostEvent = {
    type: "cardDefeated" as const,
    cardId: hostId,
    defeatedBy,
    playerId,
    hadAttachedCards,
  };
  operations.event.emit(hostEvent);
  processEventTriggers(hostEvent, state, operations);
  removeFromGameIfGoSolo(state, hostId);

  for (const gearId of attachedGearIds) {
    const gear = state.G.cardIndex[gearId as string];
    if (!gear) continue;
    const gearEvent = {
      type: "cardDefeated" as const,
      cardId: gearId as import("../types/branded.ts").CardInstanceId,
      defeatedBy,
      playerId: gear.controllerId,
      hadAttachedCards: false,
      hostId,
    };
    operations.event.emit(gearEvent);
    processEventTriggers(gearEvent, state, operations);
  }
}

function executeDefeat(
  state: MatchState,
  playerId: PlayerId,
  operations: import("../operations/index.ts").Operations,
  attack: AttackState,
  protectedCardId: string | undefined,
) {
  const result = attack.fightResult ?? "mutual";
  const defenderId = attack.defenderId;
  const attackerPower = getEffectivePower(state, attack.attackerId as string);
  const defenderPower = defenderId ? getEffectivePower(state, defenderId as string) : 0;
  if (
    (result === "attackerWins" || result === "mutual") &&
    defenderId &&
    protectedCardId !== (defenderId as string) &&
    !getEffectiveRules(state, defenderId as string).includes("cantBeDefeatedInFight")
  ) {
    defeatHostAndAttachedGear(state, operations, defenderId, attack.attackerId, attack.rivalId);
  }

  if (
    (result === "defenderWins" || result === "mutual") &&
    protectedCardId !== (attack.attackerId as string) &&
    !getEffectiveRules(state, attack.attackerId as string).includes("cantBeDefeatedInFight")
  ) {
    defeatHostAndAttachedGear(state, operations, attack.attackerId, defenderId, playerId);
  }

  const fightResolvedEvent = {
    type: "attackResolved" as const,
    attackerId: attack.attackerId,
    defenderId: attack.defenderId,
    attackKind: "fight" as const,
    result: result as "attackerWins" | "defenderWins" | "mutual",
    playerId,
  };
  operations.event.emit(fightResolvedEvent);
  scheduleGigStealsForDecisiveFightWin(
    state,
    operations,
    attack,
    result,
    attackerPower - defenderPower,
  );
  processEventTriggers(fightResolvedEvent, state, operations);

  consumeNextFriendlyFightLossDefeat(state, operations, attack, result);

  operations.game.setAttackState(null);
}

function scheduleGigStealsForDecisiveFightWin(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  attack: AttackState,
  result: FightResult,
  powerMargin: number,
): void {
  if (result !== "attackerWins") return;

  const attacker = state.G.cardIndex[attack.attackerId as string];
  const effects = state.G.activeEffects.filter(
    (candidate) =>
      candidate.kind === "nextFightWinGigSteal" &&
      candidate.playerId === attacker?.controllerId &&
      powerMargin >= (candidate.minPowerMargin ?? 3),
  );
  for (const effect of effects) {
    if (!effect.playerId) continue;
    operations.game.removeActiveEffect(effect.id);
    operations.game.addBagEntry({
      id: `fight-steal-${effect.id}`,
      // Keep the Program as the displayed effect source while binding the
      // winning Unit separately as the thief for gigStolen event filters.
      sourceCardId: effect.sourceCardId,
      sourcePlayerId: effect.playerId,
      effectIndex: 0,
      abilityText:
        "The next time a friendly Unit wins a fight by 3+ power this turn, it also steals a Gig.",
      suspended: false,
      delayedTiming: "afterTriggerResolution",
      delayedEffects: [
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
      ],
      resolvedBindings: { winningUnit: [attack.attackerId as string] },
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

function consumeNextFriendlyFightLossDefeat(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  attack: AttackState,
  result: FightResult,
): void {
  if (result !== "attackerWins" && result !== "defenderWins") return;
  const winnerId = result === "attackerWins" ? attack.attackerId : attack.defenderId;
  const loserId = result === "attackerWins" ? attack.defenderId : attack.attackerId;
  if (!winnerId || !loserId) return;
  const loser = state.G.cardIndex[loserId as string];
  const winner = state.G.cardIndex[winnerId as string];
  if (!loser || !winner) return;
  const effect = state.G.activeEffects.find(
    (e) =>
      e.kind === "defeatRivalOnNextFriendlyFightLoss" &&
      (e.playerId as string) === (loser.controllerId as string),
  );
  if (!effect) return;
  operations.game.removeActiveEffect(effect.id);
  defeatHostAndAttachedGear(state, operations, winnerId, effect.sourceCardId, winner.controllerId);
}

function consumeNextRivalFightProtection(
  state: MatchState,
  operations: import("../operations/index.ts").Operations,
  attack: AttackState,
): { cardId: string; sourceCardName: string } | undefined {
  const defenderId = attack.defenderId;
  if (!defenderId) return undefined;

  const attacker = state.G.cardIndex[attack.attackerId as string];
  const defender = state.G.cardIndex[defenderId as string];
  if (!attacker || !defender) return undefined;

  const protection = state.G.activeEffects.find(
    (effect): effect is ActiveEffect & { playerId: PlayerId } =>
      effect.kind === "preventNextRivalFightDefeat" && effect.playerId !== undefined,
  );
  if (!protection) return undefined;

  const sourcePlayerId = protection.playerId as string;
  const attackerIsFriendly = (attacker.controllerId as string) === sourcePlayerId;
  const defenderIsFriendly = (defender.controllerId as string) === sourcePlayerId;

  if (attackerIsFriendly || !defenderIsFriendly) return undefined;

  operations.game.removeActiveEffect(protection.id);
  const sourceCard = state.G.cardIndex[protection.sourceCardId as string];
  const sourceDefinition = sourceCard
    ? getDefinitionFor(state.G, protection.sourceCardId as string)
    : null;
  return {
    cardId: defenderId as string,
    sourceCardName: sourceDefinition?.displayName ?? sourceDefinition?.name ?? "the active effect",
  };
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
      attackKind: "direct",
      result: "gigsStolen",
      gigsStolen: 0,
      playerId,
    });

    operations.event.emit({
      type: "actionLog",
      messageKey: "move.resolveAttack.direct",
      params: { attackerName, attackerPower, count: 0 },
      playerId,
    });
    operations.game.setAttackState(null);
    return;
  }

  const eligibleDieIds = filterGigsByAttackerPowerCap(
    state,
    attack.attackerId,
    attack.rivalId,
    opponent.gigArea,
  );
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
  const resolvedGigIds = gigIds
    .slice(0, gigsToSteal)
    .map((id) => id as import("../types/branded.ts").GigDieId);
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
}): void {
  const { state, operations, attack, gigIds, playerId, attackerName, attackerPower } = opts;
  if (gigIds.length > 0) {
    markDefeatAtEndOfTurnIfAttacked(state, attack.attackerId);
  }
  for (const gigId of gigIds) {
    operations.gig.moveGig(gigId, playerId, attack.attackerId);
  }
  for (const gigId of gigIds) {
    processEventTriggers(
      {
        type: "gigStolen" as const,
        dieId: gigId,
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
    attackKind: "direct",
    result: "gigsStolen",
    gigsStolen: stolenCount,
    playerId,
  });
  operations.event.emit({
    type: "actionLog",
    messageKey: "move.resolveAttack.direct",
    params: { attackerName, attackerPower, count: stolenCount },
    playerId,
  });
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
