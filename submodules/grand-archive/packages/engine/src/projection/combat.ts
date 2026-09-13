import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveCombatState, GrandArchiveMatchState } from "../game/model.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveCommittedEvent } from "../kernel/events.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { prepareGrandArchiveRuleBoundEvent } from "../kernel/event-admission.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "../rules/replacements/replacements.ts";
import {
  grandArchiveCombatDamageStat,
  grandArchiveObjectPower,
  proposeGrandArchiveCombatDamage,
} from "../procedures/combat/combat.ts";

export type GrandArchiveDamageForecast =
  | {
      readonly kind: "projected" | "dealt";
      readonly amounts: readonly {
        readonly sourceId: GrandArchiveObjectId;
        readonly recipientId: GrandArchiveObjectId;
        readonly amount: number;
      }[];
    }
  | {
      readonly kind: "pending";
      readonly reason: "effects" | "choice" | "order" | "replacement" | "unavailable";
    };

export interface GrandArchiveCombatView {
  readonly combat: GrandArchiveCombatState;
  readonly active: boolean;
  readonly opportunityHolderId: GrandArchivePlayerId | null;
  readonly decision: {
    readonly playerId: GrandArchivePlayerId;
    readonly kind: NonNullable<GrandArchiveMatchState["decision"]>["kind"];
  } | null;
  readonly retaliationPending: boolean;
  readonly damage: GrandArchiveDamageForecast;
  readonly contributions: readonly {
    readonly objectId: GrandArchiveObjectId;
    readonly amount: number;
  }[];
}

const combatViews = new WeakMap<
  GrandArchiveMatchProgram,
  WeakMap<GrandArchiveMatchState, GrandArchiveCombatView | null>
>();

export function projectGrandArchiveCombatView(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): GrandArchiveCombatView | null {
  let snapshots = combatViews.get(program);
  if (!snapshots) {
    snapshots = new WeakMap();
    combatViews.set(program, snapshots);
  }
  if (snapshots.has(state)) return snapshots.get(state) ?? null;
  const view = computeGrandArchiveCombatView(program, state);
  snapshots.set(state, view);
  return view;
}

/** GA Damage Step 2–3: preview both directions through the real replacement pipeline.
 * Never resolve a pending choice or mutate the authoritative state while inspecting it.
 */
function computeGrandArchiveCombatView(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
): GrandArchiveCombatView | null {
  let startIndex = state.eventHistory.length - 1;
  while (startIndex >= 0 && state.eventHistory[startIndex]?.type !== "combat-started")
    startIndex -= 1;
  const start = state.eventHistory[startIndex];
  const followingEvents = startIndex < 0 ? [] : state.eventHistory.slice(startIndex);
  const endIndex = followingEvents.findIndex((event) => event.type === "combat-ended");
  const recentEvents = endIndex < 0 ? followingEvents : followingEvents.slice(0, endIndex + 1);
  let previousCombat = start?.type === "combat-started" ? start.combat : null;
  for (const event of recentEvents) {
    if (!previousCombat) break;
    if (event.type === "combat-step-changed")
      previousCombat = {
        ...previousCombat,
        step: event.step,
        ...(event.retaliatorIds ? { retaliatorIds: event.retaliatorIds } : {}),
      };
    if (event.type === "combat-retaliators-ordered")
      previousCombat = {
        ...previousCombat,
        retaliatorIds: event.retaliatorIds,
        retaliationOrderConfirmed: true,
      };
    if (event.type === "combat-defender-redirected")
      previousCombat = {
        ...previousCombat,
        targetIds: previousCombat.targetIds.map((id) =>
          id === event.previousDefenderId ? event.newDefenderId : id,
        ),
      };
  }
  const combat = state.combat ?? previousCombat;
  if (!combat) return null;
  const active = state.combat !== null;
  const retaliationPending =
    active && (combat.step === "declaration" || combat.step === "retaliation");
  const base: Omit<GrandArchiveCombatView, "damage"> = {
    combat,
    active,
    opportunityHolderId: active ? (state.opportunity?.holderId ?? null) : null,
    decision:
      active && state.decision
        ? { playerId: state.decision.playerId, kind: state.decision.kind }
        : null,
    retaliationPending,
    contributions: [],
  };
  if (!active || combat.step === "end") {
    return { ...base, damage: { kind: "dealt", amounts: damageAmounts(recentEvents) } };
  }
  try {
    const contributions = active
      ? [combat.attackerId, ...combat.weaponIds, ...combat.intentIds].flatMap((objectId) => {
          const object = state.objects[objectId];
          if (!object || (object.zone !== "field" && object.zone !== "intent")) return [];
          const amount =
            objectId === combat.attackerId
              ? grandArchiveCombatDamageStat(program, state, object)
              : grandArchiveObjectPower(program, state, object);
          return amount === undefined ? [] : [{ objectId, amount }];
        })
      : [];
    const forecastBase = { ...base, contributions };
    if (state.stack.length || state.resolution || state.pendingTriggers.length) {
      return { ...forecastBase, damage: { kind: "pending", reason: "effects" } };
    }
    if (state.decision && state.decision.kind !== "choose-retaliators") {
      return {
        ...forecastBase,
        damage: {
          kind: "pending",
          reason: state.decision.kind === "order-retaliation-damage" ? "order" : "choice",
        },
      };
    }
    if (combat.retaliatorIds.length > 1 && !combat.retaliationOrderConfirmed) {
      return { ...forecastBase, damage: { kind: "pending", reason: "order" } };
    }
    const previewState: GrandArchiveMatchState = {
      ...structuredClone(state),
      decision: null,
      opportunity: null,
      combat: { ...combat, step: "damage" },
    };
    const kernel = new GrandArchiveTransactionKernel({
      prepareEvent: (current, event) => prepareGrandArchiveRuleBoundEvent(program, current, event),
      collectReplacements: (current, event) =>
        collectGrandArchiveReplacementCandidates(program, current, event),
      chooseReplacement: (candidates) => chooseGrandArchiveReplacement(candidates),
    });
    const preview = kernel.transact(
      previewState,
      proposeGrandArchiveCombatDamage(program, previewState),
    );
    if (
      preview.state.decision ||
      preview.state.replacementPreCommit ||
      preview.state.replacementFollowUps.length
    ) {
      return { ...forecastBase, damage: { kind: "pending", reason: "replacement" } };
    }
    return {
      ...forecastBase,
      damage: { kind: "projected", amounts: damageAmounts(preview.result.events) },
    };
  } catch (error) {
    console.warn("Grand Archive combat forecast unavailable", error);
    return { ...base, damage: { kind: "pending", reason: "unavailable" } };
  }
}

function damageAmounts(events: readonly GrandArchiveCommittedEvent[]) {
  return events.flatMap((event) =>
    event.type === "damage-marked" && event.combatDamage && event.sourceId
      ? [{ sourceId: event.sourceId, recipientId: event.objectId, amount: event.amount }]
      : [],
  );
}
