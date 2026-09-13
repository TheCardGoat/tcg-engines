/**
 * Continuous equip restrictions (Bolfar "You can't equip weapons").
 *
 * Shared by pregame seating validation and runtime equip effect proposals so
 * the catalog rule-modification (`mode: restrict`, `action: equip`) is the
 * single source of truth.
 */
import type {
  FabCardFilter,
  FabEffect,
  FabStaticAbility,
  FleshAndBloodAbility,
} from "@tcg/flesh-and-blood-types";
import { registerFabCardDefinition, type FabCardDefinitionInput } from "../cards.ts";
import { buildFabRulesView } from "./state-rules-view.ts";
import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import type { FabObjectSnapshot } from "./events.ts";

/** CR 8.3.26a: a pairs card may only be equipped when its partner object is
 * already equipped, or is being equipped as part of the same event. Returns
 * true when the required partner is absent so the equip proposal can reject it.
 * Reads the partner identity from the card definition (the evaluated keyword
 * view drops the printed `cardName` parameter), matching the pregame seating
 * check in {@link enforcePairsEquipment}. */
export function pairsPartnerMissing(
  state: FabRulesSnapshot,
  equipperId: string,
  object: FabObjectSnapshot,
  sameEventCanonicals: ReadonlySet<string> = new Set(),
): boolean {
  const canonicalId = object.canonicalId;
  if (!canonicalId) return false;
  const def = state.cardDefinitions[canonicalId];
  const pairs = def?.base.keywords.find(
    (keyword): keyword is { name: "pairs"; cardName: string } =>
      typeof keyword !== "string" &&
      keyword.name === "pairs" &&
      "cardName" in keyword &&
      !!keyword.cardName,
  );
  if (!pairs) return false;
  const partner = pairs.cardName.toLocaleLowerCase("en-US");
  const equipped = new Set<string>(sameEventCanonicals);
  const zones = state.containers.zonesByPlayerId[equipperId];
  if (zones) {
    for (const zone of ["head", "chest", "arms", "legs", "weapon1", "weapon2"] as const) {
      for (const id of zones[zone] ?? []) {
        equipped.add(state.objects[id]?.canonicalId ?? "");
      }
    }
  }
  return ![...equipped].some((candidate) => {
    const definition = state.cardDefinitions[candidate];
    if (!definition) return false;
    const names = [definition.slug, ...(definition.base.names ?? [])]
      .filter((name): name is string => typeof name === "string")
      .map((name) => name.toLocaleLowerCase("en-US"));
    const subtypes = definition.base.typeBox.subtypes.map((subtype) =>
      subtype.toLocaleLowerCase("en-US"),
    );
    return names.includes(partner) || subtypes.includes(partner);
  });
}

/** True when a continuous equip-restrict rule blocks this equipper + object. */
export function isEquipRestricted(
  state: FabRulesSnapshot,
  equipperId: string,
  object: FabObjectSnapshot,
): boolean {
  const view = buildFabRulesView(state);
  const evaluated = view.object(object.ref);
  if (!evaluated) return false;
  for (const rule of view.rules("equip")) {
    if (rule.mode !== "restrict") continue;
    if (rule.controllerId !== equipperId) continue;
    if (!rule.filter) return true;
    if (
      view.matchesFilter(evaluated, rule.filter, {
        controllerId: equipperId,
        source: evaluated.ref,
        bindings: { objects: {}, numbers: {}, strings: {} },
      })
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Catalog-level check used at pregame (no live continuous instances yet).
 * Walks the hero's static continuous abilities for `restrict equip` filters.
 */
export function heroCatalogRestrictsEquip(
  heroDefinition: FabCardDefinitionInput | undefined,
  equipmentDefinition: FabCardDefinitionInput | undefined,
): boolean {
  if (!heroDefinition || !equipmentDefinition) return false;
  const hero = registerFabCardDefinition(heroDefinition);
  const equipment = registerFabCardDefinition(equipmentDefinition);
  for (const ability of hero.base.abilities) {
    if (!isStaticContinuous(ability)) continue;
    if (!ability.effect) continue;
    if (effectRestrictsEquipMatching(ability.effect, equipment)) return true;
  }
  return false;
}

/** Catalog-level Zane allowance used before live continuous rules exist. */
export function heroCatalogTreats2hSwordAs1h(
  heroDefinition: FabCardDefinitionInput | undefined,
  weaponDefinition: FabCardDefinitionInput | undefined,
): boolean {
  if (!heroDefinition || !weaponDefinition) return false;
  const hero = registerFabCardDefinition(heroDefinition);
  const weapon = registerFabCardDefinition(weaponDefinition);
  const subtypes = weapon.base.typeBox.subtypes;
  if (!subtypes.includes("Sword") || !subtypes.includes("2H")) return false;
  return hero.base.abilities.some((ability) => {
    if (ability.kind !== "static" || ability.staticKind !== "continuous") return false;
    const effect = ability.effect;
    return (
      effect?.type === "rule-modification" &&
      effect.action === "equip" &&
      effect.mode === "allow" &&
      effect.handedness === "2h-sword-as-1h"
    );
  });
}

/** Live equivalent for mid-game equip effects. */
export function treats2hSwordAs1h(
  state: FabRulesSnapshot,
  equipperId: string,
  object: FabObjectSnapshot,
): boolean {
  // Adapter-level callers may provide a deliberately minimal rules snapshot;
  // without transaction counters there cannot be a live continuous-rule view.
  if (!state.counters) return false;
  const evaluated = buildFabRulesView(state).object(object.ref);
  if (!evaluated) return false;
  const view = buildFabRulesView(state);
  return view.rules("equip").some(
    (rule) =>
      rule.mode === "allow" &&
      rule.controllerId === equipperId &&
      rule.parameters.kind === "rule-modification" &&
      rule.parameters.handedness === "2h-sword-as-1h" &&
      (!rule.filter ||
        view.matchesFilter(evaluated, rule.filter, {
          controllerId: equipperId,
          source: evaluated.ref,
          bindings: { objects: {}, numbers: {}, strings: {} },
        })),
  );
}

function isStaticContinuous(
  ability: FleshAndBloodAbility,
): ability is FabStaticAbility & { staticKind: "continuous" | "while" } {
  return (
    ability.kind === "static" &&
    (ability.staticKind === "continuous" || ability.staticKind === "while")
  );
}

function effectRestrictsEquipMatching(
  effect: FabEffect,
  equipmentDefinition: FabCardDefinitionInput,
): boolean {
  if (effect.type === "sequence") {
    return effect.steps.some((step) => effectRestrictsEquipMatching(step, equipmentDefinition));
  }
  if (effect.type !== "rule-modification") return false;
  if (effect.mode !== "restrict" || effect.action !== "equip") return false;
  if (!effect.filter) return true;
  return catalogDefinitionMatchesFilter(equipmentDefinition, effect.filter);
}

/** Minimal catalog filter match for pregame (types / subtypes / supertypes). */
function catalogDefinitionMatchesFilter(
  definition: FabCardDefinitionInput,
  filter: FabCardFilter,
): boolean {
  const typeBox = registerFabCardDefinition(definition).base.typeBox;
  const box = filter.typeBox;
  if (box?.types?.length) {
    const needed = box.types.map((t) => t.toLowerCase());
    const actual = typeBox.types.map((t) => t.toLowerCase());
    if (!needed.every((t) => actual.includes(t))) return false;
  }
  if (box?.subtypes?.length) {
    const needed = box.subtypes.map((t) => t.toLowerCase());
    const actual = typeBox.subtypes.map((t) => t.toLowerCase());
    if (!needed.every((t) => actual.includes(t))) return false;
  }
  if (box?.supertypes?.length) {
    const needed = box.supertypes.map((t) => t.toLowerCase());
    const actual = typeBox.supertypes.map((t) => t.toLowerCase());
    if (!needed.every((t) => actual.includes(t))) return false;
  }
  // Other filter fields are ignored at pregame — type-line is enough for
  // "can't equip weapons" and similar seating bans.
  return true;
}
