import type { FabObjectSnapshot, ProposedEvent } from "../../rules/events.ts";
import type {
  FabCanonicalReplacementEffect,
  FabReplacementCandidate,
  FabPersistedReplacementApplicationPolicy,
} from "../../rules/process.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";
import { matchesFabSnapshotFilter } from "../../rules/state-rules-view.ts";
import type { FabRulesSnapshot } from "../transaction-kernel.ts";
import type { CanonicalPrevention } from "./admission.ts";
import {
  clashOutcomeOptionalReclash,
  isClashTieWinClashReplacement,
  isWagerLossOptionalDiscardWinReplacement,
  wagerLossOptionalDiscardWin,
} from "./admission.ts";
import { replacementApplies } from "./collect.ts";

/** Converts the supported printed prevention shape into persisted semantics once. */
export function persistedReplacementApplicationPolicy(
  effect: FabCanonicalReplacementEffect,
): FabPersistedReplacementApplicationPolicy | null {
  if (effect.type === "replacement") {
    const wagerDiscard = wagerLossOptionalDiscardWin(effect);
    if (wagerDiscard) {
      const filter = wagerDiscard.filter;
      return {
        kind: "may-apply",
        cost: { kind: "discard-hand-card", ...(filter ? { filter } : {}) },
        followUps: [],
      };
    }
    const reclash = clashOutcomeOptionalReclash(effect);
    if (reclash) {
      return {
        kind: "may-apply",
        cost: { kind: "destroy-arena-object", filter: reclash.goldFilter },
        consequence: { kind: "reclash-original-reveal" },
        followUps: [],
      };
    }
    return effect.modification.type === "optional"
      ? { kind: "may-apply", followUps: [] }
      : { kind: "mandatory" };
  }
  const cost = effect.optionalCost;
  if (!cost) return { kind: "mandatory" };
  const followUps: import("../../rules/process.ts").FabPersistedPreventionFollowUp[] = [];
  if (
    effect.additionalModification?.type === "draw" &&
    typeof effect.additionalModification.count === "number"
  )
    followUps.push({ kind: "draw", count: effect.additionalModification.count });
  if (
    effect.additionalModification?.type === "destroy" &&
    effect.additionalModification.target?.selector === "self" &&
    effect.additionalModification.delay === "end-phase"
  )
    followUps.push({ kind: "destroy-source-at-end-phase" });
  if (cost.class !== "effect") return null;
  if (cost.type === "discard" && cost.count === 1)
    return {
      kind: "may-apply",
      cost: { kind: "discard-hand-card", ...(cost.filter ? { filter: cost.filter } : {}) },
      followUps,
    };
  if (
    cost.type === "banish" &&
    cost.from === "soul" &&
    (cost.count === undefined || cost.count === 1)
  )
    return { kind: "may-apply", cost: { kind: "banish-soul-card" }, followUps };
  if (
    cost.type === "remove-counters" &&
    cost.counter.kind === "named" &&
    (cost.count === undefined || cost.count === 1)
  )
    return {
      kind: "may-apply",
      cost: {
        kind: "remove-named-counter",
        counter: cost.counter.name,
        amount: 1,
        ...(cost.filter ? { filter: cost.filter } : {}),
      },
      followUps,
    };
  if (cost.type === "banish-self")
    return { kind: "may-apply", cost: { kind: "banish-source" }, followUps };
  return null;
}

export function persistedReplacementCostTargetIds(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
): readonly string[] {
  const cost =
    candidate.persistedApplicationPolicy?.kind === "may-apply"
      ? candidate.persistedApplicationPolicy.cost
      : undefined;
  if (!cost) return [];
  const zones = state.containers.zonesByPlayerId[candidate.controllerId];
  if (!zones) return [];
  if (cost.kind === "discard-hand-card")
    return zones.hand.filter(
      (id) =>
        !cost.filter ||
        matchesFabSnapshotFilter(
          state,
          snapshotObject(state, id, candidate.controllerId, "hand"),
          cost.filter,
        ),
    );
  if (cost.kind === "banish-soul-card") return [...zones.soul];
  if (cost.kind === "remove-named-counter")
    return (["arena", "head", "chest", "arms", "legs"] as const).flatMap((zone) =>
      zones[zone].filter((id) => {
        const object = snapshotObject(state, id, candidate.controllerId, zone);
        const count =
          state.objects[id]?.counters.find((c) => c.kind === "named" && c.name === cost.counter)
            ?.count ?? 0;
        return (
          count >= cost.amount &&
          (!cost.filter || matchesFabSnapshotFilter(state, object, cost.filter))
        );
      }),
    );
  if (cost.kind === "destroy-arena-object")
    return zones.arena.filter((id) =>
      matchesFabSnapshotFilter(
        state,
        snapshotObject(state, id, candidate.controllerId, "arena"),
        cost.filter,
      ),
    );
  return [];
}

export function snapshotPersistedCostTarget(
  state: FabRulesSnapshot,
  playerId: string,
  instanceId: string,
): FabObjectSnapshot | null {
  for (const zone of ["arena", "head", "chest", "arms", "legs"] as const) {
    if (state.containers.zonesByPlayerId[playerId]?.[zone].includes(instanceId))
      return snapshotObject(state, instanceId, playerId, zone);
  }
  return null;
}

export function validPersistedCostTargetId(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
): string | null {
  const binding = candidate.persistedCostTarget;
  if (!binding || state.objects[binding.instanceId]?.incarnation !== binding.incarnation)
    return null;
  return persistedReplacementCostTargetIds(state, candidate).includes(binding.instanceId)
    ? binding.instanceId
    : null;
}

/**
 * CR 6.4.10j: live remaining budget of a registered shielding effect (the
 * persisted record's numeric `effect.amount`, decremented per point prevented
 * by the consume-replacement-effects reducer). Null when the candidate is not
 * a persisted shielding prevention (fixed and keyword preventions resolve
 * their amount through the normal paths) or when no persisted record answers
 * the id.
 */
export function shieldingRemainingAmount(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  effect: CanonicalPrevention,
): number | null {
  if (effect.preventionKind !== "shielding" || candidate.origin !== "persisted") return null;
  const persistedId = candidate.originReplacementId ?? candidate.replacementId;
  const persistedEffect = state.replacementEffects.find(
    (entry) => entry.replacementId === persistedId,
  )?.effect;
  const amount = persistedEffect?.type === "prevention" ? persistedEffect.amount : undefined;
  return typeof amount === "number" ? amount : null;
}

/**
 * A declared target is only a proposed payment. This shape has a conditional
 * consequence, so it must cross the event kernel and obtain an exact committed
 * cost receipt before the outcome can be reversed (CR 1.8.4a, 1.8.9).
 */
export function replacementRequiresCommittedCostReceipt(
  candidate: FabReplacementCandidate,
): boolean {
  return (
    isWagerLossOptionalDiscardWinReplacement(candidate.effect) ||
    clashOutcomeOptionalReclash(candidate.effect) !== null
  );
}

export function replacementCostCommitKey(
  candidate: FabReplacementCandidate,
  event: ProposedEvent,
): string | null {
  if (!replacementRequiresCommittedCostReceipt(candidate)) return null;
  const outcomeId =
    event.name === "wager-loss"
      ? event.data.wagerId
      : event.name === "clash-outcome"
        ? event.data.clashId
        : null;
  if (!outcomeId) return null;
  const scope = candidate.persistedCostTarget
    ? `${candidate.persistedCostTarget.instanceId}:${candidate.persistedCostTarget.incarnation}`
    : "unbound";
  return `${candidate.replacementId}:${outcomeId}:${scope}`;
}

/** Exact, incarnation-bound original reveals legal for the re-clash consequence. */
export function persistedReplacementConsequenceTargetIds(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
): readonly string[] {
  const process = state.rulesProcess;
  const processEvents = process
    ? [
        ...process.pendingEvents,
        ...process.resolutionEventGroups.flatMap((group) => group.events),
        ...(process.procedure?.eventGroups.flatMap((group) => group.events) ?? []),
      ]
    : [];
  const outcome = processEvents.find(
    (event): event is ProposedEvent<"clash-outcome"> =>
      event.name === "clash-outcome" && replacementApplies(state, candidate, event),
  );
  if (!outcome) return [];
  if (isClashTieWinClashReplacement(candidate.effect)) {
    return [outcome.data.firstPlayerId, outcome.data.secondPlayerId].flatMap(
      (playerId) => state.containers.zonesByPlayerId[playerId]?.heroZone.slice(0, 1) ?? [],
    );
  }
  if (
    candidate.persistedApplicationPolicy?.kind !== "may-apply" ||
    candidate.persistedApplicationPolicy.consequence?.kind !== "reclash-original-reveal"
  )
    return [];
  return outcome.data.revealed
    .filter((object) => {
      const deck = state.containers.zonesByPlayerId[object.ownerId]?.deck ?? [];
      return (
        deck.includes(object.instanceId) &&
        state.objects[object.instanceId]?.incarnation === object.ref.incarnation
      );
    })
    .map((object) => object.instanceId);
}

export function proposePersistedReplacementCostCommit(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  events: readonly ProposedEvent[],
): {
  readonly key: string;
  readonly event: ProposedEvent<"discard"> | ProposedEvent<"destroy">;
} | null {
  if (!replacementRequiresCommittedCostReceipt(candidate)) return null;
  const original = events.find((event) => replacementApplies(state, candidate, event));
  const targetId = validPersistedCostTargetId(state, candidate);
  if (!original || !targetId) return null;
  const key = replacementCostCommitKey(candidate, original);
  if (!key) return null;
  const cost =
    candidate.persistedApplicationPolicy?.kind === "may-apply"
      ? candidate.persistedApplicationPolicy.cost
      : undefined;
  if (cost?.kind === "destroy-arena-object") {
    const destroyed = snapshotObject(state, targetId, candidate.controllerId, "arena");
    return {
      key,
      event: {
        ...original,
        name: "destroy",
        cause: {
          kind: "effect",
          abilityId: candidate.replacementId,
          source: candidate.source,
          controllerId: candidate.controllerId,
        },
        controllerId: candidate.controllerId,
        source: candidate.source,
        affected: [destroyed],
        bindings: { ...original.bindings, destroyedCost: destroyed },
        data: {
          object: destroyed,
          destinationRef: nextFabDestinationRef(state, destroyed),
          from: "arena",
          to: "graveyard",
          reason: "destroy",
        },
      },
    };
  }
  if (cost?.kind !== "discard-hand-card") return null;
  const discarded = snapshotObject(state, targetId, candidate.controllerId, "hand");
  return {
    key,
    event: {
      ...original,
      name: "discard",
      cause: {
        kind: "effect",
        abilityId: candidate.replacementId,
        source: candidate.source,
        controllerId: candidate.controllerId,
      },
      controllerId: candidate.controllerId,
      source: candidate.source,
      affected: [discarded],
      bindings: { ...original.bindings, discardedCard: discarded },
      data: {
        playerId: candidate.controllerId,
        object: discarded,
        destinationRef: nextFabDestinationRef(state, discarded),
        random: false,
      },
    },
  };
}

/** Propose the exact selected reveal's same-deck bottom move after cost payment. */
export function proposePersistedReclashMoveCommit(
  state: FabRulesSnapshot,
  candidate: FabReplacementCandidate,
  events: readonly ProposedEvent[],
): { readonly key: string; readonly event: ProposedEvent<"move-zone"> } | null {
  if (
    candidate.persistedApplicationPolicy?.kind !== "may-apply" ||
    candidate.persistedApplicationPolicy.consequence?.kind !== "reclash-original-reveal"
  )
    return null;
  const original = events.find(
    (event): event is ProposedEvent<"clash-outcome"> =>
      event.name === "clash-outcome" && replacementApplies(state, candidate, event),
  );
  const selected = candidate.persistedConsequenceTarget;
  const revealed = selected
    ? original?.data.revealed.find(
        (object) =>
          object.instanceId === selected.instanceId &&
          object.ref.incarnation === selected.incarnation,
      )
    : undefined;
  if (!original || !revealed) return null;
  const deck = state.containers.zonesByPlayerId[revealed.ownerId]?.deck ?? [];
  if (
    !deck.includes(revealed.instanceId) ||
    state.objects[revealed.instanceId]?.incarnation !== revealed.ref.incarnation
  )
    return null;
  const costKey = replacementCostCommitKey(candidate, original);
  if (
    !costKey ||
    state.rulesProcess?.replacementCostCommitReceipts?.[costKey]?.status !== "committed"
  )
    return null;
  const key = `${costKey}:reveal:${revealed.instanceId}:${revealed.ref.incarnation}`;
  return {
    key,
    event: {
      ...original,
      name: "move-zone",
      cause: {
        kind: "effect",
        abilityId: candidate.replacementId,
        source: candidate.source,
        controllerId: candidate.controllerId,
      },
      controllerId: candidate.controllerId,
      source: candidate.source,
      affected: [revealed],
      data: {
        object: revealed,
        destinationRef: null,
        from: revealed.zone,
        to: "deck",
        reason: "move",
        position: "bottom",
      },
    },
  };
}
