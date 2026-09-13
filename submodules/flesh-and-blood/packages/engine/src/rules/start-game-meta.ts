/**
 * CR 4.1.2a / 4.1.5b — hero meta-static "start the game with …" seating.
 *
 * Start-game placements are selected from the player's deck before shuffle/draw.
 * They do not go through the play procedure (no "played" triggers).
 */
import type { FabCardFilter, FabDestination, FabEffect, FabZone } from "@tcg/flesh-and-blood-types";
import {
  basePropertiesOf,
  registerFabCardDefinition,
  type FabCardDefinitionInput,
} from "../cards.ts";

export interface FabStartGameMetaAbility {
  readonly abilityId: string;
  readonly filter: FabCardFilter;
  readonly to: FabDestination;
  readonly optional: boolean;
  /** Max cards this ability may place. Defaults to 1. */
  readonly maxCount: number;
}

export interface FabStartGamePlacement {
  readonly canonicalId: string;
  /** Engine fixture zone kind after catalog→engine mapping. */
  readonly zone: "arena" | "graveyard" | "banished" | "arsenal" | "hand" | "pitch";
}

/**
 * Read hero meta abilities of the form `start-game` with a filter + destination.
 * Zone-count-only meta (weapon zone counts) is intentionally omitted here.
 */
export function listHeroStartGameAbilities(
  hero: FabCardDefinitionInput | undefined,
): readonly FabStartGameMetaAbility[] {
  if (!hero) return [];
  const registered = registerFabCardDefinition(hero);
  const out: FabStartGameMetaAbility[] = [];
  for (const ability of registered.base.abilities) {
    if (ability.kind !== "static" || ability.staticKind !== "meta") continue;
    const effect = ability.effect as FabEffect | undefined;
    if (!effect || effect.type !== "start-game") continue;
    if (!("filter" in effect) || !effect.filter || !("to" in effect) || !effect.to) continue;
    out.push({
      abilityId: ability.id,
      filter: effect.filter,
      to: effect.to,
      optional: effect.optional === true,
      maxCount: 1,
    });
  }
  return out;
}

/**
 * Apply a player's CR 4.1.5b start-game selection: remove selected cards from the
 * deck list and return placements for the target zones. Throws if a selection
 * does not match any hero start-game filter or exceeds maxCount.
 *
 * Selection is by canonical id and consumes one matching deck entry per pick
 * (order of selection is preserved for multi-card heroes later).
 */
export function applyStartGameSelection(args: {
  readonly hero: FabCardDefinitionInput;
  readonly deckCanonicalIds: readonly string[];
  readonly selectedCanonicalIds: readonly string[];
  readonly cardDefinitions: Readonly<Record<string, FabCardDefinitionInput>>;
}): {
  readonly remainingDeckCanonicalIds: readonly string[];
  readonly placements: readonly FabStartGamePlacement[];
} {
  const abilities = listHeroStartGameAbilities(args.hero);
  if (args.selectedCanonicalIds.length === 0) {
    return {
      remainingDeckCanonicalIds: [...args.deckCanonicalIds],
      placements: [],
    };
  }
  if (abilities.length === 0) {
    throw new Error(
      `Hero ${args.hero.canonicalId ?? args.hero.slug ?? "unknown"} has no start-game meta ability; cannot place ${args.selectedCanonicalIds.join(",")}`,
    );
  }

  const remaining = [...args.deckCanonicalIds];
  const placements: FabStartGamePlacement[] = [];
  const usedPerAbility = new Map<string, number>();

  for (const selectedId of args.selectedCanonicalIds) {
    const deckIndex = remaining.lastIndexOf(selectedId);
    if (deckIndex === -1) {
      throw new Error(
        `Start-game selection "${selectedId}" is not present in the starting deck (CR 4.1.5b).`,
      );
    }
    const def =
      args.cardDefinitions[selectedId] ??
      ({ canonicalId: selectedId, types: [] } satisfies FabCardDefinitionInput);
    const ability = abilities.find((candidate) => {
      const used = usedPerAbility.get(candidate.abilityId) ?? 0;
      if (used >= candidate.maxCount) return false;
      return definitionMatchesStartGameFilter(def, candidate.filter);
    });
    if (!ability) {
      throw new Error(
        `Start-game selection "${selectedId}" does not match any hero start-game filter (or ability max reached).`,
      );
    }
    usedPerAbility.set(ability.abilityId, (usedPerAbility.get(ability.abilityId) ?? 0) + 1);
    remaining.splice(deckIndex, 1);
    placements.push({
      canonicalId: selectedId,
      zone: destinationToFixtureZone(ability.to.zone),
    });
  }

  return { remainingDeckCanonicalIds: remaining, placements };
}

function destinationToFixtureZone(zone: FabZone): FabStartGamePlacement["zone"] {
  // Catalog destinations use "permanent"; engine seating places into arena.
  if (zone === "permanent") return "arena";
  if (zone === "graveyard") return "graveyard";
  if (zone === "banished") return "banished";
  if (zone === "arsenal") return "arsenal";
  if (zone === "hand") return "hand";
  if (zone === "pitch") return "pitch";
  throw new Error(`Start-game destination zone "${zone}" is not supported by seating yet.`);
}

/** Definition-level filter match for pre-game selections (no live object yet). */
export function definitionMatchesStartGameFilter(
  def: FabCardDefinitionInput,
  filter: FabCardFilter,
): boolean {
  const registered = registerFabCardDefinition(def);
  const base = basePropertiesOf(registered);
  const typeLine = [
    ...base.typeBox.metatypes,
    ...base.typeBox.supertypes,
    ...base.typeBox.types,
    ...base.typeBox.subtypes,
  ] as readonly string[];

  if (filter.name && !base.names.some((name) => normalize(name) === normalize(filter.name)))
    return false;
  const box = filter.typeBox;
  if (box?.types && !box.types.every((t) => typeLine.includes(t))) return false;
  if (box?.subtypes && !box.subtypes.every((t) => base.typeBox.subtypes.includes(t as never)))
    return false;
  if (box?.supertypes && !box.supertypes.every((t) => base.typeBox.supertypes.includes(t as never)))
    return false;
  if (filter.cost) {
    const cost = base.numeric.cost;
    const expected = typeof filter.cost.value === "number" ? filter.cost.value : undefined;
    if (
      cost === undefined ||
      expected === undefined ||
      !compareNumber(cost, filter.cost.op, expected)
    )
      return false;
  }
  if (filter.numeric) {
    for (const numeric of filter.numeric) {
      const value = base.numeric[numeric.property];
      const expected =
        typeof numeric.comparison.value === "number" ? numeric.comparison.value : undefined;
      if (
        value === undefined ||
        expected === undefined ||
        !compareNumber(value, numeric.comparison.op, expected)
      )
        return false;
    }
  }
  if (filter.and && !filter.and.every((child) => definitionMatchesStartGameFilter(def, child)))
    return false;
  if (filter.or && !filter.or.some((child) => definitionMatchesStartGameFilter(def, child)))
    return false;
  return true;
}

function compareNumber(value: number, op: string, expected: number): boolean {
  switch (op) {
    case "eq":
      return value === expected;
    case "neq":
      return value !== expected;
    case "lt":
      return value < expected;
    case "lte":
      return value <= expected;
    case "gt":
      return value > expected;
    case "gte":
      return value >= expected;
    default:
      return false;
  }
}

function normalize(text: string | null | undefined): string {
  return (text ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
