import type { ReplacementEffect } from "@tcg/op-types";

import {
  effectsAreNegated,
  getCardForInstance,
  getInstance,
  getPlayer,
  hasFlagModifier,
  otherSeat,
} from "../shared.ts";
import type { MatchSeat, MatchState } from "../types.ts";
import { evaluateConditions } from "./conditions.ts";
import { candidatePoolForTarget, matchesTargetFilter } from "./targeting.ts";

export interface KoReplacementCandidate {
  sourceInstanceId: string;
  controller: MatchSeat;
  replacementEffectIndex: number;
  effect: ReplacementEffect;
}

export function restActionCandidateIds(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  target: Extract<ReplacementEffect["replacementAction"], { action: "rest" }>["target"],
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
            !getInstance(state, instanceId).rested &&
            !hasFlagModifier(state, instanceId, "cannotBeRested") &&
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
    ? seats.flatMap((seat) =>
        Array.from(
          { length: getPlayer(state, seat).activeDon },
          (_, index) => `active-don:${seat}:${index}`,
        ),
      )
    : [];
  return [...fieldCandidates, ...donCandidates];
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

function findRemovalReplacement(
  state: MatchState,
  targetId: string,
  effectController: MatchSeat,
  koCause: "battle" | "effect",
  replacedEvents: ReadonlySet<ReplacementEffect["replacedEvent"]>,
  effectSourceInstanceId?: string,
): KoReplacementCandidate | null {
  const target = getInstance(state, targetId);
  const targetController = target.controller;
  const player = getPlayer(state, targetController);
  const sourceIds = [
    targetId,
    player.leaderInstanceId,
    ...player.characterArea.filter(
      (instanceId): instanceId is string => Boolean(instanceId) && instanceId !== targetId,
    ),
    ...(player.stageArea ? [player.stageArea] : []),
  ];

  for (const sourceInstanceId of sourceIds) {
    if (effectsAreNegated(state, sourceInstanceId)) {
      continue;
    }
    const source = getInstance(state, sourceInstanceId);
    const effects = getCardForInstance(state, sourceInstanceId).effects?.replacementEffects ?? [];
    for (const [replacementEffectIndex, effect] of effects.entries()) {
      const effectKey = `replacement:${effect.replacedEvent}:${replacementEffectIndex}`;
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
      return {
        sourceInstanceId,
        controller: source.controller,
        replacementEffectIndex,
        effect,
      };
    }
  }
  return null;
}

export function findKoReplacement(
  state: MatchState,
  targetId: string,
  effectController: MatchSeat,
  koCause: "battle" | "effect",
  effectSourceInstanceId?: string,
): KoReplacementCandidate | null {
  return findRemovalReplacement(
    state,
    targetId,
    effectController,
    koCause,
    new Set(koCause === "effect" ? ["ko", "removeFromField", "leaveField"] : ["ko", "leaveField"]),
    effectSourceInstanceId,
  );
}

export function findRemoveFromFieldReplacement(
  state: MatchState,
  targetId: string,
  effectController: MatchSeat,
  effectSourceInstanceId: string,
): KoReplacementCandidate | null {
  return findRemovalReplacement(
    state,
    targetId,
    effectController,
    "effect",
    new Set(["removeFromField", "leaveField"]),
    effectSourceInstanceId,
  );
}

export function findRestReplacement(
  state: MatchState,
  targetId: string,
  effectController: MatchSeat,
  effectSourceInstanceId: string,
): KoReplacementCandidate | null {
  return findRemovalReplacement(
    state,
    targetId,
    effectController,
    "effect",
    new Set(["rested"]),
    effectSourceInstanceId,
  );
}
