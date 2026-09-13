/**
 * Load-time normalization of authored ability AST onto one canonical tree.
 * Card modules may omit defaults and restate only unique riders; the runtime
 * sees expanded keywords, filled appliesTo.events, no dummy this-attack
 * targets, and ability ids already stamped from semantic authoring keys.
 */

import { isKnownStatusMarker } from "../status-markers.ts";
import type {
  FabResolutionAbility,
  FabTriggeredResolution,
  FleshAndBloodAbility,
} from "./ability.ts";
import type { FabCondition } from "./condition.ts";
import type { FabEffect } from "./effect.ts";
import type { FabCardFilter } from "./filter.ts";
import type { FabKeyword, FabLabelName } from "./keyword.ts";
import type { FabFutureApplicabilityEvent } from "./primitives.ts";
import type { FabTriggerCondition } from "./trigger.ts";
import {
  CRUSH_TRIGGER_EVENT,
  type ComboRiderAbility,
  type CrushRiderAbility,
} from "./authoring.ts";

const LABEL_KEYWORDS: ReadonlySet<FabLabelName> = new Set([
  "crush",
  "combo",
  "reprise",
  "surge",
  "rupture",
  "high-tide",
  "lightning-flow",
  "earth-bond",
  "ice-bond",
  "lightning-bond",
]);

export function keywordName(keyword: string | FabKeyword): string {
  return typeof keyword === "string" ? keyword : keyword.name;
}

function walkCondition(
  condition: FabCondition | undefined,
  visit: (c: FabCondition) => void,
): void {
  if (!condition) return;
  visit(condition);
  switch (condition.type) {
    case "and":
    case "or":
      for (const child of condition.conditions) walkCondition(child, visit);
      break;
    case "not":
      walkCondition(condition.condition, visit);
      break;
    default:
      break;
  }
}

function walkFilter(filter: FabCardFilter | undefined, visit: (f: FabCardFilter) => void): void {
  if (!filter) return;
  visit(filter);
  if (filter.defendingAgainst) walkFilter(filter.defendingAgainst, visit);
}

function walkTriggeredResolution(
  resolution: FabTriggeredResolution,
  visit: (e: FabEffect) => FabEffect,
): FabTriggeredResolution {
  if (resolution.kind === "effect") {
    return { kind: "effect", effect: walkEffect(resolution.effect, visit) ?? resolution.effect };
  }
  return {
    ...resolution,
    modes: resolution.modes.map((mode) => ({
      ...mode,
      ...(mode.effect ? { effect: walkEffect(mode.effect, visit) ?? mode.effect } : {}),
    })),
    ...(resolution.effect
      ? { effect: walkEffect(resolution.effect, visit) ?? resolution.effect }
      : {}),
  };
}

function walkEffect(
  effect: FabEffect | undefined,
  visit: (e: FabEffect) => FabEffect,
): FabEffect | undefined {
  if (!effect) return effect;
  const mapped = visit(effect);
  switch (mapped.type) {
    case "sequence":
      return { ...mapped, steps: mapped.steps.map((step) => walkEffect(step, visit) ?? step) };
    case "if-you-do":
      return {
        ...mapped,
        effect: walkEffect(mapped.effect, visit) ?? mapped.effect,
        then: walkEffect(mapped.then, visit) ?? mapped.then,
      };
    case "self-replacement":
      return {
        ...mapped,
        modification: walkEffect(mapped.modification, visit) ?? mapped.modification,
      };
    case "choice":
      return {
        ...mapped,
        options: mapped.options.map((option) => walkEffect(option, visit) ?? option),
      };
    case "conditional":
      return {
        ...mapped,
        then: walkEffect(mapped.then, visit) ?? mapped.then,
        ...(mapped.else ? { else: walkEffect(mapped.else, visit) ?? mapped.else } : {}),
      };
    case "optional":
      return {
        ...mapped,
        effect: walkEffect(mapped.effect, visit) ?? mapped.effect,
        ...(mapped.then ? { then: walkEffect(mapped.then, visit) ?? mapped.then } : {}),
      };
    case "for-each":
    case "repeat":
      return { ...mapped, effect: walkEffect(mapped.effect, visit) ?? mapped.effect };
    case "unless":
      return {
        ...mapped,
        effect: walkEffect(mapped.effect, visit) ?? mapped.effect,
        escape: walkEffect(mapped.escape, visit) ?? mapped.escape,
      };
    case "delayed-trigger":
    case "inline-trigger":
      return { ...mapped, resolution: walkTriggeredResolution(mapped.resolution, visit) };
    case "clash":
      return mapped.prize
        ? { ...mapped, prize: walkEffect(mapped.prize, visit) ?? mapped.prize }
        : mapped;
    case "swap-clash-reveals":
    case "wager":
      return mapped.prize
        ? { ...mapped, prize: walkEffect(mapped.prize, visit) ?? mapped.prize }
        : mapped;
    case "contract-watch":
      return { ...mapped, effect: walkEffect(mapped.effect, visit) ?? mapped.effect };
    case "grant-property":
      if (mapped.property.kind === "ability") {
        return {
          ...mapped,
          property: {
            ...mapped.property,
            ability: walkAbilityEffects(mapped.property.ability, visit),
          },
        };
      }
      return mapped;
    default:
      return mapped;
  }
}

export function walkAbilityEffects(
  ability: FleshAndBloodAbility,
  visit: (effect: FabEffect) => FabEffect,
): FleshAndBloodAbility {
  if (ability.kind === "resolution" || ability.kind === "activated") {
    return { ...ability, effect: walkEffect(ability.effect, visit) ?? ability.effect };
  }
  if (ability.kind === "static") {
    if (ability.staticKind === "triggered" && ability.resolution.kind === "effect") {
      return {
        ...ability,
        resolution: {
          kind: "effect",
          effect: walkEffect(ability.resolution.effect, visit) ?? ability.resolution.effect,
        },
      };
    }
    if ("effect" in ability && ability.effect) {
      return { ...ability, effect: walkEffect(ability.effect, visit) ?? ability.effect };
    }
    return ability;
  }
  if (ability.kind === "modal") {
    return {
      ...ability,
      ...(ability.effect ? { effect: walkEffect(ability.effect, visit) ?? ability.effect } : {}),
      modes: ability.modes.map((mode) => walkAbilityEffects(mode, visit)) as typeof ability.modes,
    };
  }
  return ability;
}

function assertKnownStatus(status: string, path: string): void {
  if (!isKnownStatusMarker(status)) {
    throw new Error(`unknown has-status slug ${status} at ${path}`);
  }
}

function assertStatusesInFilter(filter: FabCardFilter | undefined, path: string): void {
  walkFilter(filter, (f) => {
    if (f.hasStatus) assertKnownStatus(f.hasStatus, `${path}.hasStatus`);
  });
}

function assertStatusesInCondition(condition: FabCondition | undefined, path: string): void {
  walkCondition(condition, (c) => {
    if (c.type === "has-status") assertKnownStatus(c.status, path);
  });
}

function assertStatusesInTrigger(trigger: FabTriggerCondition, path: string): void {
  if (trigger.kind === "state" || trigger.kind === "event-and-state") {
    assertStatusesInCondition(trigger.state, `${path}.state`);
  }
}

function assertStatusesInEffect(effect: FabEffect | undefined, path: string): void {
  walkEffect(effect, (e) => {
    if ("condition" in e && e.condition)
      assertStatusesInCondition(e.condition, `${path}.condition`);
    if ("appliesTo" in e && e.appliesTo?.next)
      assertStatusesInFilter(e.appliesTo.next, `${path}.appliesTo.next`);
    if ("filter" in e && e.filter && typeof e.filter === "object" && "hasStatus" in e.filter) {
      assertStatusesInFilter(e.filter as FabCardFilter, `${path}.filter`);
    }
    if ("target" in e && e.target && typeof e.target === "object" && "filter" in e.target) {
      assertStatusesInFilter(e.target.filter as FabCardFilter | undefined, `${path}.target.filter`);
    }
    if (e.type === "delayed-trigger" || e.type === "inline-trigger") {
      assertStatusesInTrigger(e.trigger, `${path}.${e.type}`);
    }
    if (e.type === "grant-property" && e.property.kind === "ability") {
      rejectUnknownHasStatus([e.property.ability], path);
    }
    return e;
  });
}

function rejectEventDeckValue(value: unknown, path: string): void {
  if (value === "event-deck") {
    throw new Error(`event-deck is not an authorable zone or filter at ${path}`);
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => rejectEventDeckValue(entry, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (key === "fragments") continue;
      rejectEventDeckValue(child, `${path}.${key}`);
    }
  }
}

export function rejectOutOfScopeIdentity(
  abilities: readonly FleshAndBloodAbility[] | undefined,
  cardId: string,
): void {
  if (!abilities) return;
  rejectEventDeckValue(abilities, cardId);
}

export function rejectUnknownHasStatus(
  abilities: readonly FleshAndBloodAbility[] | undefined,
  cardId: string,
): void {
  if (!abilities) return;
  for (const ability of abilities) {
    const path = `${cardId}:${ability.id}`;
    if ("condition" in ability) assertStatusesInCondition(ability.condition, `${path}.condition`);
    if ("effect" in ability && ability.effect)
      assertStatusesInEffect(ability.effect, `${path}.effect`);
    if (ability.kind === "static" && ability.staticKind === "triggered") {
      assertStatusesInEffect(
        ability.resolution.kind === "effect" ? ability.resolution.effect : undefined,
        path,
      );
    }
    if (ability.kind === "modal") {
      rejectUnknownHasStatus(ability.modes, cardId);
    }
  }
}

function defaultApplicatorEvents(
  effect: FabEffect,
): readonly FabFutureApplicabilityEvent[] | undefined {
  if (!effect.appliesTo) return undefined;
  if (effect.appliesTo.events) return effect.appliesTo.events;
  if (effect.type === "modify-activation-cost") return ["activate"];
  const defending =
    typeof effect.appliesTo.next === "object" &&
    effect.appliesTo.next !== null &&
    "defending" in effect.appliesTo.next &&
    effect.appliesTo.next.defending === true;
  if (defending) return ["defend"];
  if (effect.appliesTo.attacksOf) return ["attack"];
  return ["play", "attack"];
}

function stripDummyThisAttack(effect: FabEffect): FabEffect {
  if (!effect.appliesTo?.next) return effect;
  if (!("target" in effect) || !effect.target) return effect;
  const target = effect.target;
  if (typeof target !== "object" || target === null || !("selector" in target)) return effect;
  if (target.selector !== "this-attack") return effect;
  // Engine uses dummy this-attack as the "their next" signal for next-turn
  // opponent applicators (Crush / Pulverize). Keep those; strip only the
  // controller's this-turn next-attack leftover. `count: all` latches also
  // buff the current attack via that dummy.
  if ("duration" in effect && effect.duration !== "this-turn") return effect;
  if (effect.appliesTo.count && effect.appliesTo.count !== 1) return effect;
  const { target: _dropped, ...rest } = effect as FabEffect & { target?: unknown };
  return rest as FabEffect;
}

function normalizeEffect(effect: FabEffect): FabEffect {
  return (
    walkEffect(effect, (e) => {
      let next = stripDummyThisAttack(e);
      const events = defaultApplicatorEvents(next);
      if (events && next.appliesTo && !next.appliesTo.events) {
        next = { ...next, appliesTo: { ...next.appliesTo, events } };
      }
      return next;
    }) ?? effect
  );
}

function expandGrantedAbilities(effect: FabEffect): FabEffect {
  return (
    walkEffect(effect, (e) => {
      if (e.type === "grant-property" && e.property.kind === "ability") {
        return {
          ...e,
          property: { kind: "ability", ability: expandCrush(e.property.ability) },
        };
      }
      return e;
    }) ?? effect
  );
}

function comboLastAttackGate(ability: FleshAndBloodAbility): FabCondition | undefined {
  if (ability.label?.name !== "combo") return undefined;
  const params = ability.label.params ?? {};
  const names = params.names;
  const nameIncludes = params.nameIncludes;
  const color = params.color;
  const filter = (
    ability as FleshAndBloodAbility & {
      readonly comboFilter?: ComboRiderAbility["comboFilter"];
    }
  ).comboFilter;
  if (!names && !nameIncludes && !color && !filter) return undefined;
  return {
    type: "last-attack-this-combat-chain",
    ...(Array.isArray(names) ? { names } : {}),
    ...(Array.isArray(nameIncludes) ? { nameIncludes } : {}),
    ...(typeof color === "string" ? { color: color as "Red" | "Yellow" | "Blue" } : {}),
    ...(filter ? { filter } : {}),
  };
}

function expandCombo(ability: FleshAndBloodAbility): FleshAndBloodAbility {
  const gate = comboLastAttackGate(ability);
  if (!gate) return ability;
  if (ability.kind === "resolution") {
    if (ability.condition) return ability;
    return { ...ability, condition: gate };
  }
  if (ability.kind === "static" && ability.staticKind === "continuous") {
    if (ability.condition) return ability;
    return { ...ability, condition: gate };
  }
  if (ability.kind === "static" && ability.staticKind === "triggered") {
    const trigger = ability.trigger;
    if (trigger.kind === "event") {
      return {
        ...ability,
        trigger: { kind: "event-and-state", event: trigger.event, state: gate },
      };
    }
    if (trigger.kind === "event-and-state" && !trigger.state) {
      return { ...ability, trigger: { ...trigger, state: gate } };
    }
  }
  return ability;
}

function expandCrush(ability: FleshAndBloodAbility): FleshAndBloodAbility {
  if (ability.label?.name !== "crush") return ability;
  if (ability.kind === "static" && ability.staticKind === "triggered") return ability;
  if (ability.kind !== "resolution") return ability;
  const observes = (
    ability as FabResolutionAbility & {
      readonly crushObserves?: CrushRiderAbility<string>["crushObserves"];
    }
  ).crushObserves;
  return {
    kind: "static",
    staticKind: "triggered",
    id: ability.id,
    text: ability.text,
    trigger: {
      kind: "event",
      event: {
        name: CRUSH_TRIGGER_EVENT.name,
        actor: { ...CRUSH_TRIGGER_EVENT.actor },
        observes: observes ?? { kind: "none" },
        amount: { ...CRUSH_TRIGGER_EVENT.amount },
        target: { ...CRUSH_TRIGGER_EVENT.target },
      },
    },
    resolution: { kind: "effect", effect: ability.effect },
    functionalZones: ability.functionalZones ?? ["combat-chain"],
    label: ability.label,
    ...(ability.limit ? { limit: ability.limit } : {}),
    ...(ability.layerKeywords ? { layerKeywords: ability.layerKeywords } : {}),
  };
}

function expandReprise(ability: FleshAndBloodAbility): FleshAndBloodAbility {
  if (ability.label?.name !== "reprise") return ability;
  if (ability.kind !== "resolution") return ability;
  if (ability.condition) return ability;
  // Overpower-style: +N always, reprise is a same-layer self-replacement.
  if (
    ability.effect.type === "sequence" &&
    ability.effect.steps.some((step) => step.type === "self-replacement")
  ) {
    return ability;
  }
  return {
    ...ability,
    condition: { type: "defended-this-chain-link", from: "hand" },
  };
}

function expandHighTide(ability: FleshAndBloodAbility): FleshAndBloodAbility {
  if (ability.label?.name !== "high-tide") return ability;
  if (ability.kind !== "resolution") return ability;
  if (ability.condition) return ability;
  return {
    ...ability,
    condition: {
      type: "zone-count",
      zone: "pitch",
      player: "controller",
      filter: { color: ["blue"] },
      comparison: { op: "gte", value: 2 },
    },
  };
}

function expandSurge(ability: FleshAndBloodAbility, arcane?: number): FleshAndBloodAbility {
  if (ability.label?.name !== "surge") return ability;
  if (ability.kind !== "resolution") return ability;
  if (ability.condition) return ability;
  const threshold =
    typeof ability.label.params?.threshold === "number"
      ? ability.label.params.threshold
      : (arcane ?? 0);
  return {
    ...ability,
    condition: {
      type: "source-damage-dealt",
      per: "turn",
      comparison: { op: "gt", value: threshold },
    },
  };
}

function expandRupture(ability: FleshAndBloodAbility): FleshAndBloodAbility {
  if (ability.label?.name !== "rupture") return ability;
  if (ability.kind !== "resolution") return ability;
  if (ability.condition) return ability;
  return {
    ...ability,
    condition: { type: "chain-link-count", comparison: { op: "gte", value: 4 } },
  };
}

function expandLightningFlow(ability: FleshAndBloodAbility): FleshAndBloodAbility {
  if (ability.label?.name !== "lightning-flow") return ability;
  if (ability.kind !== "resolution") return ability;
  if (ability.condition) return ability;
  return {
    ...ability,
    condition: {
      type: "played-this",
      per: "turn",
      filter: { typeBox: { supertypes: ["Lightning"] } },
      comparison: { op: "gte", value: 1 },
    },
  };
}

const BOND_PITCHED_BINDING = {
  "earth-bond": "pitched-this-way-earth-card",
  "ice-bond": "pitched-this-way-ice-card",
  "lightning-bond": "pitched-this-way-lightning-card",
} as const;

function bondPitchedCondition(label: string | undefined): FabCondition | undefined {
  if (!label || !(label in BOND_PITCHED_BINDING)) return undefined;
  return {
    type: "binding-numeric",
    binding: BOND_PITCHED_BINDING[label as keyof typeof BOND_PITCHED_BINDING],
    comparison: { op: "eq", value: 1 },
  };
}

function effectHasPitchedBondGate(effect: FabEffect | undefined, binding: string): boolean {
  if (!effect) return false;
  let found = false;
  walkEffect(effect, (e) => {
    if ("condition" in e && e.condition) {
      walkCondition(e.condition, (c) => {
        if (c.type === "binding-numeric" && c.binding === binding) found = true;
      });
    }
    return e;
  });
  return found;
}

function expandBond(ability: FleshAndBloodAbility): FleshAndBloodAbility {
  const pitched = bondPitchedCondition(ability.label?.name);
  if (!pitched || pitched.type !== "binding-numeric") return ability;
  const binding = pitched.binding;
  if (ability.kind === "resolution") {
    if (ability.condition) return ability;
    // Seeds of Strength: Bond is an inner instead, not an ability-level gate.
    if (effectHasPitchedBondGate(ability.effect, binding)) return ability;
    return { ...ability, condition: pitched };
  }
  if (ability.kind === "static" && ability.staticKind === "triggered") {
    const trigger = ability.trigger;
    if (trigger.kind === "event") {
      return {
        ...ability,
        trigger: { kind: "event-and-state", event: trigger.event, state: pitched },
      };
    }
    if (trigger.kind === "event-and-state" && !trigger.state) {
      return { ...ability, trigger: { ...trigger, state: pitched } };
    }
  }
  return ability;
}

function normalizeAbilityEffect(ability: FleshAndBloodAbility): FleshAndBloodAbility {
  if (ability.kind === "resolution" && ability.effect) {
    return { ...ability, effect: normalizeEffect(ability.effect) };
  }
  if (ability.kind === "activated" && ability.effect) {
    return { ...ability, effect: normalizeEffect(ability.effect) };
  }
  if (ability.kind === "static") {
    if (ability.staticKind === "triggered" && ability.resolution.kind === "effect") {
      return {
        ...ability,
        resolution: { kind: "effect", effect: normalizeEffect(ability.resolution.effect) },
      };
    }
    if ("effect" in ability && ability.effect) {
      return { ...ability, effect: normalizeEffect(ability.effect) };
    }
  }
  if (ability.kind === "modal") {
    return {
      ...ability,
      modes: ability.modes.map((mode) => normalizeAbilityEffect(mode) as typeof mode),
    };
  }
  return ability;
}

export function expandLabelKeywordAbilities(
  abilities: readonly FleshAndBloodAbility[] | undefined,
  options: { arcane?: number } = {},
): readonly FleshAndBloodAbility[] | undefined {
  if (!abilities) return abilities;
  return abilities.map((ability) => {
    let next = expandCrush(ability);
    next = expandCombo(next);
    next = expandReprise(next);
    next = expandHighTide(next);
    next = expandSurge(next, options.arcane);
    next = expandRupture(next);
    next = expandLightningFlow(next);
    next = expandBond(next);
    if (next.kind === "resolution" && next.effect) {
      next = { ...next, effect: expandGrantedAbilities(next.effect) };
    }
    if (next.kind === "activated" && next.effect) {
      next = { ...next, effect: expandGrantedAbilities(next.effect) };
    }
    if (next.kind === "modal") {
      next = {
        ...next,
        modes: (expandLabelKeywordAbilities(next.modes, options) ??
          next.modes) as typeof next.modes,
      };
    }
    return normalizeAbilityEffect(next);
  });
}

export function assignAbilityIds(
  abilities: readonly FleshAndBloodAbility[] | undefined,
  canonicalId: string,
): readonly FleshAndBloodAbility[] | undefined {
  if (!abilities) return abilities;
  let index = 0;
  const stamp = (ability: FleshAndBloodAbility): FleshAndBloodAbility => {
    index += 1;
    const id = ability.id && ability.id.length > 0 ? ability.id : `${canonicalId}-a${index}`;
    if (ability.kind === "modal") {
      return { ...ability, id, modes: ability.modes.map(stamp) as typeof ability.modes };
    }
    return { ...ability, id };
  };
  return abilities.map(stamp);
}

export function ensureLabelKeywords(
  keywords: readonly FabKeyword[] | undefined,
  abilities: readonly FleshAndBloodAbility[] | undefined,
): readonly FabKeyword[] | undefined {
  const names = new Set<string>((keywords ?? []).map((keyword) => keyword.name));
  const extra: FabKeyword[] = [];
  for (const ability of abilities ?? []) {
    const label = ability.label?.name;
    if (!label || !LABEL_KEYWORDS.has(label) || names.has(label)) continue;
    names.add(label);
    extra.push({ name: label } as FabKeyword);
  }
  if (extra.length === 0) return keywords;
  return [...(keywords ?? []), ...extra];
}
