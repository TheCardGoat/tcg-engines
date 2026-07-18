import type { MoveDefinition, MoveInput } from "../types/commands.ts";
import type { ActiveEffect, AttackState, FightResult, MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";
import {
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

  let result: FightResult;
  if (attackerPower > defenderPower) {
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
    protectedCardId !== (defenderId as string)
  ) {
    const hadAttachedCards =
      (state.G.cardIndex[defenderId as string]?.meta.attachedGearIds.length ?? 0) > 0;
    operations.card.moveAttachedGear(defenderId, "trash", { detachAfterMove: true });
    operations.zone.moveCard(defenderId, "trash", attack.rivalId);
    const event = {
      type: "cardDefeated" as const,
      cardId: defenderId,
      defeatedBy: attack.attackerId,
      playerId: attack.rivalId,
      hadAttachedCards,
    };
    operations.event.emit(event);
    processEventTriggers(event, state, operations);
    removeFromGameIfGoSolo(state, defenderId);
  }

  if (
    (result === "defenderWins" || result === "mutual") &&
    protectedCardId !== (attack.attackerId as string)
  ) {
    const hadAttachedCards =
      (state.G.cardIndex[attack.attackerId as string]?.meta.attachedGearIds.length ?? 0) > 0;
    operations.card.moveAttachedGear(attack.attackerId, "trash", { detachAfterMove: true });
    operations.zone.moveCard(attack.attackerId, "trash", playerId);
    const event = {
      type: "cardDefeated" as const,
      cardId: attack.attackerId,
      defeatedBy: defenderId,
      playerId,
      hadAttachedCards,
    };
    operations.event.emit(event);
    processEventTriggers(event, state, operations);
    removeFromGameIfGoSolo(state, attack.attackerId);
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

  const gigsToSteal = getProjectedDirectAttackGigStealCount(state, attack) ?? 0;

  if (
    input.args.gigIdsToSteal === undefined &&
    gigsToSteal > 0 &&
    opponent.gigArea.length > gigsToSteal
  ) {
    operations.game.setPendingChoice({
      type: "chooseGigsToSteal",
      chooserId: playerId,
      effectId: attack.attackerId as string,
      payload: {
        count: gigsToSteal,
        attackerId: attack.attackerId,
        rivalId: attack.rivalId,
        eligibleDieIds: [...opponent.gigArea],
      },
    });
    return;
  }

  const gigIds = input.args.gigIdsToSteal ?? opponent.gigArea.slice(0, gigsToSteal);
  performGigSteal({
    state,
    operations,
    attack,
    gigIds: gigIds.slice(0, gigsToSteal).map((id) => id as import("../types/branded.ts").GigDieId),
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
