/**
 * Closed authority list of every status marker the catalog uses as a READ —
 * in EITHER form: a has-status CONDITION (`status: "…"`) or a card-filter
 * predicate (`hasStatus: "…"`).
 *
 * Authoring splits true CR statuses (`FabAuthorableStatusMarker`) from
 * derived/legacy facts (`FabLegacyDerivedStatusMarker`). New modules must
 * typecheck against the authorable union only. Evaluation still accepts the
 * concatenated `FabStatusMarker` so grandfathered catalog reads keep working
 * while those modules migrate. Adding a new derived slug is a fail: it is
 * absent from both closed lists until someone enlarges the legacy list, and
 * the legacy snapshot/mandate must shrink, never grow.
 *
 * `set-status` WRITE targets are excluded — they stamp a marker onto an
 * object and are not conditions (`FabGrantableProperty.value` stays `string`).
 */

/** True CR object/player statuses that remain legal `has-status` reads. */
export const FAB_AUTHORABLE_STATUS_MARKERS = [
  "a-hero-has-more-life-than-all-other-heroes",
  "activate-additional-as-instant",
  "activated-ability",
  "alternative-cost-paid",
  "another",
  "arcane-damage-effect",
  "arcane-damage-effect-equal-to-x",
  "arcane-from-controller-sources",
  "attack-action-card-you-control",
  "attack-hit-this-chain-link",
  "attack-hits-you",
  "attack-reaction-played-or-activated-this-chain-link",
  "attacked-with-this",
  "attacking",
  "attacking-a-hero",
  "attacking-a-marked-hero",
  "attacking-a-royal-hero",
  "attacking-defending-or-on-the-stack",
  "attacking-hero-played-or-activated-this-chain-link-attack-reaction",
  "attacking-hero-played-or-activated-this-chain-link-reaction",
  "attacking-or-defending",
  "attacking-or-on-the-stack",
  "attacking-shadow-hero",
  "attacking-with-weapon-this-chain-link",
  "attacks-a-light-hero",
  "banished-another-card-with-same-color",
  "boosted",
  "card-defending-this",
  "card-with-cost-3-or-greater-card-in-pitch-zone",
  "charged-to-play",
  "chose-both",
  "chose-peace",
  "chose-war",
  "chosen-name",
  "controlled-by-a-guardian-hero",
  "controller-effect",
  "controller-of-it",
  "dealt-arcane-lt-bind-counters-on-self",
  "dealt-damage-to-hero",
  "deckbuilding-exception",
  "defended-attack-power-greater-than-base",
  "defended-by-action",
  "defended-by-attack-action",
  "defended-by-attack-action-card",
  "defended-by-brute",
  "defended-by-card-from-hand",
  "defended-by-card-with-equal-or-greater-power",
  "defended-by-fewer-than-2-cards",
  "defended-by-fewer-than-2-non-equipment-cards",
  "defended-by-guardian",
  "defended-by-revered",
  "defended-by-reviled",
  "defending",
  "defending-a-weapon-attack",
  "defending-an-attack-with-2-or-less-p",
  "defending-attack-action-card-with-cost-0",
  "defending-hero-has-cards-in-soul",
  "defends-attack-with-2-or-less-power",
  "defense-greater-than-attack-power",
  "didnt-hit",
  "different-name",
  "discarded-to-pay-cost-of-brute-attack-action-card",
  "during-your-action-phase",
  "equipped",
  "equipped-face-down",
  "face-down",
  "face-down-in-arsenal",
  "face-down-in-your-arsenal",
  "face-up",
  "face-up-in-any-zone",
  "face-up-in-arsenal",
  "first-action-of-your-turn",
  "fragmented",
  "from-action-card-effect",
  "from-boosting",
  "from-effects",
  "frozen",
  "fused",
  "fused-with-earth-card",
  "fused-with-ice-card",
  "fused-with-lightning-card",
  "greater-life-than-controller",
  "guessed-wrong",
  "hero-ability",
  "hero-is-pirate",
  "hero-is-royal",
  "hero-is-thief",
  "in-the-arena",
  "in-your-arsenal",
  "in-your-graveyard",
  "in-your-inventory",
  "intimidated",
  "last-attack-on-combat-chain-hit",
  "lethal",
  "lost-life-during-your-turn",
  "marked",
  "more-life-than-you",
  "named-card",
  "not-controlled-by-destroyer",
  "not-on-active-chain-link",
  "not-your-turn",
  "opponent-won-clash",
  "opposing-hero-has-cards-in-soul",
  "other-than-self",
  "other-than-source",
  "owned-by-controller",
  "pitch-has-card-with-power-greater-than-base",
  "pitched-attack-action-card-to-play-this",
  "pitched-attack-and-non-attack-action-to-play-this",
  "pitched-non-attack-action-card-to-play-this",
  "played-at-chain-link-3-or-higher",
  "played-at-chain-link-4-or-higher",
  "played-by-defending-hero",
  "played-card-or-activated-ability-this-reaction-step",
  "played-from-arsenal",
  "played-from-banished-zone",
  "played-from-hand",
  "played-or-activated-this-chain-link-attack-reaction",
  "power-greater-than-attack-defending",
  "power-greater-than-base",
  "power-greater-than-twice-base",
  "power-less-than-base",
  "revealed",
  "rune-gated",
  "same-hero-twice",
  "same-name-as-a-card-in-their-graveyard",
  "same-name-as-card-in-defending-heros-banished",
  "scrapped-hyper-driver",
  "self",
  "sharpened",
  "tapped",
  "target",
  "targeting-you",
  "targets-a-frozen-ally",
  "targets-a-guardian-hero",
  "targets-a-hero",
  "targets-arakni",
  "that-hero-is-arakni",
  "this-dealt-damage",
  "this-is-defending",
  "total-power-gte-13",
  "transformed-evo-is-hero",
  "untapped",
  "wagered",
  "won-clash",
  "yellow-card-in-pitch-zone",
  "attack-has-wagered",
  "under-this",
  "you-or-ally-you-control",
] as const;

/**
 * Derived facts that used to be authored as `has-status` slugs
 * (`*-this-turn`, `*-this-way`, `N-or-more-*`, `*-in-your-party`).
 * Evaluation may still delegate these; new catalog conditions must not.
 * This list is a shrinking grandfather, not a second blessed encoding.
 */
export const FAB_LEGACY_DERIVED_STATUS_MARKERS = [
  "a-weapon-you-control-has-hit-this-turn",
  "attack-controller-destroyed-agility-token-this-turn",
  "attack-controller-destroyed-might-token-this-turn",
  "attack-controller-destroyed-vigor-token-this-turn",
  "attack-controller-drawn-a-card-this-turn",
  "attack-fragmented-this-turn",
  "attacked-or-defended-with-attack-action-this-turn",
  "attacked-them-this-turn",
  "attacked-with-a-crouching-tiger-this-turn",
  "aura-with-holo-counter-entered-this-turn",
  "aura-you-control-was-destroyed-this-turn",
  "banished-by-intimidate-this-turn",
  "banished-earth-card-this-turn",
  "banished-from-hand-this-turn",
  "card-with-herald-in-its-name-put-into-soul-this-turn",
  "completed-a-contract-this-turn",
  "created-a-crouching-tiger-this-turn",
  "created-a-seismic-surge-this-turn",
  "created-or-activated-gate-to-iarathael-this-turn",
  "created-or-stolen-gold-this-turn",
  "created-or-stolen-gold-token-this-turn",
  "dealt-damage-to-you-this-turn",
  "dealt-or-been-dealt-physical-damage-this-turn",
  "defended-this-turn",
  "destroyed-a-lightning-flow-this-turn",
  "didnt-banish-this-way-card-with-6-or-more-p",
  "has-lost-life-this-turn",
  "last-action-card-played-this-turn-was-lightning",
  "last-attack-this-turn-hatchet-of-body",
  "last-attack-this-turn-hatchet-of-mind",
  "lost-life-this-turn",
  "no-sword-hit-this-turn",
  "revealed-power-greater-than-damage-dealt-this-turn",
  "sharpened-this-turn",
  "this-has-not-hit-this-turn",
  "weapon-sharpened-this-turn",
  "yellow-charged-this-way",
  "yellow-card-put-into-soul-this-turn",
] as const;

/** Evaluation union: authorable CR statuses plus grandfathered derived reads. */
export const FAB_STATUS_MARKERS = [
  ...FAB_AUTHORABLE_STATUS_MARKERS,
  ...FAB_LEGACY_DERIVED_STATUS_MARKERS,
] as const;

export type FabAuthorableStatusMarker = (typeof FAB_AUTHORABLE_STATUS_MARKERS)[number];
export type FabLegacyDerivedStatusMarker = (typeof FAB_LEGACY_DERIVED_STATUS_MARKERS)[number];

/**
 * The closed status-marker union used by evaluators. Includes the parametric
 * regex family `defending-on-chain-link-${number}-or-higher`, which
 * `evaluateHasStatus` matches via regex (not an exact table key).
 */
export type FabStatusMarker =
  | (typeof FAB_STATUS_MARKERS)[number]
  | `defending-on-chain-link-${number}-or-higher`;

const AUTHORABLE_STATUS_SET: ReadonlySet<string> = new Set(FAB_AUTHORABLE_STATUS_MARKERS);
const EVALUATION_STATUS_SET: ReadonlySet<string> = new Set(FAB_STATUS_MARKERS);

export function isAuthorableStatusMarker(marker: string): marker is FabAuthorableStatusMarker {
  return AUTHORABLE_STATUS_SET.has(marker);
}

export function isKnownStatusMarker(marker: string): marker is FabStatusMarker {
  return (
    EVALUATION_STATUS_SET.has(marker) || /^defending-on-chain-link-\d+-or-higher$/.test(marker)
  );
}

/** Authorable has-status condition. Derived-fact slugs do not assign. */
export type FabAuthorableHasStatusCondition = {
  type: "has-status";
  status: FabAuthorableStatusMarker;
};

/**
 * True when a const-inferred authoring tree contains a derived-fact
 * `has-status` / `hasStatus` slug. Depth-capped so named AST interfaces
 * (`FabCondition`) cannot recurse forever.
 */
export type HasDerivedStatusMarker<T, Depth extends 0[] = []> = Depth["length"] extends 8
  ? false
  : T extends { type: "has-status"; status: infer S }
    ? [S] extends [FabLegacyDerivedStatusMarker]
      ? true
      : false
    : T extends { hasStatus: infer S }
      ? [S] extends [FabLegacyDerivedStatusMarker]
        ? true
        : false
      : T extends readonly (infer U)[]
        ? HasDerivedStatusMarker<U, [...Depth, 0]>
        : T extends object
          ? true extends { [K in keyof T]: HasDerivedStatusMarker<T[K], [...Depth, 0]> }[keyof T]
            ? true
            : false
          : false;

/**
 * Derived-fact slugs are never authorable. The intersection is an error
 * brand so canonical card-authoring helpers reject them.
 */
export type AuthoringHasStatusConstraint<C> =
  HasDerivedStatusMarker<C> extends true
    ? {
        readonly __derivedHasStatusForbidden: "use performed-this-turn, compare-amount, last-attack-this-turn, or bindings";
      }
    : {};
