import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { fabObjectInstanceId } from "../../game/identity.ts";
import { fabPrimaryDefenders } from "../../game/combat.ts";
import type { ProposedEvent } from "../events.ts";
import { snapshotObject, snapshotPlayerId } from "../snapshots.ts";
// ProposedEvent used by add-defending origin mapping.
import {
  type FabEffectProposalResult,
  type ProposalContext,
  baseEvent,
  heroTargets,
  objectTargets,
  resolveLayerAmount,
  unsupported,
} from "./shared.ts";

/** Counter, face, status, tap, and defending leaf effects. */
export function proposeCounterStatusEffect(
  ctx: ProposalContext,
  effect: FabEffect,
): FabEffectProposalResult | null {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;

  if (effect.type === "add-counter" || effect.type === "remove-counters") {
    const starCount =
      typeof effect.count === "object" &&
      effect.count !== null &&
      "type" in effect.count &&
      (effect.count.type === "all" || effect.count.type === "any-number");
    const resolvedCount = starCount
      ? null
      : typeof effect.count === "number"
        ? effect.count
        : resolveLayerAmount(state, layer, effect.count);
    if (starCount && effect.type === "add-counter") {
      return unsupported(effect, "non-constant counter amount");
    }
    if (!starCount && resolvedCount === null) {
      return unsupported(effect, "non-constant counter amount");
    }
    const count = resolvedCount ?? 0;
    const declaredXCount =
      typeof effect.count === "object" && effect.count !== null && effect.count.type === "x";
    const objects = objectTargets(
      state,
      layer,
      effect.target,
      targetPath,
      effectTargets,
      effectPath,
    );
    if (!objects) return unsupported(effect, "counter target is unresolved");
    // Named counters (steam, energy, suspense, …) use counter-added/removed.
    if (effect.counter.kind === "named") {
      const counter = effect.counter.name;
      if (effect.type === "add-counter") {
        return {
          supported: true,
          events: objects.map((object) => ({
            ...baseEvent(layer, processId),
            name: "counter-added" as const,
            affected: [object],
            bindings: {
              ...layer.bindings,
              it: object,
            },
            data: { object, counter, amount: count },
          })),
        };
      }
      // remove-counter(s): require a live matching stack so optional "if you do"
      // (Virtuoso Bodice, Anticipating Gaze family) does not stage then-branch
      // from invented removals when the permanent lacks the counter.
      const events: ProposedEvent[] = [];
      let countersRemoved =
        typeof layer.bindings["counters-removed"] === "number"
          ? layer.bindings["counters-removed"]
          : 0;
      for (const object of objects) {
        const live = state.objects[object.instanceId];
        if (!live) continue;
        const available =
          live.counters.find((c) => c.kind === "named" && c.name === counter)?.count ?? 0;
        const amount = starCount ? available : declaredXCount ? Math.min(available, count) : count;
        if (amount === null || amount <= 0 || available < amount) continue;
        countersRemoved += amount;
        events.push({
          ...baseEvent(layer, processId),
          name: "counter-removed" as const,
          affected: [object],
          bindings: {
            ...layer.bindings,
            "counters-removed": countersRemoved,
          },
          data: { object, counter, amount },
        });
      }
      return { supported: true, events };
    }
    // Numeric property counters (+1{p}, −1{d}, …).
    // - add-counter → numeric-counter-added
    // - remove-counters / remove-counter → numeric-counter-removed, only when
    //   the live object already has enough matching counters. Empty events when
    //   it does not so optional "if you do" (Anticipating Gaze) does not fire.
    if (effect.counter.kind === "numeric") {
      const value = effect.counter.value;
      const property = effect.counter.property;
      if (typeof value !== "number") {
        return unsupported(effect, "numeric counter value must be constant");
      }
      if (effect.type === "add-counter") {
        return {
          supported: true,
          events: objects.map((object) => ({
            ...baseEvent(layer, processId),
            name: "numeric-counter-added" as const,
            affected: [object],
            bindings: {
              ...layer.bindings,
              it: object,
            },
            data: {
              object,
              property,
              value,
              count,
            },
          })),
        };
      }
      // remove-counter(s): require matching stacks on the live object.
      const events: ProposedEvent[] = [];
      let countersRemoved =
        typeof layer.bindings["counters-removed"] === "number"
          ? layer.bindings["counters-removed"]
          : 0;
      for (const object of objects) {
        const live = state.objects[object.instanceId];
        if (!live) continue;
        const available = live.counters.reduce((sum, counter) => {
          if (
            counter.kind === "numeric" &&
            counter.property === property &&
            counter.value === value
          ) {
            return sum + counter.count;
          }
          return sum;
        }, 0);
        const amount = starCount ? available : declaredXCount ? Math.min(available, count) : count;
        if (amount === null || amount <= 0 || available < amount) continue;
        countersRemoved += amount;
        events.push({
          ...baseEvent(layer, processId),
          name: "numeric-counter-removed" as const,
          affected: [object],
          bindings: { ...layer.bindings, "counters-removed": countersRemoved },
          data: {
            object,
            property,
            value,
            count: amount,
          },
        });
      }
      return { supported: true, events };
    }
    return unsupported(effect, "unsupported counter kind");
  }

  if (effect.type === "turn-face-up" || effect.type === "turn-face-down") {
    const objects = objectTargets(
      state,
      layer,
      effect.target,
      targetPath,
      effectTargets,
      effectPath,
    );
    // CR 1.8.6: a missing or empty binding (declined choose / X=0) is an empty
    // parameter set. Later face-change must no-op, not fail the layer.
    if (
      !objects &&
      effect.target.selector === "binding" &&
      !layer.bindings[effect.target.binding]
    ) {
      return { supported: true, events: [] };
    }
    if (!objects) return unsupported(effect, "face-change target is unresolved");
    if (objects.length === 0) return { supported: true, events: [] };
    // outputBinding lets follow-up sequence steps (Showman: if it has crush…)
    // see the turned card as "it". Tentacular Toll counts the whole cohort.
    const outputBinding =
      "outputBinding" in effect && typeof effect.outputBinding === "string"
        ? effect.outputBinding
        : null;
    const thisWay =
      effect.type === "turn-face-down"
        ? {
            "turned-face-down-this-way": objects,
            "turned-face-down-this-way-count": objects.length,
          }
        : {};
    return {
      supported: true,
      events: objects.map((object) => ({
        ...baseEvent(layer, processId),
        name: effect.type,
        affected: [object],
        bindings: {
          ...layer.bindings,
          ...thisWay,
          ...(outputBinding ? { [outputBinding]: object } : {}),
        },
        data: { playerId: object.controllerId || layer.controllerId, object },
      })) as ProposedEvent[],
    };
  }

  if (effect.type === "set-status") {
    const objects = objectTargets(
      state,
      layer,
      effect.target,
      targetPath,
      effectTargets,
      effectPath,
    );
    if (!objects) return unsupported(effect, "status target is unresolved");
    // "The dagger has hit" (Danger Digits / Throw Dagger): emit a real hit
    // event so on-hit triggers fire; keep set-status for LKI/status readers.
    if (effect.status === "hit") {
      const combat = state.combat?.activeLink;
      const defendingPlayerId =
        combat?.defendingPlayerId ??
        state.lastClosedCombat?.defendingPlayerId ??
        state.playerIds.find((id) => id !== layer.controllerId) ??
        layer.controllerId;
      const events: ProposedEvent[] = [];
      for (const object of objects) {
        events.push({
          ...baseEvent(layer, processId),
          name: "hit" as const,
          affected: [object],
          source: object,
          data: {
            actorId: layer.controllerId,
            object,
            target: { kind: "hero" as const, playerId: defendingPlayerId },
            damage: 1,
            attackingPlayerId: layer.controllerId,
            defendingPlayerId,
            ...(state.players[defendingPlayerId]?.marked === true ? { targetWasMarked: true } : {}),
          },
        });
        events.push({
          ...baseEvent(layer, processId),
          name: "set-status" as const,
          affected: [object],
          data: { object, status: "hit" },
        });
      }
      return { supported: true, events };
    }
    return {
      supported: true,
      events: objects.map((object) => ({
        ...baseEvent(layer, processId),
        name: "set-status" as const,
        affected: [object],
        data: { object, status: effect.status },
      })),
    };
  }

  if (effect.type === "tap" || effect.type === "untap") {
    let objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
    if (!objects) {
      const playerIds = heroTargets(state, layer, effect.target, targetPath);
      if (playerIds) {
        objects = playerIds.flatMap((playerId) => {
          const heroId = state.containers.zonesByPlayerId[playerId]?.heroZone[0];
          return heroId ? [snapshotObject(state, heroId, playerId, "heroZone")] : [];
        });
      }
    }
    if (!objects) return unsupported(effect, "tap target is unresolved");
    const outputBinding = effect.outputBinding ?? null;
    return {
      supported: true,
      events: objects.map((object) => ({
        ...baseEvent(layer, processId),
        ...(outputBinding ? { bindings: { ...layer.bindings, [outputBinding]: object } } : {}),
        name: "set-tapped" as const,
        affected: [object],
        data: { object, tapped: effect.type === "tap" },
      })),
    };
  }

  if (effect.type === "add-defending") {
    const link = state.combat?.activeLink;
    if (!link) return unsupported(effect, "there is no active chain link");
    let objects = objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);
    if (
      !objects &&
      effect.target.selector === "binding" &&
      !layer.bindings[effect.target.binding]
    ) {
      return { supported: true, events: [] };
    }
    if (!objects) return unsupported(effect, "defending target is unresolved");
    if (objects.length === 0) return { supported: true, events: [] };
    // CR 7.2.3b: adding an object that is already defending does not create a
    // second defender and does not produce another defend event. Later steps
    // in the same effect still resolve (Quickdodge sets its base defense).
    objects = objects.filter(
      (object) => !fabPrimaryDefenders(link).includes(fabObjectInstanceId(object.instanceId)),
    );
    if (objects.length === 0) return { supported: true, events: [] };
    // Legal origins for "add … as a defending card":
    // - hand / arsenal (pulsewave, intimate inducement, …)
    // - deck top after reveal (PEN314 Helm of Safe Haven)
    // - banished after a prior banish step (Base of the Mountain)
    // - equipped equipment seats (Leap Frog family — add this from Head/etc.)
    // Self resolving to the attack object is not a hand defender: fall back to
    // another hand card only when the target was not equipment/deck.
    const defendFrom = (zone: string): ProposedEvent<"defend">["data"]["from"] | null => {
      switch (zone) {
        case "hand":
        case "arsenal":
        case "deck":
        // Base of the Mountain: banish from hand, then add those cards as
        // defending. After the banish they sit in the banished zone.
        case "banished":
          return zone;
        case "equipment-head":
        case "head":
          return "head";
        case "equipment-chest":
        case "chest":
          return "chest";
        case "equipment-arms":
        case "arms":
          return "arms";
        case "equipment-legs":
        case "legs":
          return "legs";
        default:
          return null;
      }
    };
    if (objects.some((object) => defendFrom(object.zone) === null)) {
      const allEquipmentOrAttack = objects.every(
        (object) =>
          object.zone === "combat-chain" ||
          object.zone === "permanent" ||
          object.zone === "weapon" ||
          defendFrom(object.zone) === null,
      );
      if (allEquipmentOrAttack) {
        const hand = state.containers.zonesByPlayerId[layer.controllerId]?.hand ?? [];
        const handId = hand.find((id) => id !== layer.source.instanceId);
        if (handId) {
          objects = [snapshotObject(state, handId, layer.controllerId, "hand")];
        }
      }
    }
    if (objects.some((object) => defendFrom(object.zone) === null)) {
      return unsupported(
        effect,
        "defending object is not in hand, arsenal, deck, banished, or an equipment seat",
      );
    }
    const attack = snapshotObject(
      state,
      link.activeAttack.sourceObjectId,
      link.attackingPlayerId,
      "combatChain",
    );
    // CR 7.0.5b: an effect that tries to add an illegal defender fails before
    // the object moves zones or emits a defend event. In particular, overpower
    // counts action-card defenders regardless of whether they were declared or
    // added by an effect from another zone.
    if (attack.current.keywords.some((keyword) => keyword.name === "overpower")) {
      const existingActionDefender = fabPrimaryDefenders(link).some((instanceId) => {
        const defender = state.objects[instanceId];
        if (!defender) return false;
        return snapshotObject(
          state,
          instanceId,
          defender.ownerId,
          "combatChain",
        ).current.typeBox.types.includes("Action");
      });
      const addsActionDefender = objects.some((object) =>
        object.current.typeBox.types.includes("Action"),
      );
      if (existingActionDefender && addsActionDefender) {
        return { supported: true, events: [] };
      }
    }
    return {
      supported: true,
      events: objects.flatMap((object) => {
        const from = defendFrom(object.zone)!;
        return [
          {
            ...baseEvent(layer, processId),
            name: "defend" as const,
            affected: [object],
            bindings: { ...layer.bindings, defendingCard: object, attack },
            data: {
              actorId: snapshotPlayerId(object),
              object,
              destinationRef: null,
              attack,
              from,
              origin: from,
            },
          },
          // Observation marker so leaf contracts can prove add-defending without
          // conflating defender-side block defends.
          {
            ...baseEvent(layer, processId),
            name: "set-status" as const,
            affected: [object],
            data: { object, status: "added-as-defending" },
          },
        ];
      }),
    };
  }

  return null;
}
