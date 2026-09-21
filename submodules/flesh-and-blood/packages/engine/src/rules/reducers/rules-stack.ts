import type { FabMatchState } from "../../state.ts";
import { withoutFabScopedAutoPass } from "../../state.ts";
import { nextRandom } from "../../random.ts";
import type { ProposedEvent } from "../events.ts";
import type { FabEventReduction } from "../../kernel/transaction-kernel.ts";
import { validAttackTarget } from "./shared.ts";
import { openFabPriorityForCurrentContext } from "../../priority.ts";
import { disclosedFabLayerSource } from "../layers.ts";
import {
  effectiveActivationLimit,
  activationLimitUsageKey,
  activationLimitUsageCount,
} from "../../procedures/activate-ability/helpers.ts";

export type RulesStackEventName =
  | "declare-triggered-layer"
  | "remove-rules-layer"
  | "consume-random-index"
  | "expire-replacement-effects"
  | "consume-replacement-effects"
  | "consume-delayed-triggers"
  | "register-delayed-trigger"
  | "register-replacement"
  | "choose-opponent"
  | "announce-activation"
  | "activate";

type RulesStackEvent = Extract<ProposedEvent, { name: RulesStackEventName }>;

export function reduceRulesStackEvent(
  state: FabMatchState,
  event: RulesStackEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "declare-triggered-layer": {
      if (
        !state.players[event.data.layer.controllerId] ||
        state.rulesStack.some((layer) => layer.layerId === event.data.layer.layerId) ||
        event.data.layer.layerId !== `layer-${state.counters.layer + 1}`
      )
        return null;
      state.counters.layer += 1;
      state.rulesStack.push({
        ...event.data.layer,
        source: disclosedFabLayerSource(event.data.layer.source),
      });
      openFabPriorityForCurrentContext(state, state.activePlayerId);
      return { state };
    }
    case "remove-rules-layer": {
      const layerIndex = state.rulesStack.findIndex(
        (layer) => layer.layerId === event.data.layerId,
      );
      if (layerIndex === -1) return null;
      state.rulesStack.splice(layerIndex, 1);
      if (state.rulesProcess?.resolvingLayerId === event.data.layerId) {
        state.rulesProcess.resolvingLayerId = null;
      }
      if (
        state.combat?.step === "layer" &&
        !state.combat.activeLink &&
        state.rulesStack.length === 0
      ) {
        state.combat = null;
        // An aborted layer-step chain is still a chain close: retire "this
        // combat" auto-pass scopes with it.
        state.automationPreferences = withoutFabScopedAutoPass(
          state.automationPreferences,
          "combat",
        );
      }
      // Removing the layer re-anchors the window for the same holder inside
      // one resolution transaction (e.g. the attack event just stamped the
      // attacker's own-action window); an existing stamp must survive the
      // re-anchor instead of being clobbered by an unstamped grant.
      const reanchored = state.priority;
      const origin =
        reanchored?.holderPlayerId === state.activePlayerId ? reanchored.origin : undefined;
      openFabPriorityForCurrentContext(state, state.activePlayerId, origin);
      return { state };
    }
    case "consume-random-index": {
      if (!Number.isSafeInteger(event.data.maxExclusive) || event.data.maxExclusive <= 0)
        return null;
      const roll = nextRandom(state.rngState);
      const expected = Math.floor(roll.value * event.data.maxExclusive);
      if (event.data.result !== expected) return null;
      state.rngState = roll.state;
      return { state };
    }
    case "expire-replacement-effects": {
      const ids = new Set(event.data.replacementIds);
      if (ids.size === 0) return null;
      const before = state.replacementEffects.length;
      state.replacementEffects = state.replacementEffects.filter(
        (replacement) => !ids.has(replacement.replacementId),
      );
      return state.replacementEffects.length === before ? null : { state };
    }
    case "consume-replacement-effects": {
      if (event.data.consumptions.length === 0) return null;
      const persistedIds = new Set(
        event.data.consumptions
          .filter((consumption) => consumption.origin === "persisted")
          .map((consumption) => consumption.replacementId),
      );
      // CR 6.4.10a/6.4.10j: a shielding application carries the damage it
      // actually prevented; the persisted effect's budget (effect.amount) is
      // reduced by that total and the effect ceases to exist once nothing
      // remains.
      const shieldingDecrements = new Map<string, number>();
      for (const consumption of event.data.consumptions) {
        if (
          consumption.origin === "persisted" &&
          typeof consumption.preventedAmount === "number" &&
          consumption.preventedAmount > 0
        ) {
          shieldingDecrements.set(
            consumption.replacementId,
            (shieldingDecrements.get(consumption.replacementId) ?? 0) + consumption.preventedAmount,
          );
        }
      }
      const before = state.replacementEffects.length;
      state.replacementEffects = state.replacementEffects.flatMap((replacement) => {
        if (!persistedIds.has(replacement.replacementId)) return [replacement];
        // CR 6.4.10j: a shielding prevention's lifetime is its per-point budget.
        // Decrement by the points this application actually prevented (carried
        // on the consumption record, summed across every application of the
        // same shield in the boundary batch) and keep the effect while budget
        // remains — it applies to future damage events this duration.
        // CR 6.4.10h comes free: unpreventable damage prevents 0 points and
        // emits no consumption, so no budget is spent.
        if (
          replacement.effect.type === "prevention" &&
          replacement.effect.preventionKind === "shielding"
        ) {
          if (typeof replacement.effect.amount !== "number") return [];
          const decrement = shieldingDecrements.get(replacement.replacementId) ?? 0;
          const remaining = replacement.effect.amount - decrement;
          return remaining > 0
            ? [{ ...replacement, effect: { ...replacement.effect, amount: remaining } }]
            : [];
        }
        const remaining =
          replacement.effect.type === "prevention" && typeof replacement.effect.times === "number"
            ? replacement.effect.times
            : undefined;
        if (remaining === undefined || remaining <= 1) return [];
        return [{ ...replacement, effect: { ...replacement.effect, times: remaining - 1 } }];
      });
      let staticChanged = false;
      for (const consumption of event.data.consumptions) {
        if (consumption.origin !== "static") continue;
        const history = state.players[consumption.controllerId]?.history.turn;
        if (!history || history.consumedStaticReplacementIds.includes(consumption.replacementId))
          continue;
        history.consumedStaticReplacementIds.push(consumption.replacementId);
        staticChanged = true;
      }
      return persistedIds.size === 0 && state.replacementEffects.length === before && !staticChanged
        ? null
        : { state };
    }
    case "consume-delayed-triggers": {
      const ids = new Set(event.data.delayedTriggerIds);
      if (ids.size === 0) return null;
      const before = state.delayedTriggers.length;
      state.delayedTriggers = state.delayedTriggers.filter(
        (delayed) => !ids.has(delayed.delayedTriggerId),
      );
      return state.delayedTriggers.length === before ? null : { state };
    }
    case "register-delayed-trigger":
      if (
        state.delayedTriggers.some(
          (delayed) => delayed.delayedTriggerId === event.data.delayedTriggerId,
        )
      ) {
        return null;
      }
      state.delayedTriggers.push({
        delayedTriggerId: event.data.delayedTriggerId,
        controllerId: event.data.controllerId,
        source: event.data.source,
        trigger: event.data.trigger,
        resolution: event.data.resolution,
        policy: event.data.policy,
        ...(event.data.bindings ? { bindings: event.data.bindings } : {}),
        createdByEventId: `event-${state.counters.event + 1}`,
      });
      return { state };
    case "register-replacement": {
      if (
        state.replacementEffects.some(
          (replacement) => replacement.replacementId === event.data.replacementId,
        )
      ) {
        return null;
      }
      const expiresAt = replacementExpiry(state, event.data.source, event.data.effect.duration);
      if (!expiresAt) return null;
      state.replacementEffects.push({
        replacementId: event.data.replacementId,
        controllerId: event.data.controllerId,
        source: event.data.source,
        effect: event.data.effect,
        createdByEventId: `event-${state.counters.event + 1}`,
        expiresAt,
        consumptionPolicy: event.data.consumptionPolicy,
        applicationPolicy: event.data.applicationPolicy,
        ...(event.data.shieldedPlayerId ? { shieldedPlayerId: event.data.shieldedPlayerId } : {}),
        ...(event.data.shieldedFilter ? { shieldedFilter: event.data.shieldedFilter } : {}),
        ...(event.data.preventedSourceInstanceId
          ? { preventedSourceInstanceId: event.data.preventedSourceInstanceId }
          : {}),
        ...(event.data.redirectPlayerId ? { redirectPlayerId: event.data.redirectPlayerId } : {}),
      });
      return { state };
    }
    case "choose-opponent": {
      // Observation only — 1v1 product binds the sole opponent at proposal time
      // (opponentOf). Validate seats so illegal multi-seat states cannot commit.
      if (state.playerIds.length !== 2) return null;
      if (
        !state.players[event.data.actorId] ||
        !state.players[event.data.opponentId] ||
        event.data.actorId === event.data.opponentId
      ) {
        return null;
      }
      return { state };
    }
    case "announce-activation": {
      const ability = event.data.ability;
      if (ability.id !== event.data.abilityId) return null;
      const isAttackProxy = ability.abilityType === "attack";
      const isAttackLayer = ability.effect.type === "attack-with";
      const isAttack = isAttackProxy || isAttackLayer;
      if (
        isAttack &&
        (!event.data.attackTarget ||
          !validAttackTarget(
            state,
            event.data.actorId,
            event.data.attackTarget,
            event.data.attackTarget.kind === "hero"
              ? event.data.attackTarget.playerId
              : event.data.attackTarget.controllerId,
          ))
      )
        return null;
      state.counters.layer += 1;
      const layerBase = {
        kind: "activated" as const,
        layerId: `layer-${state.counters.layer}` as const,
        controllerId: event.data.actorId,
        source: disclosedFabLayerSource(event.data.object),
        keywords:
          ability.layerKeywords?.map((keyword) =>
            typeof keyword === "string" ? keyword : keyword.name,
          ) ?? [],
        modes: [],
        targets: event.data.targets,
        equipDestination: event.data.equipDestination,
        bindings: event.bindings,
        abilityId: ability.id,
        effect: ability.effect,
        additionalAttackTargets: [],
      };
      if (isAttack && event.data.attackTarget) {
        state.rulesStack.push({
          ...layerBase,
          role: "attack",
          attackKind: isAttackProxy ? "proxy" : "layer",
          attackTarget: event.data.attackTarget,
        });
      } else {
        state.rulesStack.push({ ...layerBase, role: "ability", attackTarget: null });
      }
      if (isAttackProxy) {
        // CR 8.3.1b: adding an attack-proxy to the stack opens combat and
        // begins the Layer Step before either player receives priority. When
        // go again returned priority in Resolution, this is the next link of
        // the existing combat chain; its resolved link and LKI must survive
        // until the new attack event advances the chain-link number.
        state.combat = state.combat?.open
          ? {
              ...state.combat,
              step: "layer",
              defenseDeclarationPending: false,
            }
          : {
              open: true,
              step: "layer",
              activeLink: null,
              defenseDeclarationPending: false,
              chainLinkNumber: 0,
              closedLinks: [],
            };
      }
      return { state };
    }
    case "activate": {
      const ability = event.data.ability;
      if (ability.id !== event.data.abilityId) return null;
      const layerIndex = state.rulesStack.findIndex(
        (layer) =>
          layer.kind === "activated" &&
          layer.controllerId === event.data.actorId &&
          layer.abilityId === ability.id &&
          layer.source.instanceId === event.data.object.instanceId &&
          layer.source.ref.incarnation === event.data.object.ref.incarnation,
      );
      if (layerIndex === -1) return null;
      const effectiveLimit = effectiveActivationLimit({
        state,
        actorId: event.data.actorId,
        instanceId: event.data.object.instanceId,
        incarnation: event.data.object.ref.incarnation,
        ability,
      });
      if (effectiveLimit !== null) {
        const limitKey = activationLimitUsageKey({
          state,
          actorId: event.data.actorId,
          instanceId: event.data.object.instanceId,
          incarnation: event.data.object.ref.incarnation,
          ability,
        });
        if (limitKey === null) return null;
        if (
          activationLimitUsageCount({
            state,
            actorId: event.data.actorId,
            instanceId: event.data.object.instanceId,
            incarnation: event.data.object.ref.incarnation,
            ability,
          }) >= effectiveLimit
        )
          return null;
        state.abilityLimitUsage[limitKey] = (state.abilityLimitUsage[limitKey] ?? 0) + 1;
      }
      const layer = state.rulesStack[layerIndex]!;
      const timesActivated = activationLimitUsageCount({
        state,
        actorId: event.data.actorId,
        instanceId: event.data.object.instanceId,
        incarnation: event.data.object.ref.incarnation,
        ability,
      });
      state.rulesStack[layerIndex] = {
        ...layer,
        bindings: { ...event.bindings, "times-activated-this-ability": timesActivated },
      };
      openFabPriorityForCurrentContext(state, event.data.actorId, {
        kind: "own-action",
        sourceInstanceId: event.data.object.instanceId,
      });
      return { state };
    }
    default:
      return assertNeverRulesStack(event);
  }
}

// --- Rules-stack domain helpers ---

function replacementExpiry(
  state: FabMatchState,
  source: ProposedEvent<"register-replacement">["data"]["source"],
  duration: Extract<
    ProposedEvent<"register-replacement">["data"]["effect"],
    { readonly type: "replacement" | "prevention" }
  >["duration"],
) {
  switch (duration) {
    case undefined:
    case "permanent":
      return { kind: "permanent" as const };
    case "this-turn":
      return { kind: "turn" as const, turnNumber: state.turnNumber };
    case "this-chain-link":
      return {
        kind: "combat-chain" as const,
        combatNumber: state.combat?.chainLinkNumber ?? 0,
      };
    case "this-combat-chain":
      // Live while combat is open (any link). chainLinkNumber stamps expire
      // when Layer (0) becomes Attack (1), so Ball Lightning never boosted.
      return { kind: "combat-chain" as const, combatNumber: -1 };
    case "while-in-arena":
      return { kind: "source" as const, instanceId: source.instanceId };
    default:
      return null;
  }
}

function assertNeverRulesStack(event: never): never {
  throw new Error(`Unhandled FAB rules-stack event: ${JSON.stringify(event)}`);
}
