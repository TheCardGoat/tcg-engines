import type { FabAbilityType, FabCardFilter } from "@tcg/flesh-and-blood-types";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";

/**
 * Per-turn cap on restrict play/activate (ARC043 Red in the Ledger:
 * "can't play or activate more than 1 action during their next turn").
 *
 * A missing `limit` is a hard deny (Bait / freeze). With `limit`, the
 * restricted player may still perform matching plays and activations until
 * the combined this-turn count reaches the cap — play and activate share
 * one history so two sibling restrict leaves (Bait's shape) cannot be
 * spent independently.
 */
export function restrictCapReached(
  state: FabRulesSnapshot,
  actorId: string,
  rule: {
    readonly limit?: { readonly count: number };
    readonly filter: FabCardFilter | null;
  },
): boolean {
  if (!rule.limit) return true;
  const history = state.players[actorId]?.history.turn;
  if (!history) return false;
  const used =
    countMatchingTypeBox(history.actionCardPlaysThisTurn, rule.filter) +
    countMatchingActivations(history.actionActivationsThisTurn, rule.filter);
  return used >= rule.limit.count;
}

const ABILITY_TYPE_BOX_TYPE: Readonly<Record<FabAbilityType, string>> = {
  action: "Action",
  attack: "Action",
  instant: "Instant",
  "attack-reaction": "Attack Reaction",
  "defense-reaction": "Defense Reaction",
};

export function activationMatchesRestrictionFilter(
  entry: {
    readonly abilityType: FabAbilityType;
    readonly types: readonly string[];
    readonly subtypes: readonly string[];
    readonly supertypes: readonly string[];
  },
  filter: FabCardFilter | null,
): boolean {
  if (!filter) return true;
  const box = filter.typeBox;
  if (!box) return true;
  const abilityType = ABILITY_TYPE_BOX_TYPE[entry.abilityType];
  const source = new Set<string>([...entry.types, ...entry.subtypes, ...entry.supertypes]);
  const abilityTokens = new Set(["Action", "Instant", "Attack Reaction", "Defense Reaction"]);
  const matchesType = (token: string): boolean =>
    abilityTokens.has(token) ? token === abilityType : source.has(token);
  const required = [...(box.types ?? []), ...(box.subtypes ?? []), ...(box.supertypes ?? [])];
  if (required.some((token) => !matchesType(token))) return false;
  const excluded = [
    ...(box.excludeTypes ?? []),
    ...(box.excludeSubtypes ?? []),
    ...(box.excludeSupertypes ?? []),
  ];
  return !excluded.some(matchesType);
}

function countMatchingActivations(
  entries: readonly {
    readonly abilityType: FabAbilityType;
    readonly types: readonly string[];
    readonly subtypes: readonly string[];
    readonly supertypes: readonly string[];
  }[],
  filter: FabCardFilter | null,
): number {
  return entries.filter((entry) => activationMatchesRestrictionFilter(entry, filter)).length;
}

function countMatchingTypeBox(
  entries: readonly {
    readonly types: readonly string[];
    readonly subtypes: readonly string[];
    readonly supertypes: readonly string[];
  }[],
  filter: FabCardFilter | null,
): number {
  if (!filter) return entries.length;
  return entries.filter((entry) => historyMatchesTypeBox(entry, filter)).length;
}

function historyMatchesTypeBox(
  entry: {
    readonly types: readonly string[];
    readonly subtypes: readonly string[];
    readonly supertypes: readonly string[];
  },
  filter: FabCardFilter,
): boolean {
  const box = filter.typeBox;
  if (!box) return true;
  const haystack = new Set<string>([...entry.types, ...entry.subtypes, ...entry.supertypes]);
  const required = [...(box.types ?? []), ...(box.subtypes ?? []), ...(box.supertypes ?? [])];
  if (required.some((token) => !haystack.has(token))) return false;
  const excluded = [
    ...(box.excludeTypes ?? []),
    ...(box.excludeSubtypes ?? []),
    ...(box.excludeSupertypes ?? []),
  ];
  return !excluded.some((token) => haystack.has(token));
}
