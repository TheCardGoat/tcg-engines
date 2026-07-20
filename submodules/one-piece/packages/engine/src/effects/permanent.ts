import { getCard } from "../../../cards/src/runtime-catalog.ts";
import type { Action, EffectTrigger, Keyword } from "@tcg/op-types";
import type { CardInstance, MatchState } from "../types.ts";
import { evaluateConditions } from "./conditions.ts";
import { candidatePoolForTarget, matchesTargetFilter } from "./targeting.ts";

const activeEvaluations = new WeakMap<MatchState, Set<string>>();

function actionIsDynamicModifier(
  action: Action,
  type: "power" | "cost" | "counter",
): action is Extract<Action, { action: "modifyPower" | "modifyCost" | "modifyCounter" }> {
  return (
    (type === "power" && action.action === "modifyPower") ||
    (type === "cost" && action.action === "modifyCost") ||
    (type === "counter" && action.action === "modifyCounter")
  );
}

function sourceIsInPlay(state: MatchState, sourceInstanceId: string): boolean {
  const source = state.cards[sourceInstanceId];
  if (!source) {
    return false;
  }
  const player = state.players[source.controller];
  switch (source.zone) {
    case "leader":
      return player.leaderInstanceId === sourceInstanceId;
    case "character":
      return player.characterArea.includes(sourceInstanceId);
    case "stage":
      return player.stageArea === sourceInstanceId;
    default:
      return false;
  }
}

function inPlaySources(state: MatchState): CardInstance[] {
  const sourceIds = Object.values(state.players).flatMap((player) => [
    player.leaderInstanceId,
    ...player.characterArea,
    player.stageArea,
  ]);
  return sourceIds.flatMap((sourceId) => {
    const source = sourceId ? state.cards[sourceId] : undefined;
    return source ? [source] : [];
  });
}

function sourceEffectsAreNegatedByModifier(state: MatchState, sourceInstanceId: string): boolean {
  return Object.values(state.modifiers).some(
    (modifier) =>
      modifier.targetId === sourceInstanceId &&
      modifier.type === "flag" &&
      modifier.flag === "effectsNegated" &&
      !modifier.negatedEffectTypes?.length,
  );
}

function sourceEffectsAreNegated(state: MatchState, sourceInstanceId: string): boolean {
  return (
    sourceEffectsAreNegatedByModifier(state, sourceInstanceId) ||
    effectsNegatedByPermanentEffect(state, sourceInstanceId, undefined)
  );
}

export function isPlayedRestedByPermanentEffect(
  state: MatchState,
  targetController: CardInstance["controller"],
  targetInstanceId: string,
): boolean {
  for (const source of Object.values(state.cards)) {
    if (
      !sourceIsInPlay(state, source.instanceId) ||
      sourceEffectsAreNegated(state, source.instanceId)
    ) {
      continue;
    }
    const card = getCard(source.cardId);
    for (const effect of card.effects?.permanentEffects ?? []) {
      const conditions = evaluateConditions(
        state,
        source.controller,
        source.instanceId,
        effect.conditions,
      );
      if (!conditions.supported || !conditions.matches) continue;
      for (const action of effect.actions) {
        if (action.action !== "playRested") continue;
        const affectedController =
          action.player === "self"
            ? source.controller
            : source.controller === "north"
              ? "south"
              : "north";
        if (affectedController !== targetController) continue;
        const matches = action.filters.every((filter) => {
          const result = matchesTargetFilter(state, source.instanceId, targetInstanceId, filter);
          return result.supported && result.matches;
        });
        if (matches) return true;
      }
    }
  }
  return false;
}

export function donGivenFromDonPhase(
  state: MatchState,
  controller: CardInstance["controller"],
): number {
  let total = 0;
  for (const source of Object.values(state.cards)) {
    if (
      source.controller !== controller ||
      !sourceIsInPlay(state, source.instanceId) ||
      sourceEffectsAreNegated(state, source.instanceId)
    ) {
      continue;
    }
    const card = getCard(source.cardId);
    for (const effect of card.effects?.permanentEffects ?? []) {
      const conditions = evaluateConditions(
        state,
        source.controller,
        source.instanceId,
        effect.conditions,
      );
      if (!conditions.supported || !conditions.matches) continue;
      for (const action of effect.actions) {
        if (action.action === "giveDonFromDonPhase") {
          total += action.count;
        }
      }
    }
  }
  return total;
}

export function isCardPlayRestricted(
  state: MatchState,
  controller: CardInstance["controller"],
  candidateId: string,
  sourceZone: CardInstance["zone"],
  origin: "command" | "effect" = "command",
): boolean {
  if (origin === "effect") {
    const candidate = state.cards[candidateId];
    const card = getCard(candidate.cardId);
    for (const effect of card.effects?.permanentEffects ?? []) {
      const conditions = evaluateConditions(
        state,
        candidate.controller,
        candidateId,
        effect.conditions,
      );
      if (
        conditions.supported &&
        conditions.matches &&
        effect.actions.some((action) => action.action === "cannotBePlayedByEffects")
      ) {
        return true;
      }
    }
  }
  const leaderId = state.players[controller].leaderInstanceId;
  return Object.values(state.modifiers).some(
    (modifier) =>
      modifier.targetId === leaderId &&
      modifier.type === "flag" &&
      modifier.flag === "cannotPlay" &&
      modifier.playerScope === true &&
      (!modifier.playRestrictionSourceZones ||
        modifier.playRestrictionSourceZones.includes(sourceZone)) &&
      (modifier.playRestrictionFilters ?? []).every((filter) => {
        const result = matchesTargetFilter(state, modifier.sourceInstanceId, candidateId, filter);
        return result.supported && result.matches;
      }),
  );
}

export function isKoPreventedByModifier(
  state: MatchState,
  targetId: string,
  sourceInstanceId: string,
  cause: "battle" | "effect",
): boolean {
  const targetController = state.cards[targetId]?.controller;
  const sourceController = state.cards[sourceInstanceId]?.controller;
  if (!targetController || !sourceController) return false;

  const restrictionMatches = (
    restriction: "inBattle" | "byEffect" | undefined,
    byPlayer: "self" | "opponent" | undefined,
    byFilters: import("@tcg/op-types").TargetFilter[] | undefined,
    filterSourceInstanceId: string | null,
  ) => {
    if (
      (cause === "battle" && restriction === "byEffect") ||
      (cause === "effect" && restriction === "inBattle")
    ) {
      return false;
    }
    if (byPlayer) {
      const expectedController =
        byPlayer === "self" ? targetController : targetController === "south" ? "north" : "south";
      if (sourceController !== expectedController) return false;
    }
    return (byFilters ?? []).every((filter) => {
      const result = matchesTargetFilter(state, filterSourceInstanceId, sourceInstanceId, filter);
      return result.supported && result.matches;
    });
  };

  for (const permanentSource of Object.values(state.cards)) {
    if (
      !sourceIsInPlay(state, permanentSource.instanceId) ||
      sourceEffectsAreNegated(state, permanentSource.instanceId)
    ) {
      continue;
    }
    const card = getCard(permanentSource.cardId);
    for (const effect of card.effects?.permanentEffects ?? []) {
      const conditions = evaluateConditions(
        state,
        permanentSource.controller,
        permanentSource.instanceId,
        effect.conditions,
      );
      if (!conditions.supported || !conditions.matches) continue;
      for (const action of effect.actions) {
        if (action.action !== "cannotBeKod") continue;
        const pool = candidatePoolForTarget(
          state,
          permanentSource.controller,
          permanentSource.instanceId,
          action.target,
        );
        if (
          pool.supported &&
          pool.candidateIds.includes(targetId) &&
          restrictionMatches(
            action.restriction,
            action.byPlayer,
            action.byFilter,
            permanentSource.instanceId,
          )
        ) {
          return true;
        }
      }
    }
  }

  return Object.values(state.modifiers).some((modifier) => {
    if (
      modifier.targetId !== targetId ||
      modifier.type !== "flag" ||
      modifier.flag !== "cannotBeKO"
    ) {
      return false;
    }
    return restrictionMatches(
      modifier.koRestriction,
      modifier.koByPlayer,
      modifier.koByFilters,
      modifier.sourceInstanceId,
    );
  });
}

export function isRestPreventedByPermanentEffect(
  state: MatchState,
  targetId: string,
  sourceInstanceId: string,
): boolean {
  const targetController = state.cards[targetId]?.controller;
  const sourceController = state.cards[sourceInstanceId]?.controller;
  if (!targetController || !sourceController) return false;

  const evaluationKey = `cannotBeRested:${targetId}:${sourceInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) return false;
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    for (const permanentSource of Object.values(state.cards)) {
      if (
        !sourceIsInPlay(state, permanentSource.instanceId) ||
        sourceEffectsAreNegated(state, permanentSource.instanceId)
      ) {
        continue;
      }
      const card = getCard(permanentSource.cardId);
      for (const effect of card.effects?.permanentEffects ?? []) {
        const conditions = evaluateConditions(
          state,
          permanentSource.controller,
          permanentSource.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) continue;
        for (const action of effect.actions) {
          if (action.action !== "cannotBeRested") continue;
          const expectedSourceController =
            action.byPlayer === "self"
              ? targetController
              : action.byPlayer === "opponent"
                ? targetController === "south"
                  ? "north"
                  : "south"
                : null;
          if (expectedSourceController && sourceController !== expectedSourceController) continue;
          const pool = candidatePoolForTarget(
            state,
            permanentSource.controller,
            permanentSource.instanceId,
            action.target,
          );
          if (pool.supported && pool.candidateIds.includes(targetId)) return true;
        }
      }
    }
    return false;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) activeEvaluations.delete(state);
  }
}

function effectsNegatedByPermanentEffect(
  state: MatchState,
  targetInstanceId: string,
  trigger: EffectTrigger | undefined,
): boolean {
  const targetController = state.cards[targetInstanceId]?.controller;
  if (!targetController) return false;
  const evaluationKey = `effectsNegated:${targetInstanceId}:${trigger ?? "all"}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) return false;
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    for (const source of inPlaySources(state)) {
      if (sourceEffectsAreNegatedByModifier(state, source.instanceId)) {
        continue;
      }
      const card = getCard(source.cardId);
      const negatingEffects = (card.effects?.permanentEffects ?? []).filter((effect) =>
        effect.actions.some(
          (action) => action.action === "negatePlayerEffects" || action.action === "negateEffects",
        ),
      );
      if (negatingEffects.length === 0) continue;
      if (effectsNegatedByPermanentEffect(state, source.instanceId, undefined)) continue;
      for (const effect of negatingEffects) {
        const conditions = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) continue;
        for (const action of effect.actions) {
          if (action.action === "negatePlayerEffects") {
            const affectedController =
              action.player === "self"
                ? source.controller
                : source.controller === "north"
                  ? "south"
                  : "north";
            if (affectedController !== targetController) continue;
            if (!action.effectTypes?.length || (trigger && action.effectTypes.includes(trigger))) {
              return true;
            }
          }
          if (action.action === "negateEffects") {
            const pool = candidatePoolForTarget(
              state,
              source.controller,
              source.instanceId,
              action.target,
            );
            if (!pool.supported || !pool.candidateIds.includes(targetInstanceId)) continue;
            if (!action.effectTypes?.length || (trigger && action.effectTypes.includes(trigger))) {
              return true;
            }
          }
        }
      }
    }
    return false;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) activeEvaluations.delete(state);
  }
}

export function arePlayerEffectsNegatedByPermanentEffect(
  state: MatchState,
  targetInstanceId: string,
  trigger: EffectTrigger | undefined,
): boolean {
  return effectsNegatedByPermanentEffect(state, targetInstanceId, trigger);
}

export function isCharacterRemovalPreventedByPermanentEffect(
  state: MatchState,
  targetInstanceId: string,
  effectController: CardInstance["controller"],
): boolean {
  const target = state.cards[targetInstanceId];
  if (!target || target.zone !== "character") return false;

  for (const source of Object.values(state.cards)) {
    if (
      !sourceIsInPlay(state, source.instanceId) ||
      sourceEffectsAreNegated(state, source.instanceId)
    ) {
      continue;
    }
    const card = getCard(source.cardId);
    for (const effect of card.effects?.permanentEffects ?? []) {
      const conditions = evaluateConditions(
        state,
        source.controller,
        source.instanceId,
        effect.conditions,
      );
      if (!conditions.supported || !conditions.matches) continue;
      for (const action of effect.actions) {
        if (action.action !== "cannotBeRemoved") continue;
        const sourceMatches =
          (action.bySource === "ownEffect" && source.controller === effectController) ||
          (action.bySource === "opponentEffect" && source.controller !== effectController);
        if (!sourceMatches) continue;
        const pool = candidatePoolForTarget(
          state,
          source.controller,
          source.instanceId,
          action.target,
        );
        if (pool.supported && pool.candidateIds.includes(targetInstanceId)) return true;
      }
    }
  }
  return false;
}

export function getPermanentModifierTotal(
  state: MatchState,
  targetInstanceId: string,
  type: "power" | "cost" | "counter",
): number {
  const evaluationKey = `${type}:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return 0;
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    let total = 0;
    for (const source of Object.values(state.cards)) {
      const sourceIsSelfInHand = source.instanceId === targetInstanceId && source.zone === "hand";
      if (
        (!sourceIsInPlay(state, source.instanceId) && !sourceIsSelfInHand) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }

      const card = getCard(source.cardId);
      for (const effect of card.effects?.permanentEffects ?? []) {
        const relevantActions = effect.actions.filter(
          (action) =>
            (type === "power" && action.action === "setBasePowerFrom") ||
            actionIsDynamicModifier(action, type),
        );
        if (relevantActions.length === 0) {
          continue;
        }
        const conditions = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) {
          continue;
        }

        for (const action of relevantActions) {
          if (type === "power" && action.action === "setBasePowerFrom") {
            const targetPool = candidatePoolForTarget(
              state,
              source.controller,
              source.instanceId,
              action.target,
            );
            if (!targetPool.supported || !targetPool.candidateIds.includes(targetInstanceId)) {
              continue;
            }
            const sourcePool = candidatePoolForTarget(
              state,
              source.controller,
              source.instanceId,
              action.source,
            );
            if (!sourcePool.supported || sourcePool.candidateIds.length !== 1) {
              continue;
            }
            const targetCard = getCard(state.cards[targetInstanceId]!.cardId);
            const sourceCard = getCard(state.cards[sourcePool.candidateIds[0]!]!.cardId);
            const targetBasePower =
              targetCard.cardType === "leader" || targetCard.cardType === "character"
                ? (targetCard.power ?? 0)
                : 0;
            const sourceBasePower =
              sourceCard.cardType === "leader" || sourceCard.cardType === "character"
                ? (sourceCard.power ?? 0)
                : 0;
            total += sourceBasePower - targetBasePower;
            continue;
          }
          if (!actionIsDynamicModifier(action, type)) {
            continue;
          }
          if (action.condition) {
            const actionCondition = evaluateConditions(
              state,
              source.controller,
              source.instanceId,
              [action.condition],
            );
            if (!actionCondition.supported || !actionCondition.matches) {
              continue;
            }
          }
          if (action.target.count.amount !== "all" && !action.target.self) {
            continue;
          }

          const pool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (pool.supported && pool.candidateIds.includes(targetInstanceId)) {
            const restedDonGroupSize =
              action.action === "modifyPower" ? action.restedDonGroupSize : undefined;
            const valuePerCardGroup =
              action.action === "modifyPower" ? action.valuePerCardGroup : undefined;
            const cardGroupPool = valuePerCardGroup
              ? candidatePoolForTarget(
                  state,
                  source.controller,
                  source.instanceId,
                  valuePerCardGroup.target,
                )
              : undefined;
            total += restedDonGroupSize
              ? Math.floor(state.players[source.controller].restedDon / restedDonGroupSize) *
                action.value
              : valuePerCardGroup && cardGroupPool?.supported
                ? Math.floor(cardGroupPool.candidateIds.length / valuePerCardGroup.size) *
                  action.value
                : action.value;
          }
        }
      }
    }
    return total;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}

export function getPermanentSetCost(state: MatchState, targetInstanceId: string): number | null {
  const evaluationKey = `setCost:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return null;
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    for (const source of Object.values(state.cards)) {
      const sourceIsSelfInHand = source.instanceId === targetInstanceId && source.zone === "hand";
      if (
        (!sourceIsInPlay(state, source.instanceId) && !sourceIsSelfInHand) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }
      const card = getCard(source.cardId);
      for (const effect of card.effects?.permanentEffects ?? []) {
        const conditions = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) {
          continue;
        }
        for (const action of effect.actions) {
          if (action.action !== "setCost") {
            continue;
          }
          const pool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (pool.supported && pool.candidateIds.includes(targetInstanceId)) {
            return action.value;
          }
        }
      }
    }
    return null;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}

export function getPermanentKeywords(state: MatchState, targetInstanceId: string): Set<Keyword> {
  const evaluationKey = `keyword:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return new Set();
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    const keywords = new Set<Keyword>();
    for (const source of Object.values(state.cards)) {
      if (
        !sourceIsInPlay(state, source.instanceId) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }
      const card = getCard(source.cardId);
      for (const effect of card.effects?.permanentEffects ?? []) {
        const conditions = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) {
          continue;
        }
        for (const action of effect.actions) {
          if (action.action !== "grantKeyword") {
            continue;
          }
          if (action.condition) {
            const actionCondition = evaluateConditions(
              state,
              source.controller,
              source.instanceId,
              [action.condition],
            );
            if (!actionCondition.supported || !actionCondition.matches) {
              continue;
            }
          }
          if (action.target.count.amount !== "all" && !action.target.self) {
            continue;
          }
          const pool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (pool.supported && pool.candidateIds.includes(targetInstanceId)) {
            keywords.add(action.keyword);
          }
        }
      }
    }
    return keywords;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}

export function isAttackPreventedByPermanentEffect(
  state: MatchState,
  targetInstanceId: string,
): boolean {
  const evaluationKey = `cannotAttack:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return false;
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    for (const source of Object.values(state.cards)) {
      if (
        !sourceIsInPlay(state, source.instanceId) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }
      const card = getCard(source.cardId);
      for (const effect of card.effects?.permanentEffects ?? []) {
        const conditions = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) {
          continue;
        }
        for (const action of effect.actions) {
          if (action.action !== "cannotAttack") {
            continue;
          }
          if (action.condition) {
            const actionCondition = evaluateConditions(
              state,
              source.controller,
              source.instanceId,
              [action.condition],
            );
            if (!actionCondition.supported || !actionCondition.matches) {
              continue;
            }
          }
          if (action.target.count.amount !== "all" && !action.target.self) {
            continue;
          }
          const pool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (pool.supported && pool.candidateIds.includes(targetInstanceId)) {
            return true;
          }
        }
      }
    }
    return false;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}

export function canAttackActiveByPermanentEffect(
  state: MatchState,
  targetInstanceId: string,
): boolean {
  const evaluationKey = `canAttackActive:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return false;
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    for (const source of Object.values(state.cards)) {
      if (
        !sourceIsInPlay(state, source.instanceId) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }
      const card = getCard(source.cardId);
      for (const effect of card.effects?.permanentEffects ?? []) {
        const conditions = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) {
          continue;
        }
        for (const action of effect.actions) {
          if (action.action !== "canAttackActive") {
            continue;
          }
          if (action.condition) {
            const actionCondition = evaluateConditions(
              state,
              source.controller,
              source.instanceId,
              [action.condition],
            );
            if (!actionCondition.supported || !actionCondition.matches) {
              continue;
            }
          }
          const pool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (pool.supported && pool.candidateIds.includes(targetInstanceId)) {
            return true;
          }
        }
      }
    }
    return false;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}

export function isAttackTargetAllowedByPermanentEffects(
  state: MatchState,
  attackerInstanceId: string,
  targetInstanceId: string,
): boolean {
  const evaluationKey = `attackRestriction:${attackerInstanceId}:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return true;
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    const attacker = state.cards[attackerInstanceId];
    if (!attacker) {
      return false;
    }
    for (const source of Object.values(state.cards)) {
      if (
        source.controller === attacker.controller ||
        !sourceIsInPlay(state, source.instanceId) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }
      const card = getCard(source.cardId);
      for (const effect of card.effects?.permanentEffects ?? []) {
        const conditions = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) {
          continue;
        }
        for (const action of effect.actions) {
          if (action.action !== "attackRestriction") {
            continue;
          }
          if (action.condition) {
            const actionCondition = evaluateConditions(
              state,
              source.controller,
              source.instanceId,
              [action.condition],
            );
            if (!actionCondition.supported || !actionCondition.matches) {
              continue;
            }
          }
          const pool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (!pool.supported) {
            continue;
          }
          const matches = pool.candidateIds.includes(targetInstanceId);
          if (action.restriction === "cannotAttack" ? matches : !matches) {
            return false;
          }
        }
      }
    }
    return true;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}

export function isRefreshPreventedByPermanentEffect(
  state: MatchState,
  targetInstanceId: string,
): boolean {
  const evaluationKey = `refresh:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return false;
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    for (const source of Object.values(state.cards)) {
      if (
        !sourceIsInPlay(state, source.instanceId) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }
      const card = getCard(source.cardId);
      for (const effect of card.effects?.permanentEffects ?? []) {
        const conditions = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!conditions.supported || !conditions.matches) {
          continue;
        }
        for (const action of effect.actions) {
          if (action.action !== "freeze") {
            continue;
          }
          const pool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (pool.supported && pool.candidateIds.includes(targetInstanceId)) {
            return true;
          }
        }
      }
    }
    return false;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}
