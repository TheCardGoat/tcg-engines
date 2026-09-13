import type { FabMatchState } from "../../state.ts";
import { emptyFabTurnHistory } from "../../game/turn-history.ts";
import type { ProposedEvent } from "../events.ts";
import type { FabEventReduction } from "../../kernel/transaction-kernel.ts";
import { livingObjectZeroLifeClears, moveKnownObject } from "./shared.ts";
import { openFabPriority } from "../../priority.ts";
import { pruneFabLkiToPendingFacts } from "../../game/lki.ts";
import { historyTokenKindFromCanonicalId } from "../../kernel/history-facts.ts";
import { fabPlayerLogCard } from "../../player-log.ts";
import { dropExpiredPlayerTurnStartEffects } from "./continuous-effects.ts";

export type AssetsTurnEventName =
  | "spend-assets"
  | "gain-assets"
  | "lose-game"
  | "reset-turn-assets"
  | "advance-turn"
  | "pitch"
  | "start-phase"
  | "end-phase"
  | "action-phase-start"
  | "gain-life"
  | "lose-life"
  | "pay-resources";

type AssetsTurnEvent = Extract<ProposedEvent, { name: AssetsTurnEventName }>;

export function reduceAssetsTurnEvent(
  state: FabMatchState,
  event: AssetsTurnEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "spend-assets": {
      const player = state.players[event.data.playerId];
      if (
        !player ||
        event.data.chi < 0 ||
        event.data.resources < 0 ||
        event.data.life < 0 ||
        event.data.actionPoints < 0 ||
        player.chiPoints < event.data.chi ||
        player.resourcePoints < event.data.resources ||
        player.life <= event.data.life ||
        player.actionPoints < event.data.actionPoints
      ) {
        return null;
      }
      player.chiPoints -= event.data.chi;
      player.resourcePoints -= event.data.resources;
      player.life -= event.data.life;
      player.actionPoints -= event.data.actionPoints;
      if (player.life <= 0 && !state.gameEnded) {
        endGameForLoserLocal(state, event.data.playerId, "life");
      }
      return { state };
    }
    case "gain-assets": {
      const player = state.players[event.data.playerId];
      if (
        !player ||
        event.data.resources < 0 ||
        event.data.chi < 0 ||
        event.data.actionPoints < 0 ||
        event.data.amp < 0 ||
        event.data.resources + event.data.chi + event.data.actionPoints + event.data.amp === 0
      )
        return null;
      player.resourcePoints += event.data.resources;
      player.chiPoints += event.data.chi;
      player.actionPoints += event.data.actionPoints;
      return { state };
    }
    case "lose-game": {
      if (!state.players[event.data.playerId] || state.gameEnded) return null;
      endGameForLoserLocal(state, event.data.playerId, event.data.reason);
      return { state };
    }
    case "reset-turn-assets": {
      const players = event.data.playerIds.map((playerId) => state.players[playerId]);
      const allies = event.data.allyInstanceIds.map((instanceId) => state.objects[instanceId]);
      if (players.some((player) => !player) || allies.some((ally) => !ally)) return null;
      let changed = false;
      for (const player of players) {
        if (!player) throw new Error("Validated reset-turn player disappeared.");
        changed ||= player.actionPoints !== 0 || player.resourcePoints !== 0;
        player.actionPoints = 0;
        player.resourcePoints = 0;
      }
      for (const object of allies) {
        if (!object) throw new Error("Validated reset-turn ally disappeared.");
        const instanceId = object.instanceId;
        const counters = object.counters.filter((counter) => counter.kind !== "damage");
        changed ||=
          counters.length !== object.counters.length ||
          (object.lifeGained ?? 0) !== 0 ||
          (object.lifeLost ?? 0) !== 0;
        state.objects[instanceId] = {
          ...object,
          counters,
          lifeGained: undefined,
          lifeLost: undefined,
        };
      }
      return changed ? { state } : null;
    }
    case "advance-turn": {
      if (
        state.activePlayerId !== event.data.previousPlayerId ||
        !state.players[event.data.nextPlayerId] ||
        event.data.nextTurnNumber !== state.turnNumber + 1
      )
        return null;
      // CR 4.4.4: "this turn" / until-end-of-turn durations end only after
      // every end-of-turn procedure step, including CR 4.4.3f draw-to-intellect,
      // has completed. Combat-chain durations cannot remain useful once
      // end-turn is legal, because the combat chain must already be closed.
      // Do not silently drop the instances: CR 8.5.35 / 8.5.54 reclaim and
      // freeze unstamp live in the continuous-effect-ceased reducer.
      const expiringContinuous = state.continuousEffectInstances.filter(
        (continuous) =>
          (continuous.expiresAt.kind === "turn" &&
            continuous.expiresAt.turnNumber <= state.turnNumber) ||
          continuous.expiresAt.kind === "combat-chain",
      );
      state.activationLimitModifiers = state.activationLimitModifiers.filter(
        (modifier) => modifier.turnNumber >= event.data.nextTurnNumber,
      );
      state.activePlayerId = state.players[event.data.nextPlayerId]!.playerId;
      openFabPriority(state, event.data.nextPlayerId, "action", null);
      state.turnNumber = event.data.nextTurnNumber;
      for (const player of Object.values(state.players))
        resetPlayerHistoryForTurn(player, state.turnNumber);
      recordTokenControlAtTurnStart(state);
      // CR 6.6.5d ordinals are relative to the current window. Past-turn
      // global occurrence keys must not accumulate across a match.
      state.triggerLimitUsage = Object.fromEntries(
        Object.entries(state.triggerLimitUsage).filter(([key]) => {
          const turnWindow = /:turn-(\d+)/.exec(key);
          return !turnWindow || Number(turnWindow[1]) >= event.data.nextTurnNumber;
        }),
      );
      state.triggerOccurrenceLedger = state.triggerOccurrenceLedger.filter(
        (record) => record.context.turnNumber >= event.data.nextTurnNumber,
      );
      // Object move LKI is a bounded rules fact for the active turn/chain, not
      // a match-long replay journal. All consumers are turn/chain scoped or
      // inspect the current play's latest move, and end-turn cannot advance
      // while a stack/process is unresolved. The end-turn procedure itself,
      // however, legitimately spans the boundary (pitch ordering, staged
      // resolution groups, start-of-turn triggered layers), so the arena
      // retire keeps entries those pending facts still reference instead of
      // emptying wholesale — otherwise persisted resolution groups would name
      // pre-rollover incarnations no live record or LKI can anchor.
      for (const object of Object.values(state.objects)) {
        if (object.history.moves.length === 0) continue;
        state.objects[object.instanceId] = { ...object, history: { moves: [] } };
      }
      pruneFabLkiToPendingFacts(state);
      // Re-arm per-turn future applicators (`appliesTo.perTurn`). The quota
      // (remaining/observedSubjects/latchedSubjects) refreshes at every turn
      // boundary; consumption is already controller-scoped by the future-
      // applicability filter (see proposeFutureObjectEvents), so a global
      // re-arm here cannot let an opponent's turn consume the quota.
      for (let index = 0; index < state.continuousEffectInstances.length; index += 1) {
        const instance = state.continuousEffectInstances[index]!;
        const future = instance.futureApplicability;
        if (!future || future.resets !== "turn") continue;
        if (
          future.remaining === future.count &&
          future.observedSubjects.length === 0 &&
          future.latchedSubjects.length === 0
        )
          continue;
        state.continuousEffectInstances[index] = {
          ...instance,
          futureApplicability: {
            ...future,
            remaining: future.count,
            observedSubjects: [],
            latchedSubjects: [],
          },
        };
      }
      // CR 8.5.58: the end phase already removed the sharpened counters; the
      // this-turn marker cannot outlive the turn either, or next-turn
      // "sharpened this turn" conditionals (Zenith Blade) stay armed.
      for (const object of Object.values(state.objects)) {
        if (
          !object.markers.some(
            (marker) => marker.kind === "status" && marker.value === "sharpened-this-turn",
          )
        ) {
          continue;
        }
        state.objects[object.instanceId] = {
          ...object,
          markers: object.markers.filter(
            (marker) => !(marker.kind === "status" && marker.value === "sharpened-this-turn"),
          ),
        };
      }
      return {
        state,
        followUpEvents: expiringContinuous.map((instance) => ({
          name: "continuous-effect-ceased" as const,
          processId: event.processId,
          cause: {
            kind: "rule" as const,
            rule: "turn-duration-expiry",
            controllerId: instance.controllerId,
          },
          controllerId: instance.controllerId,
          // Do not reuse instance.source — it may be a revoked Immer snapshot
          // captured when the layer resolved. Cease reclaim reads the live
          // instance from state, not this envelope field.
          source: null,
          affected: [],
          bindings: {},
          data: { effectId: instance.effectId },
        })),
      };
    }
    case "pitch": {
      // Origin: hand (cost pitch / hand effects), deck (pitch top), or
      // graveyard (PEN168 trench / "pitch a card from your graveyard").
      // Snapshot.zone is the LKI origin; fall back to hand for legacy events.
      const origin = event.data.object.zone;
      const fromZone =
        origin === "deck" || origin === "hand" || origin === "graveyard" ? origin : "hand";
      if (
        !moveKnownObject(state, event.data.object, fromZone, "pitch", event.data.destinationRef)
      ) {
        return null;
      }
      state.players[event.data.playerId]!.resourcePoints += event.data.resourcesGenerated;
      state.players[event.data.playerId]!.chiPoints += event.data.chiGenerated ?? 0;
      if ((event.data.object.base.numeric.power ?? Number.NEGATIVE_INFINITY) >= 6) {
        state.players[event.data.playerId]!.history.turn.pitchedPower6 = true;
      }
      if (event.data.object.base.color === "blue") {
        state.players[event.data.playerId]!.history.turn.pitchedBlue = true;
      }
      return {
        state,
        playerLogFacts: [
          {
            kind: "card-pitched",
            playerId: event.data.playerId,
            card: fabPlayerLogCard(event.data.object),
            resources: event.data.resourcesGenerated,
          },
        ],
      };
    }
    case "start-phase":
      if (
        state.phase === "start" &&
        !(event.cause.kind === "rule" && event.cause.rule === "initial-start-phase-begins")
      )
        return null;
      state.phase = "start";
      dropExpiredPlayerTurnStartEffects(state, event.data.turnPlayerId);
      return { state };
    case "action-phase-start":
      if (state.phase === "action") return null;
      state.phase = "action";
      state.players[event.data.turnPlayerId]!.actionPoints += 1;
      return { state };
    case "end-phase":
      if (state.phase === "end") return null;
      state.phase = "end";
      return { state };
    case "gain-life": {
      if (event.data.objectInstanceId) {
        const object = state.objects[event.data.objectInstanceId];
        if (!object || event.data.amount <= 0) return null;
        state.objects[event.data.objectInstanceId] = {
          ...object,
          lifeGained: (object.lifeGained ?? 0) + event.data.amount,
        };
        return { state };
      }
      const player = state.players[event.data.playerId];
      if (!player || event.data.amount <= 0) return null;
      player.life += event.data.amount;
      player.history.turn.lifeGained += event.data.amount;
      return { state };
    }
    case "lose-life": {
      if (event.data.objectInstanceId) {
        const object = state.objects[event.data.objectInstanceId];
        if (!object || event.data.amount <= 0) return null;
        state.objects[event.data.objectInstanceId] = {
          ...object,
          lifeLost: (object.lifeLost ?? 0) + event.data.amount,
        };
        return {
          state,
          followUpEvents: livingObjectZeroLifeClears(state, event),
        };
      }
      const player = state.players[event.data.playerId];
      if (!player || event.data.amount <= 0) return null;
      player.life = Math.max(0, player.life - event.data.amount);
      // Static replacements with limit 1/turn that rewrite gain-life into
      // controller lose-life (Vestige of Flagellation) stamp their
      // replacementId so a second opponent gain this turn is not rewritten.
      if (
        event.cause.kind === "effect" &&
        event.controllerId &&
        typeof event.cause.abilityId === "string"
      ) {
        stampConsumedOncePerTurnReplacement(state, event.controllerId, event.cause.abilityId);
      }
      if (player.life === 0 && !state.gameEnded) {
        endGameForLoserLocal(state, event.data.playerId, "life");
      }
      return { state };
    }
    case "pay-resources": {
      const player = state.players[event.data.playerId];
      if (!player || event.data.amount < 0 || player.resourcePoints < event.data.amount) {
        return null;
      }
      player.resourcePoints -= event.data.amount;
      return { state };
    }
    default:
      return assertNeverAssetsTurn(event);
  }
}

/**
 * A Toughness token remains under its controller's control as a new turn
 * begins, even though its start-of-turn trigger may immediately destroy it.
 * Preserve that rules fact before triggered effects resolve.
 */
function recordTokenControlAtTurnStart(state: FabMatchState): void {
  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    const arena = state.containers.zonesByPlayerId[playerId]?.arena ?? [];
    for (const instanceId of arena) {
      const object = state.objects[instanceId];
      const kind = object ? historyTokenKindFromCanonicalId(object.canonicalId) : null;
      if (kind === "toughness") player.history.turn.controlledToughnessThisTurn = true;
      if (kind === "vigor") player.history.turn.controlledVigorThisTurn = true;
      if (kind === "might") player.history.turn.controlledMightThisTurn = true;
    }
  }
}

// --- Assets/turn domain helpers ---

/**
 * Stamp a static replacement with limit 1/turn so subsequent matching events
 * this turn do not re-apply (Vestige of Flagellation family).
 */
function stampConsumedOncePerTurnReplacement(
  state: FabMatchState,
  controllerId: string,
  replacementId: string,
): void {
  const colon = replacementId.indexOf(":");
  if (colon <= 0) return;
  const instanceId = replacementId.slice(0, colon);
  const abilityId = replacementId.slice(colon + 1);
  // Token create sub-ids use a second colon (…:token-1); ability id is the
  // middle segment for those, but lose-life cause uses bare instance:ability.
  const abilityKey = abilityId.includes(":")
    ? abilityId.slice(0, abilityId.indexOf(":"))
    : abilityId;
  const record = state.objects[instanceId];
  if (!record) return;
  const ability = state.cardDefinitions[record.canonicalId]?.base.abilities.find(
    (a) => a.id === abilityKey || a.id === abilityId,
  );
  if (
    ability?.kind !== "static" ||
    ability.effect?.type !== "replacement" ||
    !ability.effect.limit ||
    ability.effect.limit.per !== "turn" ||
    ability.effect.limit.count !== 1
  ) {
    return;
  }
  const player = state.players[controllerId];
  if (!player) return;
  if (player.history.turn.consumedStaticReplacementIds.includes(replacementId)) return;
  // Stamp the bare instance:ability id used by candidate collection.
  const stampId = `${instanceId}:${ability.id}`;
  if (!player.history.turn.consumedStaticReplacementIds.includes(stampId)) {
    player.history.turn.consumedStaticReplacementIds = [
      ...player.history.turn.consumedStaticReplacementIds,
      stampId,
    ];
  }
}

function endGameForLoserLocal(state: FabMatchState, loserId: string, reason: string): void {
  state.gameEnded = true;
  state.winnerId = state.playerIds.find((playerId) => playerId !== loserId) ?? null;
  state.endReason = reason;
  state.decision = null;
}

function resetPlayerHistoryForTurn(
  player: FabMatchState["players"][string],
  turnNumber: number,
): void {
  Object.assign(player.history, { turn: emptyFabTurnHistory(turnNumber) });
  player.history.combatChain.draconicChainLinks = 0;
  player.history.combatChain.wagered = false;
  player.history.combatChain.lastAttackNames = [];
  player.history.combatChain.lastAttackDidHit = false;
  player.history.combatChain.boostsThisCombatChain = 0;
  player.history.combatChain.cardsBanishedFromSoulThisCombatChain = 0;
  player.history.chainLink.chainLinkNumber = null;
  player.history.chainLink.playedInstant = false;
  player.history.chainLink.damageDealtByType = { arcane: 0, physical: 0, generic: 0 };
  player.history.chainLink.damageDealtBySource = {};
  player.history.chainLink.damageDealtBySourceToHero = {};
  player.history.resolution.processId = null;
}

function assertNeverAssetsTurn(event: never): never {
  throw new Error(`Unhandled FAB assets/turn event: ${JSON.stringify(event)}`);
}
