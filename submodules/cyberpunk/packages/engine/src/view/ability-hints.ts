import type { Ability, Effect, StructuredCardDefinition, TargetDSL } from "@tcg/cyberpunk-types";

export type AbilityTimingHint =
  | "play"
  | "attack"
  | "call"
  | "flip"
  | "activated"
  | "defeated"
  | "event"
  | "static"
  | "keyword";

export type AbilityRoleHint =
  | "boardControl"
  | "cardAdvantage"
  | "combat"
  | "development"
  | "disruption"
  | "economy"
  | "gigManipulation"
  | "gigPressure"
  | "protection"
  | "setup";

export type AbilityRequirementHint =
  | "attackContext"
  | "equippedBoard"
  | "friendlyBoard"
  | "friendlyGig"
  | "friendlyTrash"
  | "rivalBoard"
  | "rivalGig";

export interface AbilityConditionThresholdHint {
  condition: string;
  minCount: number;
}

/**
 * Coarse, player-safe semantics for one visible structured ability. These
 * fields intentionally omit effect payloads, card text, and hidden targets.
 */
export interface FilteredAbilityHint {
  abilityIndex: number;
  timing: AbilityTimingHint;
  event: string | null;
  reactive: boolean;
  effects: string[];
  conditions: string[];
  conditionThresholds: AbilityConditionThresholdHint[];
  requiredHostNames: string[];
  roles: AbilityRoleHint[];
  requirements: AbilityRequirementHint[];
}

export function getAbilityHints(def: StructuredCardDefinition): FilteredAbilityHint[] {
  return def.abilities.map((ability, abilityIndex) => buildAbilityHint(def, ability, abilityIndex));
}

function buildAbilityHint(
  def: StructuredCardDefinition,
  ability: Ability,
  abilityIndex: number,
): FilteredAbilityHint {
  const effects = new Set<string>();
  const roles = new Set<AbilityRoleHint>();
  for (const effect of ability.effects) collectEffectSemantics(effect, effects, roles);

  const conditions = new Set<string>();
  collectConditionHints(ability, conditions);
  const conditionThresholds: AbilityConditionThresholdHint[] = [];
  collectConditionThresholds(ability, conditionThresholds);

  const requirements = new Set<AbilityRequirementHint>();
  collectTargetRequirements(ability, requirements);
  const requiredHostNames = new Set<string>();
  collectRequiredHostNames(ability, requiredHostNames);

  const timing = abilityTiming(ability);
  const event = ability.trigger?.trigger === "event" ? ability.trigger.event.event : null;
  return {
    abilityIndex,
    timing,
    event,
    reactive:
      ability.keyword === "quick" ||
      def.keywords.includes("quick") ||
      requirements.has("attackContext"),
    effects: [...effects].sort(),
    conditions: [...conditions].sort(),
    conditionThresholds: conditionThresholds.sort(
      (left, right) =>
        left.condition.localeCompare(right.condition) || left.minCount - right.minCount,
    ),
    requiredHostNames: [...requiredHostNames].sort(),
    roles: [...roles].sort(),
    requirements: [...requirements].sort(),
  };
}

function collectConditionThresholds(value: unknown, out: AbilityConditionThresholdHint[]): void {
  if (Array.isArray(value)) {
    for (const item of value) collectConditionThresholds(item, out);
    return;
  }
  if (!isRecord(value)) return;
  if (typeof value.condition === "string" && typeof value.minCount === "number") {
    out.push({ condition: value.condition, minCount: value.minCount });
  }
  for (const nested of Object.values(value)) collectConditionThresholds(nested, out);
}

function collectRequiredHostNames(value: unknown, out: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectRequiredHostNames(item, out);
    return;
  }
  if (!isRecord(value)) return;
  if (
    value.condition === "cardName" &&
    typeof value.name === "string" &&
    isRecord(value.target) &&
    value.target.selector === "host"
  ) {
    out.add(value.name);
  }
  for (const nested of Object.values(value)) collectRequiredHostNames(nested, out);
}

function abilityTiming(ability: Ability): AbilityTimingHint {
  if (ability.trigger) return ability.trigger.trigger;
  if (ability.kind === "keyword") return "keyword";
  return "static";
}

function collectEffectSemantics(
  effect: Effect,
  effects: Set<string>,
  roles: Set<AbilityRoleHint>,
): void {
  effects.add(effect.effect);
  for (const role of rolesForEffect(effect)) roles.add(role);

  if (effect.effect === "ifYouDo") {
    collectEffectSemantics(effect.doEffect, effects, roles);
    for (const nested of effect.ifEffects) collectEffectSemantics(nested, effects, roles);
    for (const nested of effect.elseEffects ?? []) collectEffectSemantics(nested, effects, roles);
  } else if (effect.effect === "delayed" || effect.effect === "forEachFriendlyGigPair") {
    for (const nested of effect.effects) collectEffectSemantics(nested, effects, roles);
  }
}

function rolesForEffect(effect: Effect): AbilityRoleHint[] {
  switch (effect.effect) {
    case "defeat":
    case "spend":
    case "returnToHand":
    case "removeFromGame":
      return ["boardControl"];
    case "draw":
    case "lookAt":
    case "scry":
    case "searchDeck":
    case "revealTopCardType":
      return ["cardAdvantage"];
    case "rivalRevealChoice":
      return ["cardAdvantage", "disruption"];
    case "discardFromHand":
      return ["disruption"];
    case "readyEddies":
    case "sellFromDeck":
    case "grantCostModifier":
      return ["economy"];
    case "moveCard":
    case "playCard":
    case "attachCard":
    case "callLegend":
      return ["development"];
    case "modifyGig":
    case "adjustGig":
    case "copyGigValue":
    case "forEachFriendlyGigPair":
    case "rerollGig":
      return ["gigManipulation"];
    case "stealGig":
      return ["gigPressure"];
    case "modifyPower":
    case "multiplyPower":
    case "grantRule":
    case "ready":
    case "defeatAtEndOfTurnIfAttacks":
    case "revealTopCardAndModifyPowerByCost":
      return ["combat"];
    case "preventNextRivalFightDefeat":
      return ["protection"];
    case "trashFromDeck":
      return ["setup"];
    case "ifYouDo":
    case "delayed":
      return [];
  }
}

function collectConditionHints(value: unknown, out: Set<string>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectConditionHints(item, out);
    return;
  }
  if (!isRecord(value)) return;
  if (typeof value.condition === "string") out.add(value.condition);
  for (const nested of Object.values(value)) collectConditionHints(nested, out);
}

function collectTargetRequirements(value: unknown, out: Set<AbilityRequirementHint>): void {
  if (Array.isArray(value)) {
    for (const item of value) collectTargetRequirements(item, out);
    return;
  }
  if (!isRecord(value)) return;
  if (isTarget(value)) addTargetRequirement(value, out);
  for (const nested of Object.values(value)) collectTargetRequirements(nested, out);
}

function addTargetRequirement(target: TargetDSL, out: Set<AbilityRequirementHint>): void {
  if (target.selector === "attacker") {
    out.add("attackContext");
    return;
  }
  if (target.selector === "gig") {
    if (target.controller === "rival") out.add("rivalGig");
    else if (target.controller === "friendly" || target.controller === "owner") {
      out.add("friendlyGig");
    }
    return;
  }
  if (target.selector !== "card") return;

  const isFriendly = target.controller === "friendly" || target.controller === "owner";
  const isRival = target.controller === "rival";
  if (target.zones?.includes("trash") && isFriendly) out.add("friendlyTrash");
  if (!target.zones || target.zones.includes("field") || target.zones.includes("legendArea")) {
    if (isFriendly) out.add("friendlyBoard");
    if (isRival) out.add("rivalBoard");
  }
  if (target.hasAttachedCards && isFriendly) out.add("equippedBoard");
}

function isTarget(value: Record<string, unknown>): value is TargetDSL & Record<string, unknown> {
  return (
    value.selector === "self" ||
    value.selector === "host" ||
    value.selector === "bound" ||
    value.selector === "context" ||
    value.selector === "card" ||
    value.selector === "gig" ||
    value.selector === "attacker"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
