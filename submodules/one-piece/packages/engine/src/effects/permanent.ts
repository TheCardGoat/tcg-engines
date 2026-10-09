import {
  basePowerActionKey,
  deterministicPowerTarget,
} from "../engine/continuous-numeric-dependencies.ts";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import type { Action, Condition, EffectTrigger, Keyword } from "@tcg/op-types";
import type { CardInstance, MatchState } from "../types.ts";
import { getSetBasePower } from "../shared.ts";
import { evaluateConditions } from "./conditions.ts";
import { candidatePoolForTarget, matchesTargetFilter } from "./targeting.ts";

const excludedPowerSetters = new WeakMap<MatchState, ReadonlySet<string>>();
export function evaluatingLegacyBasePower(state: MatchState): boolean {
  return excludedPowerSetters.has(state);
}
export function withExcludedPowerSetters<T>(
  state: MatchState,
  excluded: ReadonlySet<string>,
  run: () => T,
): T {
  const prior = excludedPowerSetters.get(state);
  excludedPowerSetters.set(state, excluded);
  try {
    return run();
  } finally {
    if (prior) excludedPowerSetters.set(state, prior);
    else excludedPowerSetters.delete(state);
  }
}
const activeEvaluations = new WeakMap<MatchState, Set<string>>();

function actionIsDynamicModifier(
  action: Action,
  type: "power" | "cost" | "counter" | "playCost" | "lifeValue",
): action is Extract<
  Action,
  { action: "modifyPower" | "modifyCost" | "modifyCounter" | "modifyLifeValue" }
> {
  return (
    (type === "power" && action.action === "modifyPower") ||
    (type === "cost" && action.action === "modifyCost" && !action.paymentOnly) ||
    (type === "playCost" && action.action === "modifyCost" && action.paymentOnly === true) ||
    (type === "counter" && action.action === "modifyCounter") ||
    (type === "lifeValue" && action.action === "modifyLifeValue")
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

function distinctNameCount(state: MatchState, instanceIds: string[]): number {
  const names = new Set(
    instanceIds.flatMap((instanceId) => {
      const instance = state.cards[instanceId];
      return instance ? [getCard(instance.cardId).name] : [];
    }),
  );
  return names.size;
}

function sourceEffectsAreNegated(state: MatchState, sourceInstanceId: string): boolean {
  return (
    sourceEffectsAreNegatedByModifier(state, sourceInstanceId) ||
    effectsNegatedByPermanentEffect(state, sourceInstanceId, undefined)
  );
}

/** Live provider gates use the provider; returned conditions use the recipient. */
export function getPermanentActivationConditions(
  state: MatchState,
  recipientId: string,
  trigger: EffectTrigger,
): Condition[] {
  const conditions: Condition[] = [];
  for (const source of inPlaySources(state)) {
    const effects = (getCard(source.cardId).effects?.permanentEffects ?? []).filter((effect) =>
      effect.actions.some((action) => action.action === "addActivationConditions"),
    );
    if (!effects.length || sourceEffectsAreNegated(state, source.instanceId)) continue;
    for (const effect of effects) {
      const gate = evaluateConditions(
        state,
        source.controller,
        source.instanceId,
        effect.conditions,
      );
      if (!gate.supported || !gate.matches) continue;
      for (const action of effect.actions) {
        if (
          action.action !== "addActivationConditions" ||
          (action.effectTypes && !action.effectTypes.includes(trigger))
        )
          continue;
        const actionGate = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          action.condition ? [action.condition] : [],
        );
        if (!actionGate.supported || !actionGate.matches) continue;
        const pool = candidatePoolForTarget(
          state,
          source.controller,
          source.instanceId,
          action.target,
        );
        if (pool.supported && pool.candidateIds.includes(recipientId))
          conditions.push(...action.conditions);
      }
    }
  }
  return conditions;
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
        effect.actions.some(
          (action) =>
            action.action === "cannotBePlayedByEffects" &&
            (!action.sourceZones || action.sourceZones.some((zone) => zone === sourceZone)),
        )
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
      (!modifier.playRestrictionOrigin || modifier.playRestrictionOrigin === origin) &&
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
          if (
            action.byCardTypes &&
            !action.byCardTypes.includes(getCard(state.cards[sourceInstanceId]!.cardId).cardType)
          )
            continue;
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

// Cost filters must see the current continuous-effect result, including an
// already-applied effect's own contribution (OP10-042 FAQ).
const evaluatingCosts = new WeakMap<MatchState, Map<string, number>>();

export function getEvaluatingCardCost(state: MatchState, instanceId: string): number | undefined {
  return evaluatingCosts.get(state)?.get(instanceId);
}

export function withEvaluatingCardCosts<T>(
  state: MatchState,
  values: Record<string, number>,
  run: () => T,
): T {
  const previous = evaluatingCosts.get(state);
  evaluatingCosts.set(state, new Map(Object.entries(values)));
  try {
    return run();
  } finally {
    if (previous) evaluatingCosts.set(state, previous);
    else evaluatingCosts.delete(state);
  }
}

const evaluatingBaseCosts = new WeakMap<MatchState, Record<string, number>>();
export function getEvaluatingBaseCost(state: MatchState, id: string): number | undefined {
  return evaluatingBaseCosts.get(state)?.[id];
}
const evaluatingBasePowers = new WeakMap<MatchState, Record<string, number>>();
export function getEvaluatingBasePower(state: MatchState, id: string): number | undefined {
  return evaluatingBasePowers.get(state)?.[id];
}
const evaluatingPowers = new WeakMap<MatchState, Record<string, number>>();
export function getEvaluatingCardPower(state: MatchState, id: string): number | undefined {
  return evaluatingPowers.get(state)?.[id];
}
export function withEvaluatingNumericValues<T>(
  state: MatchState,
  values: {
    costs: Record<string, number>;
    powers: Record<string, number>;
    baseCosts?: Record<string, number>;
    basePowers?: Record<string, number>;
  },
  run: () => T,
): T {
  const previousBasePowers = evaluatingBasePowers.get(state);
  if (values.basePowers) evaluatingBasePowers.set(state, values.basePowers);
  const previousBaseCosts = evaluatingBaseCosts.get(state);
  if (values.baseCosts) evaluatingBaseCosts.set(state, values.baseCosts);
  const previous = evaluatingPowers.get(state);
  evaluatingPowers.set(state, values.powers);
  try {
    return withEvaluatingCardCosts(state, values.costs, run);
  } finally {
    if (previousBasePowers) evaluatingBasePowers.set(state, previousBasePowers);
    else evaluatingBasePowers.delete(state);
    if (previousBaseCosts) evaluatingBaseCosts.set(state, previousBaseCosts);
    else evaluatingBaseCosts.delete(state);
    if (previous) evaluatingPowers.set(state, previous);
    else evaluatingPowers.delete(state);
  }
}

export function continuousCostEntries(
  state: MatchState,
  orderedPower: ReadonlySet<string> = new Set(),
) {
  return Object.values(state.cards).flatMap((source) => {
    if (!sourceIsInPlay(state, source.instanceId) && source.zone !== "hand") return [];
    return (getCard(source.cardId).effects?.permanentEffects ?? []).flatMap((effect, index) => {
      const actions = effect.actions.filter(
        (
          action,
          actionIndex,
        ): action is Extract<
          Action,
          {
            action:
              | "modifyCost"
              | "modifyPower"
              | "setBaseCost"
              | "setBasePower"
              | "setBasePowerFrom";
          }
        > =>
          ((action.action === "modifyCost" && !action.paymentOnly) ||
            action.action === "modifyPower" ||
            action.action === "setBaseCost" ||
            ((action.action === "setBasePower" || action.action === "setBasePowerFrom") &&
              orderedPower.has(basePowerActionKey(source, index, actionIndex)))) &&
          (source.zone !== "hand" || action.target.self === true) &&
          (action.action === "setBasePower" || action.action === "setBasePowerFrom"
            ? deterministicPowerTarget(action.target)
            : action.target.count.amount === "all" || action.target.self === true),
      );
      return actions.length
        ? [
            {
              id: `${source.instanceId}:${source.zoneChangeCounter}:${index}`,
              source,
              effect,
              actions,
            },
          ]
        : [];
    });
  });
}

export function evaluateContinuousCostEntry(
  state: MatchState,
  entry: ReturnType<typeof continuousCostEntries>[number],
  previous: {
    contributions: Record<string, Record<string, number>>;
    basePowerContributions?: Record<string, Record<string, number>>;
    baseCostContributions?: Record<string, Record<string, number>>;
    powerContributions?: Record<string, Record<string, number>>;
  },
  values: (
    contributions: Record<string, Record<string, number>>,
    powerContributions: Record<string, Record<string, number>>,
    baseCostContributions: Record<string, Record<string, number>>,
    basePowerContributions: Record<string, Record<string, number>>,
  ) => {
    costs: Record<string, number>;
    powers: Record<string, number>;
    baseCosts?: Record<string, number>;
    basePowers?: Record<string, number>;
  },
): {
  contributions: Record<string, Record<string, number>>;
  powerContributions: Record<string, Record<string, number>>;
  baseCostContributions: Record<string, Record<string, number>>;
  basePowerContributions: Record<string, Record<string, number>>;
} {
  const basePowerResult = { ...previous.basePowerContributions };
  const result = { ...previous.contributions };
  const baseCostResult = { ...previous.baseCostContributions };
  const powerResult = { ...previous.powerContributions };
  const { source, effect, actions } = entry;
  const enabled = withEvaluatingNumericValues(
    state,
    values(result, powerResult, baseCostResult, basePowerResult),
    () => {
      if (sourceEffectsAreNegated(state, source.instanceId)) return false;
      const conditions = evaluateConditions(
        state,
        source.controller,
        source.instanceId,
        effect.conditions,
      );
      if (!conditions.supported) throw new Error("Unsupported continuous cost condition");
      return conditions.matches;
    },
  );
  let costIndex = 0;
  let powerIndex = 0;
  let baseCostIndex = 0;
  let basePowerIndex = 0;
  actions.forEach((action) => {
    // A block is one ordering unit. Its actions use the result of the preceding
    // action, replacing each action's old contribution rather than stacking it.
    const contribution = withEvaluatingNumericValues(
      state,
      values(result, powerResult, baseCostResult, basePowerResult),
      () => {
        const output: Record<string, number> = {};
        if (!enabled) return output;
        const condition = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          "condition" in action && action.condition ? [action.condition] : [],
        );
        if (!condition.supported) throw new Error("Unsupported continuous cost action condition");
        if (!condition.matches) return output;
        const pool = candidatePoolForTarget(
          state,
          source.controller,
          source.instanceId,
          action.target,
        );
        if (!pool.supported) throw new Error("Unsupported continuous cost target");
        let value: number;
        if (action.action === "setBasePowerFrom") {
          const copied = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.source,
          );
          if (!copied.supported || copied.candidateIds.length !== 1)
            throw new Error("Unsupported base-power copy source");
          const id = copied.candidateIds[0]!;
          const definition = getCard(state.cards[id]!.cardId);
          value =
            getSetBasePower(state, id) ??
            (definition.cardType === "leader" || definition.cardType === "character"
              ? (definition.power ?? 0)
              : 0);
        } else value = action.value;
        if (action.action === "modifyPower" && action.restedDonGroupSize) {
          value *= Math.floor(
            state.players[source.controller].restedDon / action.restedDonGroupSize,
          );
        } else if (
          (action.action === "modifyCost" || action.action === "modifyPower") &&
          action.valuePerCardGroup
        ) {
          const group = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.valuePerCardGroup.target,
          );
          if (!group.supported) throw new Error("Unsupported continuous cost count target");
          value *= Math.floor(group.candidateIds.length / action.valuePerCardGroup.size);
        } else if (action.action === "modifyPower" && action.valuePerDifferentNameOn) {
          const names = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.valuePerDifferentNameOn,
          );
          if (!names.supported) throw new Error("Unsupported continuous power name-count target");
          value *= distinctNameCount(state, names.candidateIds);
        }
        for (const id of pool.candidateIds) {
          if (source.zone !== "hand" || id === source.instanceId) output[id] = value;
        }
        return output;
      },
    );
    if (action.action === "modifyCost") result[`${entry.id}/${costIndex++}`] = contribution;
    else if (action.action === "setBaseCost")
      baseCostResult[`${entry.id}/${baseCostIndex++}`] = contribution;
    else if (action.action === "setBasePower" || action.action === "setBasePowerFrom")
      basePowerResult[`${entry.id}/${basePowerIndex++}`] = contribution;
    else powerResult[`${entry.id}/${powerIndex++}`] = contribution;
  });
  return {
    contributions: result,
    powerContributions: powerResult,
    baseCostContributions: baseCostResult,
    basePowerContributions: basePowerResult,
  };
}

export function getContinuousCardCost(
  state: MatchState,
  targetInstanceId: string,
  printedCost: number,
  resolvedModifier: number,
): number {
  const costs = evaluatingCosts.get(state) ?? new Map<string, number>();
  evaluatingCosts.set(state, costs);
  costs.set(targetInstanceId, Math.max(0, printedCost));
  const sources = Object.values(state.cards).sort(
    (a, b) => Number(b.controller === state.activeSeat) - Number(a.controller === state.activeSeat),
  );
  const entries = sources.flatMap((source) => {
    const inHand = source.instanceId === targetInstanceId && source.zone === "hand";
    if (!sourceIsInPlay(state, source.instanceId) && !inHand) return [];
    return (getCard(source.cardId).effects?.permanentEffects ?? []).flatMap((effect) =>
      effect.actions.flatMap((action) =>
        action.action === "modifyCost" &&
        !action.paymentOnly &&
        (!inHand || action.target.self) &&
        (action.target.count.amount === "all" || action.target.self)
          ? [{ source, effect, action, value: 0 }]
          : [],
      ),
    );
  });
  try {
    let total = 0;
    // Permanent effects apply before resolved automatic effects. Then repeat
    // their conditions against the resulting cost (rules 8-1-3-3-5).
    for (const temporary of [0, resolvedModifier]) {
      costs.set(targetInstanceId, Math.max(0, printedCost + total + temporary));
      let changed: boolean;
      do {
        changed = false;
        for (const entry of entries) {
          const { source, effect, action } = entry;
          const conditions = evaluateConditions(state, source.controller, source.instanceId, [
            ...(effect.conditions ?? []),
            ...(action.condition ? [action.condition] : []),
          ]);
          const pool =
            !sourceEffectsAreNegated(state, source.instanceId) &&
            conditions.supported &&
            conditions.matches
              ? candidatePoolForTarget(state, source.controller, source.instanceId, action.target)
              : undefined;
          let value = 0;
          if (pool?.supported && pool.candidateIds.includes(targetInstanceId)) {
            const group = action.valuePerCardGroup;
            const groupPool = group
              ? candidatePoolForTarget(state, source.controller, source.instanceId, group.target)
              : undefined;
            value =
              group && groupPool?.supported
                ? Math.floor(groupPool.candidateIds.length / group.size) * action.value
                : action.value;
          }
          if (entry.value !== value) {
            total += value - entry.value;
            entry.value = value;
            changed = true;
            costs.set(targetInstanceId, Math.max(0, printedCost + total + temporary));
          }
        }
      } while (changed);
    }
    return costs.get(targetInstanceId) ?? Math.max(0, printedCost + resolvedModifier);
  } finally {
    costs.delete(targetInstanceId);
    if (costs.size === 0) evaluatingCosts.delete(state);
  }
}

export function getPermanentModifierTotal(
  state: MatchState,
  targetInstanceId: string,
  type: "power" | "cost" | "counter" | "playCost" | "lifeValue",
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
      const card = getCard(source.cardId);
      const sourceIsSelfInHand = source.instanceId === targetInstanceId && source.zone === "hand";
      if (
        (!sourceIsInPlay(state, source.instanceId) && !sourceIsSelfInHand) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }

      for (const effect of card.effects?.permanentEffects ?? []) {
        const relevantActions = effect.actions.filter((action) =>
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
          if (!actionIsDynamicModifier(action, type)) {
            continue;
          }
          // Off-field modifiers apply only to the source card itself in hand.
          if (source.zone === "hand" && !action.target.self) continue;
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
              action.action === "modifyPower" || action.action === "modifyCost"
                ? action.valuePerCardGroup
                : undefined;
            const cardGroupPool = valuePerCardGroup
              ? candidatePoolForTarget(
                  state,
                  source.controller,
                  source.instanceId,
                  valuePerCardGroup.target,
                )
              : undefined;
            const valuePerDifferentNameOn =
              action.action === "modifyPower" ? action.valuePerDifferentNameOn : undefined;
            const differentNamePool = valuePerDifferentNameOn
              ? candidatePoolForTarget(
                  state,
                  source.controller,
                  source.instanceId,
                  valuePerDifferentNameOn,
                )
              : undefined;
            total += restedDonGroupSize
              ? Math.floor(state.players[source.controller].restedDon / restedDonGroupSize) *
                action.value
              : valuePerCardGroup && cardGroupPool?.supported
                ? Math.floor(cardGroupPool.candidateIds.length / valuePerCardGroup.size) *
                  action.value
                : valuePerDifferentNameOn && differentNamePool?.supported
                  ? distinctNameCount(state, differentNamePool.candidateIds) * action.value
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

// 4-9-2-1: permanent effects that set a base power compete by absolute value;
// the highest set value wins instead of stacking as additive deltas.
export function getPermanentSetBasePower(
  state: MatchState,
  targetInstanceId: string,
): number | null {
  const evaluationKey = `setBasePower:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return null;
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    let setBasePower: number | null = null;
    for (const source of Object.values(state.cards)) {
      const card = getCard(source.cardId);
      const relevantEffects = (card.effects?.permanentEffects ?? [])
        .map((effect, effectIndex) => ({
          ...effect,
          actions: effect.actions.filter(
            (_, actionIndex) =>
              !excludedPowerSetters
                .get(state)
                ?.has(basePowerActionKey(source, effectIndex, actionIndex)),
          ),
        }))
        .filter((effect) =>
          effect.actions.some(
            (action) => action.action === "setBasePowerFrom" || action.action === "setBasePower",
          ),
        );
      if (!relevantEffects.length) continue;
      const sourceIsSelfInHand = source.instanceId === targetInstanceId && source.zone === "hand";
      if (
        (!sourceIsInPlay(state, source.instanceId) && !sourceIsSelfInHand) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }
      for (const effect of relevantEffects) {
        const setBaseActions = effect.actions.filter(
          (action) => action.action === "setBasePowerFrom" || action.action === "setBasePower",
        );
        if (setBaseActions.length === 0) {
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
        for (const action of setBaseActions) {
          if (action.action === "setBasePowerFrom" && action.condition) {
            const condition = evaluateConditions(state, source.controller, source.instanceId, [
              action.condition,
            ]);
            if (!condition.supported || !condition.matches) continue;
          }
          const targetPool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (!targetPool.supported || !targetPool.candidateIds.includes(targetInstanceId)) {
            continue;
          }
          if (action.action === "setBasePower") {
            setBasePower =
              setBasePower === null ? action.value : Math.max(setBasePower, action.value);
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
          const copiedSourceId = sourcePool.candidateIds[0]!;
          const sourceCard = getCard(state.cards[copiedSourceId]!.cardId);
          // A continuous base-power copy follows other base setters (8-1-3-3-5),
          // but does not copy additive power or given DON!! power.
          const sourceBasePower =
            sourceCard.cardType === "leader" || sourceCard.cardType === "character"
              ? (getSetBasePower(state, copiedSourceId) ?? sourceCard.power ?? 0)
              : 0;
          setBasePower =
            setBasePower === null ? sourceBasePower : Math.max(setBasePower, sourceBasePower);
        }
      }
    }
    return setBasePower;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}

export function getPermanentSetBaseCost(
  state: MatchState,
  targetInstanceId: string,
): number | null {
  const evaluationKey = `setBaseCost:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) return null;
  activeEvaluations.set(state, active);
  active.add(evaluationKey);
  try {
    let result: number | null = null;
    for (const source of Object.values(state.cards)) {
      const effects = (getCard(source.cardId).effects?.permanentEffects ?? []).filter((effect) =>
        effect.actions.some((action) => action.action === "setBaseCost"),
      );
      if (!effects.length) continue;
      const inHand = source.instanceId === targetInstanceId && source.zone === "hand";
      if (
        (!sourceIsInPlay(state, source.instanceId) && !inHand) ||
        sourceEffectsAreNegated(state, source.instanceId)
      )
        continue;
      for (const effect of effects) {
        const enabled = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          effect.conditions,
        );
        if (!enabled.supported || !enabled.matches) continue;
        for (const action of effect.actions) {
          if (action.action !== "setBaseCost" || (inHand && !action.target.self)) continue;
          const condition = evaluateConditions(
            state,
            source.controller,
            source.instanceId,
            action.condition ? [action.condition] : [],
          );
          if (!condition.supported || !condition.matches) continue;
          const targets = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (targets.supported && targets.candidateIds.includes(targetInstanceId))
            result = result === null ? action.value : Math.max(result, action.value);
        }
      }
    }
    return result;
  } finally {
    active.delete(evaluationKey);
    if (!active.size) activeEvaluations.delete(state);
  }
}

/** Area-valid declarations; conditions and negation remain live evaluator checks. */
export function permanentSetCostEntries(state: MatchState, targetInstanceId?: string) {
  return Object.values(state.cards).flatMap((source) => {
    const handApplies =
      source.zone === "hand" &&
      (targetInstanceId === undefined || source.instanceId === targetInstanceId);
    if (!sourceIsInPlay(state, source.instanceId) && !handApplies) return [];
    return (getCard(source.cardId).effects?.permanentEffects ?? [])
      .filter((effect) => effect.actions.some((action) => action.action === "setCost"))
      .map((effect) => ({ source, effect }));
  });
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
    for (const { source, effect } of permanentSetCostEntries(state, targetInstanceId)) {
      if (sourceEffectsAreNegated(state, source.instanceId)) continue;
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
        const actionCondition = evaluateConditions(
          state,
          source.controller,
          source.instanceId,
          action.condition ? [action.condition] : [],
        );
        if (!actionCondition.supported || !actionCondition.matches) continue;
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
    return null;
  } finally {
    active.delete(evaluationKey);
    if (active.size === 0) {
      activeEvaluations.delete(state);
    }
  }
}

export function getPermanentSetCounter(state: MatchState, targetInstanceId: string): number | null {
  const evaluationKey = `setCounter:${targetInstanceId}`;
  const active = activeEvaluations.get(state) ?? new Set<string>();
  if (active.has(evaluationKey)) {
    return null;
  }
  activeEvaluations.set(state, active);
  active.add(evaluationKey);

  try {
    let value: number | null = null;
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
          if (action.action !== "setCounter") {
            continue;
          }
          if (source.zone === "hand" && !action.target.self) continue;
          if (action.condition) {
            const result = evaluateConditions(state, source.controller, source.instanceId, [
              action.condition,
            ]);
            if (!result.supported || !result.matches) continue;
          }
          const pool = candidatePoolForTarget(
            state,
            source.controller,
            source.instanceId,
            action.target,
          );
          if (pool.supported && pool.candidateIds.includes(targetInstanceId)) {
            value = value === null ? action.value : Math.max(value, action.value);
          }
        }
      }
    }
    return value;
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
      const card = getCard(source.cardId);
      const relevantEffects = (card.effects?.permanentEffects ?? []).filter((effect) =>
        effect.actions.some((action) => action.action === "grantKeyword"),
      );
      if (!relevantEffects.length) continue;
      if (
        !sourceIsInPlay(state, source.instanceId) ||
        sourceEffectsAreNegated(state, source.instanceId)
      ) {
        continue;
      }
      for (const effect of relevantEffects) {
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
    let hasNamedTargetRestriction = false;
    let matchesNamedTargetRestriction = false;
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
          if (action.action !== "attackRestriction" && action.action !== "cannotAttackTargets") {
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
          if (action.action === "cannotAttackTargets") {
            if (source.controller !== attacker.controller) continue;
            const attackers = candidatePoolForTarget(
              state,
              source.controller,
              source.instanceId,
              action.attacker,
            );
            if (
              attackers.supported &&
              attackers.candidateIds.includes(attackerInstanceId) &&
              action.filters.every((filter) => {
                const result = matchesTargetFilter(
                  state,
                  source.instanceId,
                  targetInstanceId,
                  filter,
                );
                return result.supported && result.matches;
              })
            )
              return false;
            continue;
          }
          if (source.controller === attacker.controller) continue;
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
          if (action.restriction === "cannotAttackOtherThan") {
            // OP17-044 FAQ: simultaneous named-target restrictions permit either
            // named Character. Other prohibitions still apply independently.
            hasNamedTargetRestriction = true;
            matchesNamedTargetRestriction ||= matches;
          } else if (action.restriction === "cannotAttack" ? matches : !matches) {
            return false;
          }
        }
      }
    }
    return !hasNamedTargetRestriction || matchesNamedTargetRestriction;
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

/** ST13-003 replaces the Life-to-hand move, not every move out of Life. */
export function faceUpLifeToHandReplacementSource(
  state: MatchState,
  instanceId: string,
): string | undefined {
  const target = state.cards[instanceId];
  if (!target || target.zone !== "life" || !target.faceUp) return undefined;
  return inPlaySources(state).find((source) => {
    if (
      source.controller !== target.controller ||
      sourceEffectsAreNegated(state, source.instanceId)
    )
      return false;
    return (getCard(source.cardId).effects?.permanentEffects ?? []).some((effect) => {
      const conditions = evaluateConditions(
        state,
        source.controller,
        source.instanceId,
        effect.conditions,
      );
      return (
        conditions.supported &&
        conditions.matches &&
        effect.actions.some((action) => action.action === "lifeToHandReplacement")
      );
    });
  })?.instanceId;
}

export function faceUpLifeToHandReplacement(state: MatchState, instanceId: string): boolean {
  return faceUpLifeToHandReplacementSource(state, instanceId) !== undefined;
}
