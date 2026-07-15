import type { Effect } from "@tcg/lorcana-types";

export type EffectPolarity = "beneficial" | "harmful" | "mixed" | "neutral";

export type EffectPolarityResult = {
  polarity: EffectPolarity;
};

type EffectNode = Effect & {
  amount?: number | string | { upTo?: number; min?: number; max?: number };
  ability?: string | { type: string; [key: string]: unknown } | undefined;
  destination?: string;
  destinations?: Array<{ zone?: string }>;
  effect?: Effect;
  effects?: Effect[];
  else?: Effect;
  falseEffect?: Effect;
  forEach?: Effect[];
  ifFalse?: Effect;
  ifTrue?: Effect;
  keyword?: string;
  modifier?: number | string;
  options?: Effect[];
  restriction?: string;
  stat?: string;
  steps?: Effect[];
  target?: unknown;
  then?: Effect;
  trueEffect?: Effect;
  type: string;
  value?: number | string;
};

function isEffectNode(value: unknown): value is EffectNode {
  return typeof value === "object" && value !== null && "type" in value;
}

function getNumericValue(field: unknown): number | undefined {
  if (typeof field === "number") return field;
  return undefined;
}

function classifyModifyStatPolarity(node: EffectNode): EffectPolarity {
  const modifier = getNumericValue(node.modifier) ?? getNumericValue(node.value);
  if (modifier === undefined) return "neutral";
  if (modifier > 0) return "beneficial";
  if (modifier < 0) return "harmful";
  return "neutral";
}

function classifyGainKeywordPolarity(node: EffectNode): EffectPolarity {
  const keyword = node.keyword;
  if (typeof keyword !== "string") return "beneficial";
  const harmfulKeywords = new Set(["Reckless"]);
  if (harmfulKeywords.has(keyword)) return "harmful";
  return "beneficial";
}

function classifyGrantAbilityPolarity(node: EffectNode): EffectPolarity {
  const ability = node.ability;
  if (typeof ability === "string") {
    const harmfulAbilities = new Set(["lose-lore-when-questing"]);
    if (harmfulAbilities.has(ability)) return "harmful";
    return "beneficial";
  }
  if (typeof ability === "object" && ability !== null) {
    if (ability.type === "lose-lore-when-questing") return "harmful";
  }
  return "beneficial";
}

function classifyRestrictionPolarity(_node: EffectNode): EffectPolarity {
  return "harmful";
}

function classifyEntersPlayPolarity(node: EffectNode): EffectPolarity {
  const modification = (node as unknown as { modification?: string }).modification;
  if (modification === "exerted" || modification === "damaged") return "harmful";
  return "neutral";
}

function classifyWinConditionPolarity(node: EffectNode): EffectPolarity {
  const target = node.target;
  const loreRequired = (node as unknown as { loreRequired?: number }).loreRequired;
  if (loreRequired !== undefined && loreRequired > 20) return "harmful";
  return "beneficial";
}

function classifySetStatPolarity(node: EffectNode): EffectPolarity {
  const stat = node.stat;
  const value = getNumericValue(node.value);
  if (value === undefined) return "neutral";
  if (stat === "lore") return value > 0 ? "beneficial" : value < 0 ? "harmful" : "neutral";
  if (stat === "willpower") return value >= 0 ? "beneficial" : "harmful";
  if (stat === "strength") return value >= 0 ? "beneficial" : "harmful";
  return "neutral";
}

function classifyCostEffectPolarity(node: EffectNode): EffectPolarity {
  if (node.effect) return classifyEffectPolarityInternal(node.effect);
  return "neutral";
}

const BENEFICIAL_TYPES: ReadonlySet<string> = new Set([
  "remove-damage",
  "ready",
  "gain-lore",
  "draw",
  "put-into-inkwell",
  "put-in-hand",
  "play-card",
  "cost-reduction",
  "grant-hand-inkability",
  "grant-discard-inkability",
  "enable-play-from-under",
  "prevent-damage",
  "additional-inkwell",
  "stat-floor",
  "grant-classification",
  "move-to-location",
  "move-cost-reduction",
  "grant-abilities-while-here",
  "support",
]);

const HARMFUL_TYPES: ReadonlySet<string> = new Set([
  "deal-damage",
  "put-damage",
  "banish",
  "exert",
  "discard",
  "mill",
  "lose-lore",
  "lose-keyword",
  "cost-increase",
  "shuffle-into-deck",
  "put-on-bottom",
  "return-to-hand",
  "redirect-damage",
  "reveal-hand",
  "return-random-from-inkwell",
  "lore-loss",
  "take-damage",
]);

const NEUTRAL_TYPES: ReadonlySet<string> = new Set([
  "select-target",
  "look-at-cards",
  "look-at-top",
  "name-a-card",
  "reveal-top-card",
  "reveal-until-match",
  "put-on-top",
  "draw-until-hand-size",
  "scry",
  "search-deck",
  "count",
  "suppress-ability",
  "reveal",
  "reveal-deck",
  "reveal-top",
  "look-at-deck",
  "protection",
  "self-play-condition",
]);

const BRANCH_TYPES: ReadonlySet<string> = new Set([
  "sequence",
  "choice",
  "or",
  "optional",
  "conditional",
  "for-each",
  "for-each-opponent",
  "for-each-player",
  "repeat",
  "cost-effect",
  "reveal-and-conditional",
  "reveal-and-route",
]);

const CONTEXT_TYPES: ReadonlyMap<string, (node: EffectNode) => EffectPolarity> = new Map([
  ["modify-stat", classifyModifyStatPolarity],
  ["set-stat", classifySetStatPolarity],
  ["gain-keyword", classifyGainKeywordPolarity],
  ["gain-keywords", classifyGainKeywordPolarity],
  ["grant-ability", classifyGrantAbilityPolarity],
  ["restriction", classifyRestrictionPolarity],
  ["enters-play-modification", classifyEntersPlayPolarity],
  ["enters-play-with", classifyEntersPlayPolarity],
  ["enters-with-damage", classifyEntersPlayPolarity],
  ["win-condition-modification", classifyWinConditionPolarity],
  ["cost-effect", classifyCostEffectPolarity],
  ["create-triggered-ability", () => "beneficial"],
  ["create-replacement-effect", () => "neutral"],
  ["move-damage", () => "harmful"],
  ["move", () => "neutral"],
  ["move-cards-from-under", () => "neutral"],
  ["return-from-discard", () => "beneficial"],
]);

function classifyEffectPolarityInternal(effect: Effect | undefined): EffectPolarity {
  if (!effect || !isEffectNode(effect)) return "neutral";

  const node = effect as EffectNode;
  const type = node.type;

  if (BENEFICIAL_TYPES.has(type)) return "beneficial";
  if (HARMFUL_TYPES.has(type)) return "harmful";
  if (NEUTRAL_TYPES.has(type)) return "neutral";

  if (type === "property-modification") return "neutral";

  const contextClassifier = CONTEXT_TYPES.get(type);
  if (contextClassifier) return contextClassifier(node);

  if (BRANCH_TYPES.has(type)) return classifyBranchPolarity(node);

  return "neutral";
}

function getNestedEffects(node: EffectNode): Effect[] {
  const result: Effect[] = [];
  const candidates: unknown[] = [
    node.effect,
    node.then,
    node.else,
    node.ifTrue,
    node.ifFalse,
    node.trueEffect,
    node.falseEffect,
    ...(node.effects ?? []),
    ...(node.options ?? []),
    ...(node.steps ?? []),
    ...(node.forEach ?? []),
  ];
  for (const candidate of candidates) {
    if (isEffectNode(candidate)) {
      result.push(candidate);
    }
  }
  return result;
}

function aggregatePolarities(polarities: EffectPolarity[]): EffectPolarity {
  if (polarities.length === 0) return "neutral";

  const beneficial = polarities.includes("beneficial");
  const harmful = polarities.includes("harmful");

  if (beneficial && harmful) return "mixed";
  if (beneficial) return "beneficial";
  if (harmful) return "harmful";

  return polarities[0];
}

function classifyBranchPolarity(node: EffectNode): EffectPolarity {
  const type = node.type;
  const children = getNestedEffects(node);

  if (type === "optional") {
    return children.length > 0 ? classifyEffectPolarityInternal(children[0]) : "neutral";
  }

  if (type === "cost-effect") {
    const rewardEffects = children.slice(1);
    if (rewardEffects.length > 0) {
      return aggregatePolarities(rewardEffects.map((e) => classifyEffectPolarityInternal(e)));
    }
    if (children.length > 0) {
      return classifyEffectPolarityInternal(children[0]);
    }
    return "neutral";
  }

  if (type === "conditional" || type === "reveal-and-conditional") {
    const branchEffects = children.length >= 2 ? children : children;
    return aggregatePolarities(branchEffects.map((e) => classifyEffectPolarityInternal(e)));
  }

  if (type === "for-each-opponent" || type === "for-each-player") {
    return children.length > 0 ? classifyEffectPolarityInternal(children[0]) : "neutral";
  }

  return aggregatePolarities(children.map((e) => classifyEffectPolarityInternal(e)));
}

export function classifyEffectPolarity(effect: Effect | undefined): EffectPolarityResult {
  return { polarity: classifyEffectPolarityInternal(effect) };
}

/**
 * Returns the polarity of the step within `effect` that requires a chosen-target selection.
 * When an effect is a sequence with mixed polarity (e.g. deal-damage + draw), the targeted
 * step's polarity (e.g. "harmful" for deal-damage) is used so the AI correctly prefers
 * opponent characters over its own characters.
 *
 * Falls back to the overall effect polarity when no clearer targeted step is found.
 */
export function classifyTargetedStepPolarity(effect: Effect | undefined): EffectPolarityResult {
  if (!effect || !isEffectNode(effect as Effect)) {
    return { polarity: "neutral" };
  }
  const overall = classifyEffectPolarityInternal(effect);
  if (overall !== "mixed") {
    return { polarity: overall };
  }
  // For mixed-polarity sequences, return the polarity of the first step that has
  // a chosen-target (i.e. a step that requires player targeting input).
  const node = effect as EffectNode;
  const steps = [
    ...(node.steps ?? []),
    ...(node.effects ?? []),
    ...(node.options ?? []),
  ] as Effect[];
  for (const step of steps) {
    if (!isEffectNode(step)) continue;
    const stepNode = step as EffectNode;
    const target = stepNode.target;
    if (typeof target === "string" && target.startsWith("CHOSEN_")) {
      return { polarity: classifyEffectPolarityInternal(step) };
    }
    if (
      typeof target === "object" &&
      target !== null &&
      (target as Record<string, unknown>).selector === "chosen"
    ) {
      return { polarity: classifyEffectPolarityInternal(step) };
    }
  }
  return { polarity: overall };
}
