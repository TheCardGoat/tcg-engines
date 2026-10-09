import { orderedPowerDependencies, numericTargetScope } from "./continuous-numeric-dependencies.ts";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import {
  continuousCostEntries,
  getPermanentSetCost,
  permanentSetCostEntries,
  evaluateContinuousCostEntry,
  withEvaluatingNumericValues,
  withExcludedPowerSetters,
} from "../effects/permanent.ts";
import {
  baseCost,
  basePower,
  getSetBasePower,
  getResolvedSetBaseCost,
  getPowerModifierTotal,
  getCostModifierTotal,
  recordCapabilityIssue,
} from "../shared.ts";
import { createChoicePrompt, enqueueJudgePrompt } from "../state.ts";
import type { ContinuousCostProcess, MatchSeat, MatchState } from "../types.ts";

// State inputs read by the existing condition/target evaluators. Prompt/log and
// command bookkeeping must not reset a player's saved choice. K.O. history is
// the sole history input read by those evaluators; retain the full event facts.
const immutableInputs = new WeakMap<MatchState, string>();
export function continuousCostFingerprint(state: MatchState): string {
  let inputs = immutableInputs.get(state);
  if (inputs === undefined)
    inputs = JSON.stringify({
      cards: state.cards,
      players: state.players,
      modifiers: state.modifiers,
      activeSeat: state.activeSeat,
      turnNumber: state.turnNumber,
      phase: state.phase,
      battle: state.battle,
      koHistory: state.eventHistory.filter((event) => event.type === "characterKod"),
    });
  // Immer's published states are immutable; drafts and raw restored snapshots
  // are never cached. Card definitions are checked separately on every read.
  if (
    Object.isFrozen(state) &&
    Object.isFrozen(state.cards) &&
    Object.isFrozen(state.players) &&
    Object.isFrozen(state.modifiers) &&
    Object.isFrozen(state.eventHistory)
  )
    immutableInputs.set(state, inputs);
  return (
    inputs +
    JSON.stringify(
      [
        ...new Set(
          Object.values(state.cards)
            .filter((card) => ["leader", "character", "stage", "hand"].includes(card.zone))
            .map((card) => card.cardId),
        ),
      ].map((id) => [id, getCard(id).effects?.permanentEffects]),
    )
  );
}

export function settledContinuousCost(state: MatchState, id: string): number | undefined {
  const settled = state.continuousCosts;
  if (!settled || settled.fingerprint !== continuousCostFingerprint(state)) return undefined;
  return settled.values[id];
}

export function settledContinuousBaseCost(state: MatchState, id: string): number | undefined {
  const settled = state.continuousCosts;
  if (!settled || settled.fingerprint !== continuousCostFingerprint(state)) return undefined;
  return settled.baseCostValues?.[id];
}

export function settledContinuousBasePower(state: MatchState, id: string): number | undefined {
  const settled = state.continuousCosts;
  if (!settled || settled.fingerprint !== continuousCostFingerprint(state)) return undefined;
  return settled.basePowerValues?.[id];
}

export function settledContinuousPower(state: MatchState, id: string): number | undefined {
  const settled = state.continuousCosts;
  if (!settled?.powerValues || settled.fingerprint !== continuousCostFingerprint(state))
    return undefined;
  return settled.powerValues[id];
}

function roundSignature(
  node: Pick<
    ContinuousCostProcess,
    "contributions" | "powerContributions" | "baseCostContributions" | "basePowerContributions"
  >,
): string {
  if (Object.keys(node.basePowerContributions ?? {}).length)
    return JSON.stringify([
      node.contributions,
      node.powerContributions,
      node.baseCostContributions,
      node.basePowerContributions,
    ]);
  if (Object.keys(node.baseCostContributions ?? {}).length)
    return JSON.stringify([
      node.contributions,
      node.powerContributions,
      node.baseCostContributions,
    ]);
  return Object.keys(node.powerContributions ?? {}).length
    ? JSON.stringify([node.contributions, node.powerContributions])
    : JSON.stringify(node.contributions);
}

function otherSeat(seat: MatchSeat): MatchSeat {
  return seat === "south" ? "north" : "south";
}

function costModel(state: MatchState) {
  const powerProfile = orderedPowerDependencies(state);
  const entries = continuousCostEntries(state, powerProfile.ordered);
  const absoluteSetters = permanentSetCostEntries(state);
  const hasAbsoluteSetter = absoluteSetters.length > 0;
  const dependentAbsoluteSetter = absoluteSetters.some(
    ({ source, effect }) =>
      hasLiveCostRead(effect) ||
      hasDerivedRead(effect) ||
      powerProfile.numericNegationTargets.has(source.instanceId),
  );
  const liveEffects = Object.values(state.cards).flatMap((source) =>
    ["leader", "character", "stage", "hand"].includes(source.zone)
      ? (getCard(source.cardId).effects?.permanentEffects ?? []).map((effect) => ({
          source,
          effect: {
            ...effect,
            actions: effect.actions.filter(
              (action) =>
                source.zone !== "hand" || ("target" in action && action.target?.self === true),
            ),
          },
        }))
      : [],
  );
  // Existing unresolved base-power feedback remains outside the ordered
  // profile. Base-cost eligibility uses the property-specific audit instead.
  const dependentBaseSetting =
    powerProfile.ordered.size === 0 &&
    liveEffects.some(
      ({ source, effect }) =>
        effect.actions.some(
          (action) => action.action === "setBasePower" || action.action === "setBasePowerFrom",
        ) &&
        (hasLiveCostRead(effect) ||
          hasCurrentPowerRead(effect) ||
          hasKeywordRead(effect) ||
          powerProfile.numericNegationTargets.has(source.instanceId)),
    );
  const printed = Object.fromEntries(
    Object.values(state.cards).map((card) => [card.instanceId, baseCost(getCard(card.cardId))]),
  );
  const resolvedBases = Object.fromEntries(
    Object.keys(printed).map((id) => [id, getResolvedSetBaseCost(state, id)]),
  );
  const temporary = Object.fromEntries(
    Object.keys(printed).map((id) => [id, getCostModifierTotal(state, id)]),
  );
  const baseCosts = (node: ContinuousCostProcess): Record<string, number> => {
    const result = { ...printed };
    for (const id of Object.keys(result)) {
      const settings = Object.values(node.baseCostContributions ?? {}).flatMap((entry) =>
        entry[id] === undefined ? [] : [entry[id]!],
      );
      if (resolvedBases[id] !== null && resolvedBases[id] !== undefined)
        settings.push(resolvedBases[id]);
      if (settings.length) result[id] = Math.max(...settings);
    }
    return result;
  };
  const values = (node: ContinuousCostProcess): Record<string, number> => {
    const result = baseCosts(node);
    for (const contribution of Object.values(node.contributions)) {
      for (const [id, value] of Object.entries(contribution))
        result[id] = (result[id] ?? 0) + value;
    }
    for (const id of Object.keys(result))
      result[id] = Math.max(0, result[id]! + (node.stage === 1 ? temporary[id]! : 0));
    // Absolute settings take precedence over additive changes, as in getCardCost.
    for (const modifier of Object.values(state.modifiers)) {
      if (modifier.type === "setCost") result[modifier.targetId] = Math.max(0, modifier.value ?? 0);
    }
    return result;
  };
  const printedPowers = Object.fromEntries(
    Object.values(state.cards).map((card) => [card.instanceId, basePower(getCard(card.cardId))]),
  );
  const donPowers = Object.fromEntries(
    Object.values(state.cards).map((card) => [
      card.instanceId,
      card.controller === state.activeSeat ? card.attachedDon * 1000 : 0,
    ]),
  );
  const temporaryPowers = Object.fromEntries(
    Object.keys(printedPowers).map((id) => [id, getPowerModifierTotal(state, id)]),
  );
  const legacyBases =
    powerProfile.ordered.size > 0 &&
    !powerProfile.connectedLegacy &&
    !powerProfile.connectedNegation &&
    !powerProfile.unsupportedLegacy
      ? withExcludedPowerSetters(state, powerProfile.ordered, () =>
          Object.fromEntries(
            Object.keys(printedPowers).map((id) => [id, getSetBasePower(state, id)]),
          ),
        )
      : undefined;
  const basePowers = (node: ContinuousCostProcess): Record<string, number> => {
    const result = { ...printedPowers };
    if (!legacyBases) return result;
    for (const id of Object.keys(result)) {
      const settings = Object.values(node.basePowerContributions ?? {}).flatMap((entry) =>
        entry[id] === undefined ? [] : [entry[id]!],
      );
      if (legacyBases[id] !== null && legacyBases[id] !== undefined) settings.push(legacyBases[id]);
      if (settings.length) result[id] = Math.max(...settings);
    }
    return result;
  };
  // Only base settings independent of numeric evaluation are admitted below.
  // They therefore have one value for this immutable settlement input, shared
  // by all explored orders rather than reevaluated for every graph edge.
  let fixedBases: Record<string, number> | undefined;
  const powers = (node: ContinuousCostProcess): Record<string, number> => {
    const result = legacyBases ? basePowers(node) : { ...printedPowers };
    const additions = { ...donPowers };
    if (node.stage === 1)
      for (const id of Object.keys(additions)) additions[id] += temporaryPowers[id]!;
    for (const contribution of Object.values(node.powerContributions ?? {})) {
      for (const [id, value] of Object.entries(contribution))
        additions[id] = (additions[id] ?? 0) + value;
    }
    for (const id of Object.keys(result)) result[id] += additions[id]!;
    if (!legacyBases && powerProfile.ordered.size === 0 && !dependentBaseSetting && !fixedBases) {
      fixedBases = withEvaluatingNumericValues(state, { costs: values(node), powers: result }, () =>
        Object.fromEntries(
          Object.keys(result).map((id) => [id, getSetBasePower(state, id) ?? printedPowers[id]!]),
        ),
      );
    }
    if (fixedBases)
      for (const id of Object.keys(result)) result[id] = fixedBases[id]! + additions[id]!;
    return result;
  };
  const identities = (seat: MatchSeat) =>
    entries.filter((entry) => entry.source.controller === seat).map((entry) => entry.id);
  const normalize = (
    input: ContinuousCostProcess,
  ): { node: ContinuousCostProcess; final: boolean } => {
    let node = input;
    while (node.remaining.length === 0) {
      if (node.controller === state.activeSeat) {
        node = {
          ...node,
          controller: otherSeat(state.activeSeat),
          remaining: identities(otherSeat(state.activeSeat)),
        };
        continue;
      }
      const signature = roundSignature(node);
      if (signature === node.roundStart) {
        if (node.stage === 1) return { node, final: true };
        node = { ...node, stage: 1 };
      }
      node = {
        ...node,
        controller: state.activeSeat,
        remaining: identities(state.activeSeat),
        roundStart: signature,
      };
      if (entries.length === 0) return { node, final: true };
    }
    return { node, final: false };
  };
  const step = (node: ContinuousCostProcess, id: string): ContinuousCostProcess => {
    const entry = entries.find((candidate) => candidate.id === id);
    if (!entry || !node.remaining.includes(id)) throw new Error("Stale continuous cost effect");
    return {
      ...node,
      remaining: node.remaining.filter((candidate) => candidate !== id),
      ...evaluateContinuousCostEntry(
        state,
        entry,
        node,
        (contributions, powerContributions, baseCostContributions, basePowerContributions) => {
          const provisional = {
            ...node,
            contributions,
            powerContributions,
            baseCostContributions,
            basePowerContributions,
          };
          return {
            costs: values(provisional),
            powers: powers(provisional),
            baseCosts: baseCosts(provisional),
            basePowers: legacyBases ? basePowers(provisional) : undefined,
          };
        },
      ),
    };
  };
  // Conservative numeric read/write sets. Pure self-hand discounts commute
  // with field-only reads; do not enumerate their factorial interleavings.
  const allIds = Object.keys(printed);
  const numericNegation = hasInPlayNegation(state);
  const footprints = new Map(
    entries.map((entry) => {
      const writes = new Set(
        entry.actions.flatMap((action) => numericTargetScope(state, entry.source, action.target)),
      );
      const reads = new Set<string>(numericNegation ? allIds : []);
      // Conditions may read other cards or power that itself depends on cost.
      if (hasLiveCostRead(entry.effect.conditions) || hasDerivedRead(entry.effect.conditions))
        allIds.forEach((id) => reads.add(id));
      for (const action of entry.actions) {
        if (hasLiveCostRead(action.target) || hasCurrentPowerRead(action.target))
          writes.forEach((id) => reads.add(id));
        if (
          hasLiveCostRead("condition" in action ? action.condition : undefined) ||
          hasDerivedRead("condition" in action ? action.condition : undefined) ||
          ((action.action === "modifyCost" || action.action === "modifyPower") &&
            action.valuePerCardGroup) ||
          (action.action === "modifyPower" && action.valuePerDifferentNameOn) ||
          action.action === "setBasePowerFrom" ||
          hasIndirectDerivedRead(action.target)
        )
          allIds.forEach((id) => reads.add(id));
      }
      return [entry.id, { writes, reads }] as const;
    }),
  );
  const choices = (node: ContinuousCostProcess): string[] => {
    const independent = node.remaining.find((id) =>
      node.remaining.every((other) => {
        if (id === other) return true;
        const a = footprints.get(id)!;
        const b = footprints.get(other)!;
        return (
          ![...a.writes].some((target) => b.reads.has(target)) &&
          ![...b.writes].some((target) => a.reads.has(target))
        );
      }),
    );
    return independent ? [independent] : node.remaining;
  };
  const memo = new Map<string, Map<string, ContinuousCostProcess | null>>();
  const visiting = new Set<string>();
  const outcomes = (input: ContinuousCostProcess): Map<string, ContinuousCostProcess | null> => {
    if (
      powerProfile.ordered.size &&
      (powerProfile.connectedLegacy ||
        powerProfile.connectedNegation ||
        powerProfile.unsupportedLegacy)
    )
      throw new Error(
        "Ordered base power reaches unresolved numeric feedback; judge review required",
      );
    if (powerProfile.baseCostIssue)
      throw new Error(powerProfile.baseCostIssue + "; judge review required");
    if (dependentBaseSetting)
      throw new Error(
        "Numeric ordering with cost/power-dependent base settings requires judge review",
      );
    if (
      dependentAbsoluteSetter ||
      (hasAbsoluteSetter &&
        Object.keys(state.cards).some(
          (instanceId) => getPermanentSetCost(state, instanceId) !== null,
        ))
    )
      throw new Error(
        "Continuous cost ordering with permanent absolute cost settings requires judge review",
      );
    const { node, final } = normalize(input);
    if (final)
      return new Map([
        [
          JSON.stringify([
            values(node),
            powers(node),
            node.contributions,
            node.powerContributions,
            node.baseCostContributions,
            node.basePowerContributions,
          ]),
          node,
        ],
      ]);
    const key = JSON.stringify(node);
    const known = memo.get(key);
    if (known) return known;
    if (visiting.has(key)) return new Map([["cyclic", null]]);
    visiting.add(key);
    const result = new Map<string, ContinuousCostProcess | null>();
    for (const id of choices(node)) {
      for (const [signature, terminal] of outcomes(step(node, id))) result.set(signature, terminal);
    }
    visiting.delete(key);
    memo.set(key, result);
    return result;
  };
  return {
    entries,
    identities,
    values,
    powers,
    baseCosts,
    basePowers: legacyBases ? basePowers : undefined,
    normalize,
    step,
    outcomes,
    choices,
  };
}

function hasInPlayNegation(state: MatchState): boolean {
  // A nonempty timing list cannot negate permanent numeric effects.
  return Object.values(state.cards).some(
    (source) =>
      ["leader", "character", "stage"].includes(source.zone) &&
      (getCard(source.cardId).effects?.permanentEffects ?? []).some((effect) =>
        effect.actions.some(
          (action) =>
            (action.action === "negateEffects" || action.action === "negatePlayerEffects") &&
            !action.effectTypes?.length,
        ),
      ),
  );
}

function hasCurrentPowerRead(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasCurrentPowerRead);
  return Object.entries(value).some(
    ([key, child]) =>
      ((key === "filter" || key === "property") && child === "power") || hasCurrentPowerRead(child),
  );
}

function hasKeywordRead(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasKeywordRead);
  return Object.entries(value).some(
    ([key, child]) => (key === "filter" && child === "hasKeyword") || hasKeywordRead(child),
  );
}

function hasIndirectDerivedRead(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasIndirectDerivedRead);
  return Object.entries(value).some(
    ([key, child]) =>
      ((key === "filter" || key === "property") &&
        (child === "basePower" || child === "baseCost" || child === "hasKeyword")) ||
      hasIndirectDerivedRead(child),
  );
}

function hasDerivedRead(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasDerivedRead);
  return Object.entries(value).some(
    ([key, child]) =>
      ((key === "filter" || key === "property") &&
        (child === "power" ||
          child === "basePower" ||
          child === "baseCost" ||
          child === "hasKeyword")) ||
      hasDerivedRead(child),
  );
}

function hasLiveCostRead(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasLiveCostRead);
  return Object.entries(value).some(
    ([key, child]) =>
      ((key === "filter" || key === "property") &&
        (child === "cost" || child === "baseCost" || child === "dynamicCost")) ||
      hasLiveCostRead(child),
  );
}

// Returns false while a public choice or explicit capability boundary pauses
// resolution. This function runs at mutation boundaries, never from projection.
export function settleContinuousCosts(state: MatchState): boolean {
  if (state.status !== "active") return true;
  const liveFingerprint = state.continuousCosts ? continuousCostFingerprint(state) : undefined;
  // Accepted judge mutations can invalidate a pending source. Cancel only this
  // protocol's stale prompt; invalid ordinary replies leave its fingerprint intact.
  for (const prompt of state.promptQueue) {
    if (
      prompt.status === "pending" &&
      prompt.resolutionContext?.intent === "continuousCostOrder" &&
      prompt.resolutionContext.fingerprint !== liveFingerprint
    )
      prompt.status = "cancelled";
  }
  if (state.promptQueue.some((prompt) => prompt.status === "pending" && prompt.seat !== "judge"))
    return false;
  const powerProfile = orderedPowerDependencies(state);
  const entries = continuousCostEntries(state, powerProfile.ordered);
  const hasBaseCostSetting = Object.values(state.cards).some(
    (source) =>
      ["leader", "character", "stage", "hand"].includes(source.zone) &&
      (getCard(source.cardId).effects?.permanentEffects ?? []).some((effect) =>
        effect.actions.some((action) => action.action === "setBaseCost"),
      ),
  );
  if (
    !hasBaseCostSetting &&
    powerProfile.ordered.size === 0 &&
    (entries.length === 0 ||
      (!entries.some((entry) => hasLiveCostRead(entry.effect) || hasDerivedRead(entry.effect)) &&
        !hasInPlayNegation(state)))
  ) {
    state.continuousCosts = undefined;
    return true;
  }
  const fingerprint = continuousCostFingerprint(state);
  if (state.continuousCosts?.fingerprint === fingerprint && !state.continuousCosts.pending)
    return !state.continuousCosts.unsupported;
  const prior = state.continuousCosts;
  const model = costModel(state);
  const contributions = Object.fromEntries(
    entries.flatMap((entry) =>
      entry.actions
        .filter((action) => action.action === "modifyCost")
        .map((_, index) => {
          const id = `${entry.id}/${index}`;
          return [id, prior?.contributions[id] ?? {}];
        }),
    ),
  );
  const powerContributions = Object.fromEntries(
    entries.flatMap((entry) =>
      entry.actions
        .filter((action) => action.action === "modifyPower")
        .map((_, index) => {
          const id = `${entry.id}/${index}`;
          return [id, prior?.powerContributions?.[id] ?? {}];
        }),
    ),
  );
  const baseCostContributions = Object.fromEntries(
    entries.flatMap((entry) =>
      entry.actions
        .filter((action) => action.action === "setBaseCost")
        .map((_, index) => {
          const id = `${entry.id}/${index}`;
          return [id, prior?.baseCostContributions?.[id] ?? {}];
        }),
    ),
  );
  const basePowerContributions = Object.fromEntries(
    entries.flatMap((entry) =>
      entry.actions
        .filter(
          (action) => action.action === "setBasePower" || action.action === "setBasePowerFrom",
        )
        .map((_, index) => {
          const id = `${entry.id}/${index}`;
          return [id, prior?.basePowerContributions?.[id] ?? {}];
        }),
    ),
  );
  let node: ContinuousCostProcess =
    prior?.fingerprint === fingerprint && prior.pending
      ? {
          ...prior.pending,
          baseCostContributions: prior.pending.baseCostContributions ?? {},
          basePowerContributions: prior.pending.basePowerContributions ?? {},
        }
      : {
          contributions,
          powerContributions,
          baseCostContributions,
          basePowerContributions,
          controller: state.activeSeat,
          remaining: model.identities(state.activeSeat),
          stage: 0,
          roundStart: roundSignature({
            contributions,
            powerContributions,
            baseCostContributions,
            basePowerContributions,
          }),
        };
  try {
    for (;;) {
      const normalized = model.normalize(node);
      node = normalized.node;
      const outcomes = model.outcomes(node);
      if (outcomes.size === 1) {
        const final = outcomes.values().next().value;
        if (!final) throw new Error("Cyclic continuous cost component requires judge review");
        state.continuousCosts = {
          fingerprint,
          contributions: final.contributions,
          values: model.values(final),
          baseCostValues: model.baseCosts(final),
          basePowerValues: model.basePowers?.(final),
          basePowerContributions: final.basePowerContributions,
          powerValues: model.powers(final),
          powerContributions: final.powerContributions,
          baseCostContributions: final.baseCostContributions,
        };
        return true;
      }
      const candidates = model.choices(node);
      if (candidates.length === 1) {
        node = model.step(node, candidates[0]!);
        continue;
      }
      state.continuousCosts = {
        fingerprint,
        contributions: node.contributions,
        values: model.values(node),
        baseCostValues: model.baseCosts(node),
        basePowerValues: model.basePowers?.(node),
        basePowerContributions: node.basePowerContributions,
        powerValues: model.powers(node),
        powerContributions: node.powerContributions,
        baseCostContributions: node.baseCostContributions,
        pending: node,
      };
      createChoicePrompt(state, {
        choiceKind: "chooseOption",
        seat: node.controller,
        label: "Choose which permanent numeric effect to apply first.",
        details: "The order changes the resulting costs or power.",
        sourceCardId: null,
        sourceInstanceId: null,
        eventId: null,
        options: candidates.map((id) => {
          const entry = entries.find((candidate) => candidate.id === id)!;
          return {
            id,
            value: id,
            targetId: entry.source.instanceId,
            label: `${getCard(entry.source.cardId).name}: permanent effect ${Number(entry.id.split(":").at(-1)) + 1}, ${entry.actions.map((action) => (action.action === "setBasePowerFrom" ? "copy Leader base power" : action.action === "setBasePower" ? `base power ${action.value}` : action.action === "setBaseCost" ? `base cost ${action.value}` : `${action.value >= 0 ? "+" : ""}${action.value} ${action.action === "modifyCost" ? "cost" : "power"}`)).join(", ")}`,
          };
        }),
        minSelections: 1,
        maxSelections: 1,
        context: {},
        resolutionContext: {
          intent: "continuousCostOrder",
          fingerprint,
          candidateIds: candidates,
        },
      });
      return false;
    }
  } catch (error) {
    const details =
      error instanceof Error ? error.message : "Unsupported continuous cost component";
    state.continuousCosts = {
      fingerprint,
      contributions: node.contributions,
      values: model.values(node),
      powerValues: model.powers(node),
      powerContributions: node.powerContributions,
      baseCostContributions: node.baseCostContributions,
      baseCostValues: model.baseCosts(node),
      basePowerValues: model.basePowers?.(node),
      basePowerContributions: node.basePowerContributions,
      unsupported: true,
    };
    const issue = recordCapabilityIssue(state, {
      kind: "unsupportedAction",
      code: "continuous-cost:settlement",
      actor: state.activeSeat,
      sourceCardId: null,
      sourceInstanceId: null,
      eventId: null,
      details,
    });
    enqueueJudgePrompt(state, null, "Judge review: continuous cost effects", details, {
      issueId: issue.id,
    });
    return false;
  }
}

export function chooseContinuousCostOrder(
  state: MatchState,
  fingerprint: string,
  id: string | undefined,
): boolean {
  const saved = state.continuousCosts;
  if (
    !saved?.pending ||
    saved.fingerprint !== fingerprint ||
    continuousCostFingerprint(state) !== fingerprint ||
    !id ||
    !saved.pending.remaining.includes(id)
  )
    return false;
  const model = costModel(state);
  saved.pending = model.step(saved.pending, id);
  saved.contributions = saved.pending.contributions;
  saved.values = model.values(saved.pending);
  saved.powerValues = model.powers(saved.pending);
  saved.powerContributions = saved.pending.powerContributions;
  saved.baseCostContributions = saved.pending.baseCostContributions;
  saved.baseCostValues = model.baseCosts(saved.pending);
  saved.basePowerValues = model.basePowers?.(saved.pending);
  saved.basePowerContributions = saved.pending.basePowerContributions;
  return true;
}
