/**
 * CR §5 (Layers, Cards & Abilities) section-centric coverage ledger.
 *
 * Engine-type-centric inventories live elsewhere; this table is CR-section-
 * centric: one row per CR 5.x.y sub-rule, mapping each to the test that
 * replicates it (or explaining via `status` + `notes` why it is partial /
 * deferred / blocked). Completeness and locator validity are enforced by
 * `cr-section-5-coverage.test.ts`.
 *
 * `testLocator` values are paths relative to `packages/engine/src/rules/`
 * (the engine rules root), in `file#test-name` form. Cross-package locators
 * escape the engine package with a leading `../../../`.
 *
 * Citation: Flesh and Blood Comprehensive Rules §5 (rules.fabtcg.com/en/cr).
 */
export type CrSection5Status = "covered" | "partial" | "deferred" | "blocked";

export interface CrSection5CoverageRow {
  /** CR sub-rule, e.g. "5.1.2a". */
  readonly cr: string;
  readonly status: CrSection5Status;
  /** "file#test-name" — required for `covered`, optional otherwise. */
  readonly testLocator?: string;
  readonly notes?: string;
}

export const CR_SECTION_5_COVERAGE: readonly CrSection5CoverageRow[] = [
  // 5.1 Playing Cards
  {
    cr: "5.1.1",
    status: "covered",
    testLocator:
      "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.1: playing an attack action from hand",
  },
  {
    cr: "5.1.1a",
    status: "covered",
    testLocator:
      "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.1: attack may be played from arsenal",
  },
  {
    cr: "5.1.2",
    status: "covered",
    testLocator:
      "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.1: playing an attack action from hand",
  },
  {
    cr: "5.1.2a",
    status: "covered",
    testLocator: "card-behavior/proven/cr-section-5/cr-5-1-2a-become-the-cup.test.ts",
    notes:
      "three-effects-at-announce (cr-5-1-2a-announce-effects) and Become the Cup choose-color (cr-5-1-2a-become-the-cup) covered; the Goliath declared-X gate example is an open gap (see 5.1.3a)",
  },
  {
    cr: "5.1.2b",
    status: "covered",
    testLocator:
      "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.1.2b example: Tome of Torment",
  },
  {
    cr: "5.1.2c",
    status: "covered",
    testLocator:
      "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.1.2c example: Null||Shock",
    notes:
      "single-face declaration (Shock); meld (both-sides) covered in split-card-declaration.test.ts",
  },
  { cr: "5.1.3", status: "covered", testLocator: "play-procedure.test.ts" },
  {
    cr: "5.1.3a",
    status: "partial",
    notes:
      "OPEN GAP: declared X does not feed cost-gated future-applicability at announce (Goliath Gauntlet 'cost 2 or more' gate vs an X-cost attack, the printed CR 5.1.2a/5.1.3a example). chosenX lives only inside the play procedure; the appliesTo.next cost filter reads base/current numeric cost and fails closed on X-cost cards. The cr-section-5 lane had this wired (begin-play x field → announce declaredX); the port was superseded by the trunk merge.",
  },
  {
    cr: "5.1.3b",
    status: "covered",
    testLocator: "play-procedure.test.ts#random-discard additional cost",
  },
  {
    cr: "5.1.3c",
    status: "partial",
    notes:
      "OPEN GAP: alternative-cost selection is wired on the activate path only (activate.ts reads command.alternativeCostIndex — Golden Grail MPW007). The begin-play (play-from-hand) path rejects the field at the command schema, so printed play-alternatives like Moon Wish (ARC185 'put a card from your hand on top of your deck rather than pay') cannot declare their alternative. The cr-section-5 lane had begin-play wired; the port was superseded by the trunk merge.",
  },
  {
    cr: "5.1.3d",
    status: "covered",
    testLocator: "play-permission-selection.test.ts",
    notes:
      "Astral Etchings play-as-instant via the card's own asType:instant permission (condition-gated); Blasmophet once-per-turn blood-debt-from-banished covered in acceptance/heroes/blasmophet-levia-consumed.test.ts",
  },
  {
    cr: "5.1.3e",
    status: "deferred",
    notes:
      "single mandatory effect-cost ceiling kept as a guard; no printed card exercises multiple mandatory effect-costs (Blood on Her Hands is one destroy-cost + mode select)",
  },
  {
    cr: "5.1.4",
    status: "covered",
    testLocator:
      "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.1.4: Play-then-select target",
  },
  { cr: "5.1.4a", status: "covered", testLocator: "modal-abilities.test.ts" },
  { cr: "5.1.4b", status: "covered", testLocator: "active-attack-target.test.ts" },
  {
    cr: "5.1.5",
    status: "covered",
    testLocator: "play-procedure.test.ts#rejects an unpayable play",
  },
  {
    cr: "5.1.6",
    status: "covered",
    testLocator:
      "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.1 / 1.14: resource cost is paid",
  },
  {
    cr: "5.1.6a",
    status: "partial",
    notes: "additive cost order tested; set/multiply timestamp ordering on play-cost path untested",
  },
  { cr: "5.1.6b", status: "covered", testLocator: "play-procedure.test.ts" },
  {
    cr: "5.1.6c",
    status: "partial",
    notes:
      "base resource cost covered; alternative-cost-replaces-base on the play path depends on the open 5.1.3c begin-play gap",
  },
  {
    cr: "5.1.7",
    status: "covered",
    testLocator: "play-procedure.test.ts#pitches exactly one card per persisted decision",
  },
  {
    cr: "5.1.7a",
    status: "covered",
    testLocator: "play-procedure.test.ts#cancels a restored payment decision",
  },
  { cr: "5.1.8", status: "covered", testLocator: "play-variable-destroy-cost.test.ts" },
  { cr: "5.1.8a", status: "covered", testLocator: "play-variable-destroy-cost.test.ts" },
  { cr: "5.1.9", status: "covered", testLocator: "play-variable-destroy-cost.test.ts" },
  {
    cr: "5.1.9a",
    status: "deferred",
    notes:
      "replacement-modified unpayable effect-cost still allowing the play — no printed card exercises this niche interaction; deferred until a real card surfaces it",
  },
  {
    cr: "5.1.10",
    status: "covered",
    testLocator: "play-procedure.test.ts#atomically announces, pays, plays",
  },
  // 5.2 Activated Abilities
  { cr: "5.2.1", status: "covered", testLocator: "activation-procedure.test.ts" },
  { cr: "5.2.1a", status: "covered", testLocator: "activation-limit-modifiers.test.ts" },
  { cr: "5.2.1b", status: "covered", testLocator: "activation-procedure.test.ts" },
  { cr: "5.2.1c", status: "covered", testLocator: "activation-cost-modifier.test.ts" },
  { cr: "5.2.1d", status: "covered", testLocator: "activation-procedure.test.ts" },
  { cr: "5.2.1e", status: "covered", testLocator: "bravo-activated-abilities.test.ts" },
  {
    cr: "5.2.2",
    status: "covered",
    testLocator: "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.2.2 / 5.3",
  },
  {
    cr: "5.2.2a",
    status: "partial",
    testLocator: "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.2.2 / 5.3",
    notes:
      "activated-layer created; same-supertypes carried implicitly via source ref, not a per-layer type box",
  },
  { cr: "5.2.2b", status: "covered", testLocator: "activation-procedure.test.ts" },
  { cr: "5.2.3", status: "covered", testLocator: "activation-limit-modifiers.test.ts" },
  {
    cr: "5.2.3a",
    status: "covered",
    testLocator: "../../../cards/src/cards/actions/snap-shot.test.ts",
    notes:
      "Snap Shot 'activate bows an additional time and as though they were an instant' is granted through the trunk mechanism: modify-activation-limit emitted by resolutionWindowActivationLimitEvents (reconciler, hasStatus activate-additional-as-instant filter atom) with the timing + action-point waiver in activate-ability quote/begin (CR 8.1.1d)",
  },
  {
    cr: "5.2.3b",
    status: "covered",
    testLocator: "../../../cards/src/cards/actions/tri-shot.test.ts",
    notes:
      "Tri Shot's 'activate target bow you control 2 additional times this turn' covered by the card suite through modify-activation-limit (scope object-abilities, operation additional, count 2)",
  },
  {
    cr: "5.2.3c",
    status: "partial",
    testLocator: "../../../cards/src/cards/attack-reactions/twinning-blade.test.ts",
    notes: "Flurry example pending (Phase 2)",
  },
  {
    cr: "5.2.3d",
    status: "partial",
    notes:
      "OPEN GAP: the shared-pool spread example ('one ability thrice and the other once' — Barbed Castaway / CR 5.2.3d) has no end-to-end test on trunk; the underlying scope mechanics are covered by activation-limit-modifiers.test.ts",
  },
  {
    cr: "5.2.3e",
    status: "deferred",
    notes:
      "set-LIMIT (operation:set-total) is unit-tested in activation-limit-modifiers.test.ts; a Blood on Her Hands end-to-end test is deferred (disproportionate setup: Kassai specialization + Copper destroy-cost + multi-mode selection)",
  },
  {
    cr: "5.2.4",
    status: "covered",
    testLocator: "card-behavior/proven/cr-section-5/cr-5-2-4-functional-zones.test.ts",
    notes:
      "activation quote now consults ability.functionalZones (mirrors staticAbilityIsFunctional)",
  },
  {
    cr: "5.2.4a",
    status: "covered",
    testLocator:
      "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.2.2 / 5.3 (Vigorous Windup)",
  },
  {
    cr: "5.2.4b",
    status: "covered",
    testLocator: "card-behavior/proven/cr-section-5/cr-5-2-4b-publicity-transition.test.ts",
    notes: "invariant pin: hand→stack publicity change emits no trigger/replacement event",
  },
  // 5.3 Resolution Abilities & Resolving Layers
  {
    cr: "5.3.1",
    status: "covered",
    testLocator: "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.3.1",
  },
  {
    cr: "5.3.1a",
    status: "covered",
    testLocator: "docs/comprehensive-rules/05-layers-cards-abilities.test.ts#5.3 simplified",
  },
  { cr: "5.3.2", status: "covered", testLocator: "rules-stack-resolution.test.ts" },
  {
    cr: "5.3.2a",
    status: "covered",
    testLocator: "card-behavior/proven/keyword/keyword-phantasm.test.ts",
    notes:
      "phantasm intervening-if re-check at resolution covered by the keyword suite (CR 8.3.13a tests: defender power reduced below 6 before resolution → phantasm fails to resolve; boundary at 6+ still destroys)",
  },
  {
    cr: "5.3.2b",
    status: "deferred",
    testLocator: "docs/comprehensive-rules/07-combat.test.ts#under dominate",
    notes:
      "dominate fail-to-resolve covered; the non-dominate graceful-fail fix is identified (effect-event-proposals.ts defense-reaction no-link branch should move-zone→GY instead of unsupported) but the trigger scenario (a DR resolving after its chain link closed) is niche and hard to construct deterministically",
  },
  { cr: "5.3.3", status: "partial", notes: "permanents only; on-stack static unmodeled" },
  { cr: "5.3.4", status: "covered", testLocator: "rules-stack-resolution.test.ts" },
  { cr: "5.3.4a", status: "covered", testLocator: "rules-stack-resolution.test.ts" },
  { cr: "5.3.4b", status: "covered", testLocator: "rules-stack-resolution.test.ts" },
  {
    cr: "5.3.4c",
    status: "covered",
    testLocator: "card-behavior/proven/cr-section-5/cr-5-3-4c-lki-mid-resolve.test.ts",
    notes: "self-destroy mid-resolution + draw-via-LKI test (Task 3.3); LKI infra proven",
  },
  {
    cr: "5.3.4d",
    status: "covered",
    testLocator: "split-card-declaration.test.ts#resolves melded",
  },
  { cr: "5.3.5", status: "covered", testLocator: "rules-stack-resolution.test.ts#go again" },
  {
    cr: "5.3.5a",
    status: "covered",
    testLocator:
      "card-behavior/proven/equipment/equipment-snapdragon-scalers.test.ts#LKI: granted go again",
    notes:
      "Granted go-again is honored via attack LKI after an on-hit move removes the live source before Resolution; base go-again refund is covered by rules-stack-resolution.test.ts",
  },
  { cr: "5.3.6", status: "covered", testLocator: "rules-stack-resolution.test.ts#enter-arena" },
  { cr: "5.3.6a", status: "covered", testLocator: "rules-stack-resolution.test.ts#enter-arena" },
  { cr: "5.3.6b", status: "covered", testLocator: "rules-stack-resolution.test.ts" },
  { cr: "5.3.7", status: "covered", testLocator: "rules-stack-resolution.test.ts" },
  // 5.4 Static Abilities
  { cr: "5.4.1", status: "covered", testLocator: "continuous-effect-ir.test.ts" },
  { cr: "5.4.2", status: "covered", testLocator: "continuous-effect-ir.test.ts" },
  { cr: "5.4.3", status: "partial", notes: "start-game + token-seed only" },
  {
    cr: "5.4.3a",
    status: "deferred",
    notes:
      "Shiyana (CRU097) authored with the meta-static permission + copy mechanic tested (CRU097 card test); the deck-construction specialization-enforcement and ceases-to-exist legality-persistence are outside the match-runtime engine scope (deck registration concern)",
  },
  {
    cr: "5.4.4",
    status: "covered",
    testLocator:
      "card-behavior/proven/ability/ability-static-play-permission-self-referencing-from-banished.test.ts",
  },
  { cr: "5.4.4a", status: "covered", testLocator: "play-procedure.test.ts#additional cost" },
  {
    cr: "5.4.4b",
    status: "partial",
    notes:
      "play alternative-cost selection depends on the open 5.1.3c begin-play gap; activate-path selection is wired (Golden Grail)",
  },
  {
    cr: "5.4.4c",
    status: "partial",
    notes:
      "OPEN GAP: FabPlayModification.then is declared in @tcg/flesh-and-blood-types but nothing reads it on trunk — 'As an additional cost …, [COST]. When you do, [ABILITIES]' connected effects are unmodeled (cards currently use the Madcap-Muscle binding-matches workaround). The cr-section-5 lane wired it via proposeEffect in play finalize, gated on the play-effect-cost journal event; the port was superseded by the trunk merge.",
  },
  {
    cr: "5.4.4d",
    status: "deferred",
    notes:
      "depends on the open 5.4.4c gap (continuous-then 'If you do, [CONTINUOUS-EFFECT]' follows the same wiring); duration-default policy undecided until then",
  },
  {
    cr: "5.4.5",
    status: "covered",
    testLocator: "card-behavior/proven/cr-section-5/cr-5-4-5-mutated-mass.test.ts",
    notes:
      "Mutated Mass re-typed to two property-static abilities (Task 4.1); distinct-costs counter implemented",
  },
  {
    cr: "5.4.5a",
    status: "covered",
    testLocator: "card-behavior/proven/cr-section-5/cr-5-4-5-mutated-mass.test.ts",
    notes: "property-static functions anywhere — exercised by Mutated Mass re-type (Task 4.1)",
  },
  { cr: "5.4.6", status: "covered", testLocator: "trigger-matcher.test.ts" },
  {
    cr: "5.4.6a",
    status: "partial",
    notes:
      "OPEN GAP: triggered-layer collected via LKI when the source is destroyed by its own triggering event (Merciful Retribution destroyed in the same event as an aura) has no test on trunk; base trigger matching is covered by trigger-matcher.test.ts and the MON012 card suite",
  },
  {
    cr: "5.4.7",
    status: "covered",
    testLocator: "card-behavior/proven/cr-section-5/cr-5-4-7-yinti-yanti.test.ts",
    notes:
      "Yinti Yanti while-static test (Task 4.5); also fixed has-status generic defending/attacking branches (~25 cards unblocked)",
  },
  {
    cr: "5.4.7a",
    status: "covered",
    testLocator: "card-behavior/proven/keyword/keyword-blooddebt.test.ts",
  },
  {
    cr: "5.4.7b",
    status: "covered",
    testLocator: "../acceptance/heroes/the-librarian-mentor.test.ts",
    notes:
      "The Librarian (PSM002) — the CR 5.4.7b example — is authored (hidden triggered, functionalZones arsenal) and its face-up-at-start-of-turn behavior is covered; the general temp-public-then-revert mechanism (for non-permanent hidden triggers) is a separate enhancement",
  },
];
