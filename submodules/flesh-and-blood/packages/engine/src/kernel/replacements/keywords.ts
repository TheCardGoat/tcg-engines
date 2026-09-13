import type { FabStaticPreventionApplicationPolicy } from "../../rules/process.ts";

/**
 * Rules semantics for prevention keywords that are synthesized from an arena
 * object's current keyword list. This is deliberately independent of the
 * candidate id: ids identify a candidate for ordering/resumption, while this
 * policy defines whether that candidate is optional and what applying it does.
 */
export type StaticPreventionKeywordName =
  | "arcane-barrier"
  | "spellvoid"
  | "arcane-shelter"
  | "quell"
  | "ward"
  | "shadow-resist";

export type StaticPreventionKeywordPolicy = {
  readonly optional: boolean;
  readonly consumeOnUse: boolean;
  readonly application: FabStaticPreventionApplicationPolicy;
};

const STATIC_PREVENTION_KEYWORD_POLICIES: Readonly<
  Record<StaticPreventionKeywordName, StaticPreventionKeywordPolicy>
> = {
  "arcane-barrier": {
    optional: true,
    consumeOnUse: false,
    application: {
      kind: "static-keyword",
      keyword: "arcane-barrier",
      cost: "pay-resources",
      scheduleSourceDestroyAtEndPhase: false,
    },
  },
  spellvoid: {
    optional: true,
    consumeOnUse: true,
    application: { kind: "static-keyword", keyword: "spellvoid", cost: "destroy-source" },
  },
  "arcane-shelter": {
    optional: false,
    consumeOnUse: true,
    application: {
      kind: "static-keyword",
      keyword: "arcane-shelter",
      cost: "destroy-source",
    },
  },
  quell: {
    optional: true,
    consumeOnUse: false,
    application: {
      kind: "static-keyword",
      keyword: "quell",
      cost: "pay-resources",
      scheduleSourceDestroyAtEndPhase: true,
    },
  },
  ward: {
    optional: false,
    consumeOnUse: true,
    application: { kind: "static-keyword", keyword: "ward", cost: "destroy-source" },
  },
  "shadow-resist": {
    optional: true,
    consumeOnUse: true,
    application: { kind: "static-keyword", keyword: "shadow-resist", cost: "destroy-source" },
  },
};

export function staticPreventionKeywordPolicy(
  keyword: StaticPreventionKeywordName,
): StaticPreventionKeywordPolicy {
  return STATIC_PREVENTION_KEYWORD_POLICIES[keyword];
}
