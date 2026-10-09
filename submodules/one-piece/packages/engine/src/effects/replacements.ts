import {
  currentReplacementProcess,
  replacementProcessKey,
  replacementTargetKey,
} from "./replacement-process.ts";
import type { ReplacementEffect, TargetFilter } from "@tcg/op-types";

import {
  cardName,
  effectsAreNegated,
  getCardForInstance,
  getInstance,
  getPlayer,
  hasFlagModifier,
  otherSeat,
} from "../shared.ts";
import type { MatchSeat, MatchState } from "../types.ts";
import { isRestPreventedByPermanentEffect } from "./permanent.ts";
import { evaluateConditions } from "./conditions.ts";
import { candidatePoolForTarget, matchesTargetFilter } from "./targeting.ts";

export interface KoReplacementCandidate {
  sourceInstanceId: string;
  controller: MatchSeat;
  replacementEffectIndex: number;
  effect: ReplacementEffect;
  effectKey: string;
}

export function replacementEffectKey(effect: ReplacementEffect, replacementEffectIndex: number) {
  return effect.oncePerTurnKey
    ? `replacement:${effect.oncePerTurnKey}`
    : `replacement:${effect.replacedEvent}:${replacementEffectIndex}`;
}

// Mixed descriptions can qualify only Characters by cost or type. For DON!!,
// apply only explicit state restrictions, preserving their Boolean grouping.
function donMatchesStateFilter(filter: TargetFilter, rested: boolean): boolean {
  if (filter.filter === "state") return (filter.value === "rested") === rested;
  if (filter.filter === "allOf")
    return filter.filters.every((child) => donMatchesStateFilter(child, rested));
  if (filter.filter === "anyOf")
    return "groups" in filter
      ? filter.groups.some((group) => group.every((child) => donMatchesStateFilter(child, rested)))
      : filter.filters.some((child) => donMatchesStateFilter(child, rested));
  return true;
}

export function restActionCandidateIds(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  target: Extract<ReplacementEffect["replacementAction"], { action: "rest" }>["target"],
  mode: "selection" | "performable" = "performable",
): string[] {
  const fieldZones = target.zones.filter((zone) => zone !== "costArea");
  const fieldCandidates =
    fieldZones.length === 0
      ? []
      : candidatePoolForTarget(state, controller, sourceInstanceId, {
          ...target,
          zones: fieldZones,
        }).candidateIds.filter(
          (instanceId) =>
            (mode === "selection" ||
              (!getInstance(state, instanceId).rested &&
                !hasFlagModifier(state, instanceId, "cannotBeRested") &&
                !isRestPreventedByPermanentEffect(state, instanceId, sourceInstanceId))) &&
            (target.filters ?? []).every((filter) => {
              const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
              return result.supported && result.matches;
            }),
        );
  const seats =
    target.player === "both" || target.player === "any"
      ? ([controller, otherSeat(controller)] as const)
      : ([target.player === "self" ? controller : otherSeat(controller)] as const);
  const donCandidates = target.zones.includes("costArea")
    ? seats.flatMap((seat) => [
        ...Array.from(
          { length: getPlayer(state, seat).activeDon },
          (_, index) => `active-don:${seat}:${index}`,
        ),
        ...(mode === "selection"
          ? Array.from(
              { length: getPlayer(state, seat).restedDon },
              (_, index) => `rested-don:${seat}:${index}`,
            )
          : []),
      ])
    : [];
  return [
    ...fieldCandidates,
    ...donCandidates.filter((id) =>
      (target.filters ?? []).every((filter) =>
        donMatchesStateFilter(filter, id.startsWith("rested-don:")),
      ),
    ),
  ];
}

/** OP11-001 FAQ: a removed member cannot fund another member's replacement. */
export function unavailableRemovalPayments(state: MatchState): string[] {
  return (["south", "north"] as const).flatMap((seat) => {
    const player = getPlayer(state, seat);
    return [player.leaderInstanceId, ...player.characterArea, player.stageArea]
      .filter((id): id is string => Boolean(id))
      .flatMap((id) =>
        (getCardForInstance(state, id).effects?.replacementEffects ?? []).flatMap((effect, index) =>
          effect.replacedEvent !== "rested" &&
          !replacementActionIsAvailable(state, seat, id, effect.replacementAction)
            ? [replacementProcessKey(state, id, replacementEffectKey(effect, index))]
            : [],
        ),
      );
  });
}

function replacementActionIsAvailable(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  action: ReplacementEffect["replacementAction"],
): boolean {
  const otherController = controller === "north" ? "south" : "north";
  switch (action.action) {
    case "sequence":
      return action.actions.every((nestedAction) =>
        replacementActionIsAvailable(state, controller, sourceInstanceId, nestedAction),
      );
    case "rest": {
      const hasFieldZone = action.target.zones.some((zone) => zone !== "costArea");
      if (action.target.zones.includes("costArea") && !hasFieldZone) {
        const seat = action.target.player === "self" ? controller : otherController;
        const required =
          action.target.count.amount === "all"
            ? getPlayer(state, seat).activeDon
            : action.target.count.amount;
        return action.target.count.upTo || getPlayer(state, seat).activeDon >= required;
      }
      const candidateIds = restActionCandidateIds(
        state,
        controller,
        sourceInstanceId,
        action.target,
      );
      const required =
        action.target.count.amount === "all" ? candidateIds.length : action.target.count.amount;
      return action.target.count.upTo || candidateIds.length >= required;
    }
    case "trashFromHand": {
      const seat = action.player === "self" ? controller : otherController;
      const eligible = getPlayer(state, seat).hand.filter((instanceId) =>
        (action.filters ?? []).every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
          return result.supported && result.matches;
        }),
      );
      return action.amount === "all" || action.upTo || eligible.length >= action.amount;
    }
    case "turnLifeFaceUp": {
      const seat = action.player === "self" ? controller : otherController;
      const life = getPlayer(state, seat).life;
      const selected =
        action.position === "top"
          ? life.slice(0, action.count)
          : life.slice(Math.max(0, life.length - action.count));
      return (
        selected.length === action.count &&
        selected.every((instanceId) => !getInstance(state, instanceId).faceUp)
      );
    }
    case "removeFromLife": {
      const seat = action.player === "self" ? controller : otherController;
      const lifeCount = getPlayer(state, seat).life.length;
      if ("untilRemaining" in action.count) {
        return lifeCount >= action.count.untilRemaining;
      }
      return action.count.amount === "all" || action.count.upTo || lifeCount >= action.count.amount;
    }
    case "returnDon": {
      const seat = action.player === "self" ? controller : otherController;
      const player = getPlayer(state, seat);
      const attachedDon = [
        player.leaderInstanceId,
        ...player.characterArea.filter((instanceId): instanceId is string => Boolean(instanceId)),
      ].reduce((total, instanceId) => total + getInstance(state, instanceId).attachedDon, 0);
      return player.activeDon + player.restedDon + attachedDon >= action.amount;
    }
    case "returnToDeck":
    case "modifyPower": {
      const pool = candidatePoolForTarget(state, controller, sourceInstanceId, action.target);
      const required =
        action.target.count.amount === "all"
          ? pool.candidateIds.length
          : action.target.count.amount;
      return pool.supported && (action.target.count.upTo || pool.candidateIds.length >= required);
    }
    default:
      return true;
  }
}

export function findRemovalReplacements(
  state: MatchState,
  targetId: string,
  effectController: MatchSeat,
  koCause: "battle" | "effect",
  replacedEvents: ReadonlySet<ReplacementEffect["replacedEvent"]>,
  effectSourceInstanceId?: string,
): KoReplacementCandidate[] {
  const candidates: KoReplacementCandidate[] = [];
  const target = getInstance(state, targetId);
  const targetController = target.controller;
  const sourceIds = [
    ...new Set([
      targetId,
      ...([state.activeSeat, otherSeat(state.activeSeat)] as const).flatMap((seat) => {
        const player = getPlayer(state, seat);
        return [
          player.leaderInstanceId,
          ...player.characterArea.filter((id): id is string => Boolean(id)),
          ...(player.stageArea ? [player.stageArea] : []),
        ];
      }),
    ]),
  ];

  for (const sourceInstanceId of sourceIds) {
    if (effectsAreNegated(state, sourceInstanceId)) {
      continue;
    }
    const source = getInstance(state, sourceInstanceId);
    const effects = getCardForInstance(state, sourceInstanceId).effects?.replacementEffects ?? [];
    for (const [replacementEffectIndex, effect] of effects.entries()) {
      const effectKey = replacementEffectKey(effect, replacementEffectIndex);
      if (
        currentReplacementProcess(state)?.unavailableRemovalPayments?.includes(
          replacementProcessKey(state, sourceInstanceId, effectKey),
        )
      )
        continue;
      if (
        currentReplacementProcess(state)?.declined?.[
          replacementTargetKey(state, targetId)
        ]?.includes(replacementProcessKey(state, sourceInstanceId, effectKey))
      )
        continue;
      if (
        currentReplacementProcess(state)?.applied.includes(
          replacementProcessKey(state, sourceInstanceId, effectKey),
        )
      )
        continue;
      if (
        !replacedEvents.has(effect.replacedEvent) ||
        (effect.oncePerTurn && source.usedEffectKeys.includes(effectKey))
      ) {
        continue;
      }
      const conditions = evaluateConditions(
        state,
        source.controller,
        sourceInstanceId,
        effect.conditions,
      );
      if (!conditions.supported || !conditions.matches) {
        continue;
      }
      const playerMatches =
        !effect.eventFilter?.player ||
        effect.eventFilter.player === "any" ||
        (effect.eventFilter.player === "self" && targetController === source.controller) ||
        (effect.eventFilter.player === "opponent" && targetController !== source.controller);
      const causeMatches =
        !effect.eventFilter?.causedBy ||
        effect.eventFilter.causedBy === "any" ||
        (effect.eventFilter.causedBy === "self" && effectController === source.controller) ||
        (effect.eventFilter.causedBy === "opponent" && effectController !== source.controller);
      const koCauseMatches = !effect.eventFilter?.koCause || effect.eventFilter.koCause === koCause;
      const targetMatches = !effect.eventFilter?.targetSelf || targetId === sourceInstanceId;
      const structuredTargetMatches =
        !effect.target ||
        (() => {
          const pool = candidatePoolForTarget(
            state,
            source.controller,
            sourceInstanceId,
            effect.target,
          );
          return pool.supported && pool.candidateIds.includes(targetId);
        })();
      const structuredSourceMatches =
        !effect.source ||
        (effect.source === "battle" && koCause === "battle") ||
        (effect.source === "effect" && koCause === "effect") ||
        (effect.source === "opponentEffect" &&
          koCause === "effect" &&
          effectController !== source.controller) ||
        (effect.source === "opponentCharacterEffect" &&
          koCause === "effect" &&
          effectController !== source.controller &&
          Boolean(
            effectSourceInstanceId &&
            getCardForInstance(state, effectSourceInstanceId).cardType === "character",
          ));
      const filtersMatch = (effect.eventFilter?.filters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, sourceInstanceId, targetId, filter);
        return result.supported && result.matches;
      });
      if (
        !playerMatches ||
        !causeMatches ||
        !koCauseMatches ||
        !targetMatches ||
        !structuredTargetMatches ||
        !structuredSourceMatches ||
        !filtersMatch
      ) {
        continue;
      }
      if (
        !replacementActionIsAvailable(
          state,
          source.controller,
          sourceInstanceId,
          effect.replacementAction,
        )
      ) {
        continue;
      }
      candidates.push({
        sourceInstanceId,
        controller: source.controller,
        replacementEffectIndex,
        effect,
        effectKey,
      });
    }
  }
  // Retain the existing compulsory affected-card precedence interpretation.
  // Official 8-1-3-4-2 does not settle that interpretation explicitly.
  // Other sources use turn-player then non-turn-player controller groups.
  const prioritized = candidates.some(
    (candidate) => candidate.sourceInstanceId === targetId && candidate.effect.mandatory,
  )
    ? candidates.filter((candidate) => candidate.sourceInstanceId === targetId)
    : candidates.some((candidate) => candidate.controller === state.activeSeat)
      ? candidates.filter((candidate) => candidate.controller === state.activeSeat)
      : candidates;
  // One printed replacement may have separate event records. A shared
  // once-per-turn key explicitly identifies those records (Koby); otherwise
  // collapse only equivalent mandatory actions without a usage limit (Thatch).
  return prioritized.filter(
    (candidate, index) =>
      !prioritized.slice(0, index).some((earlier) => {
        const sameLimitedEffect =
          Boolean(candidate.effect.oncePerTurnKey) &&
          earlier.effect.oncePerTurnKey === candidate.effect.oncePerTurnKey &&
          earlier.effect.oncePerTurn === candidate.effect.oncePerTurn;
        const sameUnlimitedMandatoryEffect =
          candidate.effect.mandatory &&
          earlier.effect.mandatory &&
          !candidate.effect.oncePerTurn &&
          !earlier.effect.oncePerTurn;
        return (
          earlier.sourceInstanceId === candidate.sourceInstanceId &&
          Boolean(earlier.effect.mandatory) === Boolean(candidate.effect.mandatory) &&
          (sameLimitedEffect || sameUnlimitedMandatoryEffect) &&
          JSON.stringify(earlier.effect.replacementAction) ===
            JSON.stringify(candidate.effect.replacementAction)
        );
      }),
  );
}

export function findKoReplacement(
  state: MatchState,
  targetId: string,
  effectController: MatchSeat,
  koCause: "battle" | "effect",
  effectSourceInstanceId?: string,
): KoReplacementCandidate | null {
  return (
    findRemovalReplacements(
      state,
      targetId,
      effectController,
      koCause,
      new Set(["ko", "removeFromField", "leaveField"]),
      effectSourceInstanceId,
    )[0] ?? null
  );
}

export function findRemoveFromFieldReplacement(
  state: MatchState,
  targetId: string,
  effectController: MatchSeat,
  effectSourceInstanceId: string,
): KoReplacementCandidate | null {
  return (
    findRemovalReplacements(
      state,
      targetId,
      effectController,
      "effect",
      new Set(["removeFromField", "leaveField"]),
      effectSourceInstanceId,
    )[0] ?? null
  );
}

export function findRestReplacement(
  state: MatchState,
  targetId: string,
  effectController: MatchSeat,
  effectSourceInstanceId: string,
): KoReplacementCandidate | null {
  return (
    findRemovalReplacements(
      state,
      targetId,
      effectController,
      "effect",
      new Set(["rested"]),
      effectSourceInstanceId,
    )[0] ?? null
  );
}

export function findKoReplacements(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  cause: "battle" | "effect",
  sourceId?: string,
): KoReplacementCandidate[] {
  return findRemovalReplacements(
    state,
    targetId,
    controller,
    cause,
    new Set(["ko", "removeFromField", "leaveField"]),
    sourceId,
  );
}

export function replacementOptionId(candidate: KoReplacementCandidate): string {
  return `replacement:${candidate.sourceInstanceId}:${candidate.replacementEffectIndex}`;
}

export function findRemoveFromFieldReplacements(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceId: string,
): KoReplacementCandidate[] {
  return findRemovalReplacements(
    state,
    targetId,
    controller,
    "effect",
    new Set(["removeFromField", "leaveField"]),
    sourceId,
  );
}

export function replacementChoiceLabel(state: MatchState, sourceId: string): string {
  const source = getInstance(state, sourceId);
  const slot = getPlayer(state, source.controller).characterArea.indexOf(sourceId);
  const location =
    slot >= 0 ? `Character ${slot + 1}` : source.zone === "leader" ? "Leader" : "Stage";
  return `${cardName(getCardForInstance(state, sourceId))} (${location})`;
}

export function findRestReplacements(
  state: MatchState,
  targetId: string,
  controller: MatchSeat,
  sourceId: string,
): KoReplacementCandidate[] {
  return findRemovalReplacements(
    state,
    targetId,
    controller,
    "effect",
    new Set(["rested"]),
    sourceId,
  );
}
