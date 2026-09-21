# Card Release Audit

Living TODO ledger for auditing every authored card unit ahead of release. A unit is one
authored triple under `packages/cards/src/cards/<kind>/<slug>.{ts,.i18n.ts,.test.ts}` (pitch
families author all variants in one triple).

## How to work this ledger

- Regenerate the status columns with:
  `node packages/cards/scripts/audit-card-release-audit.mjs --write-docs`.
  Human `audited` marks come from content-addressed release evidence.
- Mark a unit `[x]` only after reviewing its definition, test (or documented
  exemption), and i18n row — not because the script is green: the script is the
  floor, the review is the audit.
- Fix issues at the root cause (shared primitive, generator, or pipeline) before
  marking units audited; never hand-patch a symptom across many rows.

Generated: `2026-08-30` · Script: `packages/cards/scripts/audit-card-release-audit.mjs`

## Summary

- Catalog: 5195 cards, 17182 printings, locales: en-US
- Authored units: 3321 · failing: 6 · with tests: 3300 · test-exempt: 27 · missing tests: 0 · i18n beyond en: 3
- Definitions authoring audit: green
- Localized translations (fab-cube per-language trees): de-DE: 3 cards · es-ES: 3 cards · fr-FR: 3 cards · it-IT: 3 cards (baseline: the 5195-card en-US catalog)

## Systemic findings & root-cause log

Issues are fixed globally (shared primitive, generator, or pipeline) before units are
marked audited. Each entry records the systemic finding and its root-cause resolution.

### 2026-08-31

- **Finding:** FAB Cube reports all three Comet Collision pitch variants as `Lightning Wizard Instant`, contradicting the printed `Lightning Wizard Action` type line. A generated-catalog-only correction would be reverted by the next catalog refresh.
- **Resolution:** Added canonical-ID metadata overrides to the catalog normalization pipeline for OMN109/OMN110/OMN111, with a regression covering the incorrect upstream payload. The generated catalog and authored action modules now remain stable across refreshes while upstream issue the-fab-cube/flesh-and-blood-cards#516 is open.

### 2026-08-29

- **Finding:** Authored i18n name/typeText drifted from the catalog (the printed-metadata source of truth) on 66 cards: 3 names (Tiger Form Incantation carried an unprinted colon), 63 typeTexts (dropped Draconic/Mystic talents, dropped the Disease metatype, missing " / " between hybrid classes, spurious "- Attack" on non-attack Actions).
- **Resolution:** Fixed at the root: 23 authored .i18n.ts files synced to the catalog; the audit now fails on any future i18n/name-drift or i18n/type-text-drift instead of trusting hand-copied strings.

### 2026-08-29

- **Finding:** Asset URLs are structurally absent from the i18n layer: catalog printings carry imageUrl/boardImageUrl per printing locale, but FleshAndBloodCardLocaleText/FleshAndBloodCardI18n expose no asset fields, so localized surfaces cannot resolve card art through i18n.
- **Resolution:** Implemented 2026-08-29: FleshAndBloodCardLocaleText/FleshAndBloodCardTranslation gained optional imageUrl/boardImageUrl; authoring/locale-assets.ts derives per-locale URLs from printings (default printing per locale, language fallback) and defaultTranslationsFromCatalog wires them into the translation catalog. Authored files stay URL-free; hand-authoring URLs across 3,226 files would re-create the drift this audit exists to prevent. Localized sources beyond en-US remain a source-data decision (finding below).

### 2026-08-29

- **Finding:** 317 units (353 printings across 20 sets: MPW 111, FAB 75, IAR 32, TNP 30, AOL 26, LGS 28, HER 19, JDG 19, ...) have empty imageUrl/boardImageUrl in the source catalog.
- **Resolution:** Data backlog owned by the art-asset pipeline (upstream fetch + CDN R2 sync), not card authoring; tracked here until ops fills the URLs, audit guards the tail.

### 2026-08-29

- **Finding:** 38 catalog cards carry no functionalTextPlain upstream (authored i18n consistently omits text for exactly those cards).
- **Resolution:** Verify those 38 against physical prints during review; the audit holds authored side in sync with the catalog either way.

### 2026-08-29

- **Finding:** 323 authored units lack a per-card .test.ts module (equipment 183, actions 47, weapons 22, tokens 16, events 9, blocks/attack-reactions 10 each, rest single digits).
- **Resolution:** Close via /fab-tests batches (real AAA scenarios per .agents/skills/fab-test-generation), lowest-value exemptions documented in TEST_EXEMPT_KINDS; never ship stringify/presence-only guards to shrink this number.

### 2026-08-29

- **Finding:** The only sourced catalog locale is en-US (tools/scraper hardcodes it), so "translations across languages" cannot be produced from current upstream data; the translation-catalog and i18n shapes already support additional locales.
- **Resolution:** Localization of additional languages is a source-data decision; when a localized source lands, this audit extends to per-locale sync the same way it guards en.

### 2026-08-30

- **Finding:** Authored i18n `text` vs catalog `functionalTextPlain`: the catalog string is a lossy machine normalization of the physical card ("Destroy this", contractions, "get go again", "2 Silver you control"); ~116 of 396 equipment texts differ from it cosmetically, including the model card achilles-accelerator.
- **Resolution:** Adjudication rule: authored i18n text matching the real printed card is the convention; mechanical guards enforce name/typeText drift only. Correct authored text ONLY when it contradicts both the catalog AND the authored ability AST / the real printed card (fixed: boots-to-the-boards missing "you may", barkbone-strapping "Roll a 6 die" typo, spoiled-skull "chose", viziertronic-model-i name). Normalization-only deltas are not defects.

### 2026-08-30

- **Finding:** Test closure (equipment/actions waves) fixed authored definition defects at the root: vigilant-dodgers activation gate lacked a player scope (defender could never satisfy "a weapon has attacked this turn"; fixed with player:"any") and embrace-sin used the unmigrated rule-modification allow-play shape the banished-zone legality gate rejects (re-authored to the migrated play-card permission, CR 1.8.5e).
- **Resolution:** Both fixed in the authored files with end-to-end suites; sweep sibling gates during review waves: any count-based activation gate without explicit player scope, and any remaining rule-modification allow-play clause, is suspect.

### 2026-08-30

- **Finding:** Engine testing token-registry omitted bladeDance, so every create-token: blade-dance failed with "created object token:blade-dance is absent from match program" (broke Jive/Gutshot/Off-Beat suites).
- **Resolution:** Registered the real Blade Dance token module in packages/engine/src/testing/token-registry.ts; created instances carry its printed destroy-on-weapon-attack + go-again behavior.

### 2026-08-30

- **Finding:** Test closure surfaced ~18 engine-primitive families that make specific printed legs unprovable end-to-end (recorded in card-coverage/gaps.json): play-card effect unmigrated (spoiled-skull, eternal-inferno), different-names filter ignoring printed names, sharpened control-object filter shadowing, second-activation ordinal discount, banish-observed power filter, optional play-card grants, wagered-state timing, nested optional never surfacing, bond grants dropped, sharpen destroyed-count, reorder-deck empty crash, no-zombie-attack-card, Blasmophet name filter, arena-ally-aura attack proxy, transcend without authored source, bare look without assertion surface, event-equipment may-equip inert (bloodied-boots/helm).
- **Resolution:** All recorded via the sanctioned --record-gap (never by weakening suites); rows whose headline clause is entirely unprovable stay unmarked until the family closes. Close via /fab-close-gaps.

### 2026-08-30

- **Finding:** Catalog pipeline outliers: Battle Prep cardKeywords says "Opt 1" while the authored keyword is opt(2) and the printed text says "Opt 2" (all pitch variants); the asset-URL backlog is larger than first recorded (544 printings across 20 sets on 317 units — earlier figure 353); 38 catalog cards carry no functionalTextPlain.
- **Resolution:** Battle Prep flagged for the catalog owner (authored side left as-is; AST and i18n agree). Ops reports compiled for the art-asset pipeline (upstream fetch + R2 sync; locale-assets.ts owns derivation). The 38 textless cards web-verified as a genuine textless class (vanilla attacks, Proto base equipment, resources; Lightning Flow suspect disproven via official release notes) — document the class and tripwire new no-text cards outside it.

### 2026-08-30

- **Finding:** Nine Smash Palace Event units still lacked .test.ts twins (arena-medic, benefactor-of-bloodworth-goldmane, big-hits-big-applause, didn-t-see-that-coming, dominate-the-competition, ez-sqeez-bookie-syndicate, hit-the-jackpot, rally-the-underdog, visit-the-winner-takes-all). 1v1 has no Event play/resolution primitive (begin-play rejects the card type); seated-in-arena idle/stringify twins would be filler.
- **Resolution:** Recorded family out-of-scope/event-in-1v1; added events to TEST_EXEMPT_KINDS. Do not invent Event-deck play in 1v1. Triggered Events that already have real play suites (e.g. Ire of the Crowd) keep them.

### 2026-08-30

- **Finding:** Edge Laden Plate activation closure briefly authored the engine storage marker hasStatus: sharpened-this-turn. The authoring mandate correctly rejects derived this-turn markers in card modules; authored conditions must name the semantic object status instead.
- **Resolution:** Root-cause: the authored condition filters Sword + hasStatus sharpened; the evaluator maps that semantic status to the CR 8.5.58 sharpen marker. The gameplay suite proves Instant destroy-for-{r} after a legal Hala sharpen and rejection without one; the full authoring mandate is green.

### 2026-08-30

- **Finding:** --strict treated catalog-only missing imageUrl/boardImageUrl as an authored failure (exit 1 with 317 asset units), blocking the release gate even when definition/i18n/tests were clean.
- **Resolution:** authoredSideOk ignores the assets dimension; --strict exits 0 when the only remaining family is missing-catalog-asset-urls. Full report.ok stays false until ops fills the URLs.

### 2026-08-30

- **Finding:** Twelve units stayed unmarked after review: Thick Hide Hunter was an AST contract; Overturn the Results pinned a clash-lose replacement that never registers; ten Event suites were seating/toMatchObject only.
- **Resolution:** Thick Hide Hunter rewritten to AAA attack-discard + defend-discard play. Unprovable units stay unmarked through the canonical open families in card-coverage/gaps.json, which the generator renders as recorded-gap notes rather than filler twins.

### 2026-08-30

- **Finding:** Legacy [x] marks were path-only assertions: a definition or AAA test could change after review while the generated ledger still appeared complete, and units newly assigned to an open gap could retain a misleading audited mark.
- **Resolution:** Release evidence is now content-addressed per unit (definition/i18n/test SHA-256 plus canonical-card coverage and review provenance). The consistency gate rejects stale hashes, malformed or ambiguous gap members, and evidence on open-gap units; reviewed refreshes are explicit named-unit mutations and open-gap reconciliation prunes whole authored families before docs regenerate.

### 2026-08-30

- **Finding:** Play-static authoring conflated restrictions with permissions. Conditions such as 'only if' and 'can only be played from arsenal' were compiled as allow rules, while play-card effects and alternate-timing permissions omitted their physical origin and could select an unintended source zone.
- **Resolution:** Restriction statics use role:condition and are enforced directly by the legality quote; play effects and genuine permissions declare exact fromZones. Hash-scattered review ran the affected AAA suites. The remaining Teklovossen case, where independent banished-origin and instant-timing permissions must compose, is retained as recorded gap engine/play-permission-composition.

### 2026-08-30

- **Finding:** Canonical unless effects with a discard escape assigned the decision to the ability controller and treated an empty opponent hand as an available escape. Cheap Shot's target could therefore answer the wrong prompt, and declining the escape had only been covered by a prohibited pin.
- **Resolution:** The layer decision walker now resolves discard availability from the declared target pool and assigns the optional to that target player. Cheap Shot AAA proves the target's discard branch, the no-boo/no-action-point boundary, and the boo-enabled instant line dealing 2 when the target declines.

### 2026-08-30

- **Finding:** Danse Macabre scoped its next grant to attacksOf the entered ally and also required the ally card to have subtype Attack. Ally attack sources do not acquire the Attack subtype, so the first attack never received go again even though the delayed end-phase destruction could stage.
- **Resolution:** Removed the redundant Attack-subtype filter and retained the exact attacksOf binding/count. Its real Dragon ally line now proves payment and tap, first-attack go again, end-phase destruction, and the declined-payment boundary; the former optional-pay gap is resolved.

### 2026-08-30

- **Finding:** An independent verification sweep of the marked rows exposed 19 red card tests across 18 files at the audited tip (A/B-proven committed, not WIP-induced). Mark of Lightning failed on a harness idiom: closeCombat({ optionals: "accept" }) invoked directly after defendWith never faces the equipment optional, which surfaces only after both players pass the defend step, so the accept was a no-op and destroy never ran — the engine was proven correct by scratch-definition variants isolating the origin filter, the attack binding-match, and the optional wrapper. The traps, Rune Gate from-banished, and tail suites flaked on the same mid-drain decision surfacing answered too late by the layer-resolution lookup.
- **Resolution:** Mark of Lightning fixed by draining both defend priorities before closeCombat (commit 7b6f1e285c); the layer-resolution side was fixed at the engine root in find-decision.ts (commit d793a4a408), after which all 18 files re-ran green (59/59) and the full cards suite passed. Lesson: when a printed clause is an optional fired on a combat event, drain the event's priority window before closing combat — optionals flags on untilIdle/closeCombat answer only decisions actually surfaced.

## Open issue families

- `assets/missing-catalog-asset-urls`: 6

## actions

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `actions/10-000-year-reunion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/a-bit-off-the-side` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/a-good-clean-fight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/absorption-dome` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/abyssal-bite` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/abyssal-force` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/abyssal-rush` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/acrid-stench` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/adrenaline-rush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-arc` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-dart` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-flare` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-hail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-icevein` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-quickening` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-sink` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/aether-slash` — recorded-gap `targeting/any-target-encoded-as-hero` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-spindle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aether-wildfire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aethersling` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aftershock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aggressive-pounce` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/agile-windup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/agility-stance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/all-in` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/alluring-inducement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/alpha-instinct` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/alpha-rampage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/already-dead` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amethyst-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amnesia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amplify-the-arknight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amplifying-arrow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-assertiveness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-earth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-echoes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-havencall` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-ice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-ignition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-intervention` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/amulet-of-oblation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ancestral-harmony` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/ancient-earth-oak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/and-again` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/angelic-attendant` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/angry-bones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/anka-drag-under` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/annexation-of-all-things-known` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/annexation-of-grandeur` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/annexation-of-the-forge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/annihilate-the-armed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/annihilator-engine` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/anthem-of-spring` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/apex-buster` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/apocalypse-automaton` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arc-bending` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arc-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arc-ramp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arcane-cussing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arcane-seeds-life` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arcane-twining` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arcanic-crackle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arcanic-cunning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arcanic-shockwave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arcanic-spike` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/arctic-incarceration` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/argh-smash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/arknight-ascendancy` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/arknight-descendancy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/art-of-desire-body` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/art-of-desire-mind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/art-of-desire-soul` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/art-of-the-dragon-blood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/art-of-the-dragon-claw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/art-of-the-dragon-fire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/art-of-the-dragon-scale` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aspect-of-tiger-body` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aspect-of-tiger-mind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/aspect-of-tiger-soul` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/assault-and-battery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/assembly-module` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/astral-ambience` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/astral-assault` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/astral-etchings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/astral-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/astravolt-elemental` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/attune-with-cosmic-vibrations` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/autosave-script` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/autumn-s-touch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/avast-ye` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/awakening-bellow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/back-alley-breakline` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/back-heel-kick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/back-stab` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/backspin-thrust` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/backup-protocol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bad-beats` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bad-breath` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ball-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bam-bam` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/banneret-of-courage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/banneret-of-gallantry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/banneret-of-protection` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/banneret-of-resilience` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/banneret-of-salvation` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/banneret-of-swordsmanship` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/banneret-of-vigor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/barbed-barrage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/barbed-undertow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bare-destruction` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bare-fangs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bare-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bark-obscenities` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/barnacle` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/barraging-beatdown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/barraging-big-horn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/barraging-brawnhide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bash-brute` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bash-guardian` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bask-in-your-own-greatness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/battalion-barque` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/batter-to-a-pulp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/battered-beaten-and-broken` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/battering-bolt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/battle-clearing-bellow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/battle-prep` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/battlefield-beacon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/battlefield-blitz` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/battlefield-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/battlefront-bastion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/be-like-water` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/beaming-bravado` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bear-hug` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/beast-mode` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/beast-within` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/beat-the-same-drum` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/beckoning-brilliance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/beckoning-hunger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/beckoning-light` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/become-the-arknight` — recorded-gap `harness/become-the-arknight-explicit-search` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/become-the-bottle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/become-the-cup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/become-the-shadow-lord` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/belittle` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/belly-buster` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/below-the-belt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bequest-the-vast-beyond` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/berserk` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/beseech-the-demigon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bet-big` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/big-bertha` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/big-bop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/big-bully` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/big-game-trophy-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/big-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/big-slick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bigger-than-big` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/billowing-mirage` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/billowing-mist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bingo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bios-update` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/biting-breeze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bittering-thorns` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blackout-kick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blade-rush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blanch` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/blasmophet-s-boon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blast-rig` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blast-to-oblivion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blaze-headlong` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blazing-aether` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bleed-out` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-aegis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-aether` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-bellona` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-deliverance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-focus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-ingenuity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-occult` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-patience` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-qi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-salvation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-savagery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-spirits` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/blessing-of-suraya` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-themis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blessing-of-vynserakai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blinding-of-the-old-ones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blink-of-an-eye` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blistering-assault` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/blizzard-bolt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blood-dripping-frenzy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blood-drop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blood-harvest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blood-line` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blood-on-her-hands` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blood-runs-deep` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/bloodfrenzy-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bloodrush-bellow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bloodsong-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bloodspill-invocation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blossoming-decay` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blossoming-spellblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blow-for-a-blow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/blue-fin-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bluff-catcher` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bluster-buff` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/board-the-ship` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bolt-n-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bolt-of-courage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bolting-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/bonded-burial` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bonds-of-agony` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bonds-of-ancestry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bonds-of-attraction` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bonds-of-memory` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/bone-mass` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bonebreaker-bellow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/boneyard-marauder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/boo-resident-spook` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/boom-grenade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/booze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/boulder-drop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bounding-demigon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bracken-rap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/brain-freeze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bramble-spark` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/brand-with-cinderclaw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/brandish` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/bravery-of-the-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/breach-flesh` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/break-ground` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/break-open-the-chests` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/break-stature` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/break-tide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/breaking-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/breakneck-battery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/breed-anger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bridge-of-damnation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/brimming-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/brothers-in-arms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/browbeat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/brutal-assault` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bubba-lubba-run-aground` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/buckle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/buckling-blow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/buckwild` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bull-bar` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/bully-tactics` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burdens-of-the-past` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burgeoning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burly-bones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burn-away` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burn-bare` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burn-rubber` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burn-them-all` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burn-up-shock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/burning-blade-dance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/buzz-bolt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/by-the-book` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cadaverous-contraband` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cadaverous-tilling` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/call-down-the-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/call-for-backup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/call-in-the-big-guns` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/call-to-the-grave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/captain-of-the-guard` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/captain-s-call` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/caress-of-the-reaper` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cartilage-crush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cash-in` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cash-out` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cast-bones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/catch-of-the-day` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/celestial-cataclysm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/censor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cerebellum-processor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chain-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chain-of-brutality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chains-of-eminence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chains-of-mephetis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/challenge-the-alpha` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-galcia-s-cradle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-iceloch-glaze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-lake-frigid` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-mount-heroic` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-mount-isen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-the-bleak-expanse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-the-millennium-tree` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-the-skybreaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-the-tranquil-domain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/channel-thunder-steppe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/charge-of-the-light-brigade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chart-a-course` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chart-the-high-seas` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chase-the-tail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cheap-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/cheating-scoundrel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/check-raise` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cheers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chest-puff` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/chill-to-the-bone` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chilling-icevein` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chokeslam` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chorus-of-rotwood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chorus-of-the-amphitheater` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chowder-hearty-cook` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/chum-friendly-first-mate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cindering-foresight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cinderskin-devotion` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/clambering-corpses` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/clamp-press` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/clap-em-in-irons` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/clarity-potion` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/clash-of-agility` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/clash-of-bravado` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/clash-of-might` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/clash-of-mountains` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/clash-of-vigor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cleansing-light` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/clear-conscience` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/clearing-bellow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/clearwater-elixir` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/cleave-the-heavens` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cleave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/clench-the-upper-hand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cloud-city-steamboat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cloud-skiff` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/coalescence-mirage` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/coax-a-commotion` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/codex-of-bloodrot` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/codex-of-frailty` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/codex-of-inertia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cog-in-the-machine` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cognition-nodes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cogwerx-dovetail` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/cogwerx-prong-bot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cogwerx-workshop` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/cogwerx-zeppelin` — recorded-gap `harness/authored-token-count-baseline` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cold-snap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cold-wave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/colors-of-aria` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/colossal-bearing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/combustible-courier` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/come-to-fight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/comeback-kid` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/comet-collision` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/comet-storm-shock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/command-and-conquer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/command-respect` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/commanding-performance` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/commit-to-corruption` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/companion-of-the-claw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/compounding-anger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/concoct-disorder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/concuss` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/condemn-to-slaughter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/conflicting-thoughts` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/conquer-the-icy-terrain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/conqueror-of-the-high-seas` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/consign-to-cosmos-shock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/construct-bank-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/construct-nitro-mechanoid` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/consuming-aftermath` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/consuming-appetite` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/consuming-command` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/consuming-lash` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/consuming-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/consuming-volition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/contest-the-mindfield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/convection-amplifier` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/convulsions-from-the-bellows-of-hell` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/copper-cog` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/corporeal-chasm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/corrupt-and-conquer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/corrupted-corpse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cosmic-awakening` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cosmic-duality` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/countdown-to-extinction` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/courageous-crossing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crackling` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crane-dance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cranial-crush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crankshaft` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crash-down-the-gates` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crash-down` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crash-site-salvage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crazy-brew` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/creep` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cries-of-encore` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crimson-waltz` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crippling-crush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/critical-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cross-the-line` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crouching-tiger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crowd-goes-wild` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cruel-ambition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crumble-to-eternity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crush-confidence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crush-the-weak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/crushing-headache` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cryptic-crossing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cull` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/cullingsong-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/current-funnel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-a-long-story-short` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-deep` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-down-to-size` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-from-the-same-cloth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-n-carve` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-off-at-the-knees` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-the-small-talk` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-through-the-facade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cut-through` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cutting-retort` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cutty-shark-quick-clip` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/cyclone-roundhouse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dabble-in-darkness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/daily-grind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dampen` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/darkest-hour` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dashing-flashfoot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/data-link` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dauntless` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dazzling-crescendo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dead-eye` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deadly-duo` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/deadly-spinneret` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deadwood-dirge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deadwood-rumbler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/death-touch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deathly-delight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deathly-duet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deathly-wail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deathmatch-arena` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/debilitate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deep-blue-sea` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deep-recesses-of-existence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deep-rooted-evil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/defang-the-dragon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/defender-of-daybreak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/demolition-crew` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/demolition-protocol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/demonbound-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/demonstrate-devotion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/deny-redemption` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/depths-of-despair` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/descendent-gustwave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/desires-of-flesh` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/destructive-aethertide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/destructive-deliberation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/destructive-fleetfoot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/devotion-never-dies` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/devouring-doomwake` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/diabolic-offering` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/diabolic-ultimatum` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/diamond-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/dig-for-souls` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dig-in` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dig-up-dinner` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dimenxxional-crossroads` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/dimenxxional-ferryman` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dimenxxional-gateway` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dimenxxional-vortex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/disable` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/disarm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/disembody` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/disenchantment-of-the-old-ones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dishonor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/disperse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/display-loyalty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dissipation-shield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dissolution-sphere` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/dissolve-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dissolving-shield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/distant-rumbling` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/disturb-the-peace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dive-through-data` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/divvy-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/doomsaying` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/double-down` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/double-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/double-trouble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/doubling-season` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/douse-in-runeblood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/down-and-dirty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/down-but-not-out` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dragon-power` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/draw-a-crowd` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/draw-back-the-hammer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/draw-swords` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/drawn-to-the-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/drawn-to-the-dark-dimension` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dread-screamer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dread-triptych` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/drill-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/drink-em-under-the-table` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/drinking-buddy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/driving-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/drone-of-brutality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/drop-the-anchor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/droplet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/drowning-dire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dry-powder-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dual-threat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dumpster-dive` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dunebreaker-cenipai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dusk-path-pilgrimage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dust-from-stillwater-shrine` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dust-from-the-chrome-caverns` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dust-from-the-fertile-fields` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dust-from-the-golden-plains` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dust-from-the-red-desert` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dust-from-the-shadow-crypts` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dust-runner-outlaw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/dustup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/duty-bound-blitz` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/earth-form` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/earth-s-embrace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/earthlore-empowerment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/earthlore-surge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ebbing-arcstride` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/eclectic-magnetism` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/edge-ahead` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/edict-of-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/electrify` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/electrolyze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/electryn-joltstep` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/electryn-mindmeld` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/elemental-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/eloquent-eulogy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/embalm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/embermaw-cenipai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/embolden` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/emboldened-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/embrace-sin` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/embrace-ursur` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/emerging-avalanche` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/emerging-dominance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/emerging-power` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/emeritus-scolding` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/emissary-of-moon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/emissary-of-tides` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/emissary-of-wind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/empowering-ruckus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/en-garde` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/enact-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/encase` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/enchanting-melody` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/encore` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/endless-arrow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/endless-maw` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/endless-winter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/energetic-impact` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/energy-of-the-audience` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/energy-potion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/enflame-the-firebrand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/engage-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/engaged-swiftblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/engulfing-flamewave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/engulfing-light` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/enigma-chimera` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/enion-surge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/enlightened-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/enshrine-sin` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/entangle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/entangling-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/entwine-earth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/entwine-ice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/entwine-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/envelop-in-darkness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/eradicate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/erase-face` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/erode-authority` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/escalate-order` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/escalate-violence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/essence-of-ancestry-body` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/essence-of-ancestry-mind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/essence-of-ancestry-soul` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/etchings-of-arcana` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/eternal-inferno` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/everbloom-life` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evergreen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-battery-pack` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-beta-base-arms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-beta-base-chest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-beta-base-head` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-beta-base-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-charging-rods` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-cogspitter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-command-center` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-data-mine` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-energy-matrix` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-engine-room` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-magneto` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-rapid-fire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-scatter-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-sentry-base-arms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-sentry-base-chest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-sentry-base-head` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-sentry-base-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-smoothbore` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-steel-soul-controller` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-steel-soul-memory` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-steel-soul-processor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-steel-soul-tower` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-tekloscope` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/evo-thruster` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/excessive-bloodloss` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/exorcism` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/expedite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/expedition-to-azuro-keys` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/expedition-to-blackwater-strait` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/expedition-to-dreadfall-reach` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/expedition-to-horizon-s-mantle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/exploding-aether` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/explosive-growth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/express-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/extinguish-the-flames` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/exude-confidence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fabric-of-blossoms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fabric-of-hope` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fabric-of-providence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fabric-of-scales` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fabric-of-spring` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fact-finding-mission` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/falcon-wing` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/fallen-herald` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/familiar-stench` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/familiar-story` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fast-and-furious` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fasting-carcass` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fatigue-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fault-line` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/favorable-winds` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fearless-confrontation` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/feasting-shadowbeast` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/feeding-frenzy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/feign-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/feisty-locals` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/felling-of-the-crown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/felling-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fender-bender` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/feral-instinct` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fervent-forerunner` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fight-dirty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fight-fair` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fight-from-behind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/final-act` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/find-center` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fire-in-the-hole` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fire-tenet-strike-first` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fire-that-burns-within` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/firebreathing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/first-tenet-of-chi-moon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/first-tenet-of-chi-tide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/first-tenet-of-chi-wind` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/fix-the-match` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flake-out` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flameborn-retribution` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flamecall-awakening` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flashfreeze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flatten-the-field` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fleece-the-frail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fletch-a-blue-tail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fletch-a-red-tail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fletch-a-yellow-tail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flex-claws` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flex-speed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flex-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flicker-wisp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flittering-charge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flittering-spike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flock-of-the-feather-walkers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flood-of-force` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flourish` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flowing-stormstrike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flowshard-elemental` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flowstate-embodiment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fluid-motion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flurry-stance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fluster-fist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flying-high` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/flying-kick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fog-down` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/for-the-dracai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/for-the-emperor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/for-the-realm` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/forbidden-harvest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/force-of-nature` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/force-sight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/foreboding-bolt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/forged-for-war` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/forked-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/forsaken-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/four-feathers-one-crown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fractal-creation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fractal-replication` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/frail-swingline` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fraying-lifeforce` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/frazzle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/freewheeling-renegades` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/freezing-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/frightmare` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/frontline-scout` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/frost-fang` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/frost-hex` — recorded-gap `engine/printed-arcane-resolution-fallback` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/frost-lock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/frosting` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/frozen-to-death` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fruits-of-the-forest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fuel-injector` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/full-of-bravado` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/full-tilt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fulminate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/funeral-moon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/fyendal-s-fighting-spirit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gallow-end-of-the-line` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gang-robbery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gas-guzzler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gas-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gaze-the-ages` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gear-turner` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gentle-breeze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/germinate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/geyser-of-seismic-stirrings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ghost-protocol-architect` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ghost-protocol-mainframe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ghostly-visit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gigawatt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/give-and-take` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/give-em-a-piece-of-your-mind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/give-no-quarter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/glacial-footsteps` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/glaring-impact` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/glide-through-starlight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/glistening-steelblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/glyph-destruction-nodes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/glyph-overlay` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/glyph-power-spell` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/goblet-of-bloodrun-wine` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gold-hunter-ketch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gold-hunter-lightsail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gold-hunter-longboat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gold-hunter-marauder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gold-the-tip` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/golden-skull` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/golden-skywarden` — recorded-gap `engine/continuous-locked-object-reset`<br>recorded-gap `engine/optional-repeat-continuation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/golden-tipple` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/goldfin-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/goldwing-turbine` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gone-in-a-flash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/good-deeds-don-t-go-unnoticed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/good-natured-brutality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/goon-battery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/goon-beatdown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/goon-tactics` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gore-belching` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/goremass-summoning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gorganian-tome` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/gorging-shadowbeast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gravekeeping` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/graveling-growl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/great-library-of-solana` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/grim-feast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/grind-them-down` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/grinding-gears` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/grow-claws` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/grow-wings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/growl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/gustwave-of-the-second-wind` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/gutshot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/haboob` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hack-to-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hadron-collider` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hamstring-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hand-behind-the-pen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/harbinger-of-destruction` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/harmony-of-the-hunt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/harness-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/harvest-season` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/haunting-specter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/haze-bending` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/head-jab` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/head-leads-the-tail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/head-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/headbutt` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/heads-up` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/headstrong-stampede` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/healing-balm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/healing-potion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heart-wrencher` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heartbeat-of-candlehold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heat-seeker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heave-ho` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heaven-s-claws` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heavy-artillery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heavy-metal-hardcore` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heavy-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hellbound-assault` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hemorrhage-bore` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-erudition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-judgment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-protection` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-ravages` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-rebirth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-sekem` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-tenacity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-triumph` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/herald-of-victoria` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heroic-grit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heroic-pose` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/heron-s-flight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/high-current-currency` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/high-octane` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/high-pitched-howl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/high-roller` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/high-speed-impact` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/high-striker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hit-and-run` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hit-the-gas` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hit-the-high-notes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hms-barracuda` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hms-kraken` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hms-marlin` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hocus-pocus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hold-em` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/honed-for-honor` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/hoodwink` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hook` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/horrors-of-the-past` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hostile-encroachment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hot-on-their-heels` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/howl-from-beyond` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hulk-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/humble-entrance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/humble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hundred-winds` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hungering-demigon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hungering-slaughterbeast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hunt-a-killer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hunt-the-hunter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hunt-to-the-ends-of-rathe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hurl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hurricane-technique` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hydraulic-press` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hyper-driver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hyper-inflation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hyper-scrapper` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/hypothermia` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/ice-aged-oak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ice-bolt` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/ice-eternal` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/ice-quake` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/ice-storm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/icebind` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/icy-encounter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ignite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/illuminate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/immobilizing-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/impenetrable-belief` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/imperial-edict` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/imperial-ledger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/imperial-seal-of-command` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/imperial-warhorn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/imposing-visage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/impulsive-desire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/increase-the-tension` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/indefensibly-honed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/index` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/induction-chamber` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/infect` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/infecting-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/infectious-host` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/infiltrate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/inflame` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/infuse-alloy` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/infuse-titanium` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ingest-the-unknown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/insidious-chill` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/inspire-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/instill-fear` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/insult-to-injury` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/intoxicating-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invigorate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invigorating-light` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-azvolai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-cromai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-dominia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-dracona-optimai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-kyloria` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-miragai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-nekria` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-ouvia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-suraya` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-themai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-tomeltai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-vynserakai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/invoke-yendurai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ironsong-determination` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/isenhowl-weathervane` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/isolate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/jack-be-nimble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/jack-be-quick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/jack-o-lantern` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/jaws-of-victory` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/jittery-bones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/jive` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/jolly-bludger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/judge-jury-executioner` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/jump-start` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/junkyard-dogg` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/kelpie-tangled-mess` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/kick-the-hornet-s-nest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/king-kraken-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/king-shark-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/kiss-of-death` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/knick-knack-bric-a-brac` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/knife-through-butter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/knife-through` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/knock-em-off-their-feet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/korshem-crossroad-of-elements` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/lace-with-bloodrot` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/lace-with-frailty` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/lace-with-inertia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/laden-with-earth` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/laden-with-frost` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/laden-with-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/last-ditch-effort` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lava-burst` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lava-vein-loyalty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lay-down-the-challenge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lay-down-the-law` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lay-to-rest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lay-waste` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lead-the-charge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lead-with-heart` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lead-with-power` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lead-with-speed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/leave-a-dent` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/leave-em-speechless` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/leave-no-witnesses` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/leech-memory` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/leech-renown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/leech-vitality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/leg-tap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lesson-in-lava` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/levels-of-enlightenment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/life-for-a-life` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/life-of-the-party` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/light-it-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/light-the-way` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/light-up-the-leaves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lighten-the-load` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lightning-form` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lightning-overload` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lightning-surge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/limpit-hop-a-long` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/line-it-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/line` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/liquid-cooled-mayhem` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/little-big-foot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/loan-shark` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lobotomy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/locked-and-loaded` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/log-fall` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/long-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/look-tuff` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/look-within` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/looking-for-a-scrap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/looming-doom` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/loot-the-arsenal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/loot-the-hold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lord-of-wind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lost-in-thought` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/low-blow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lumina-ascension` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lunar-mirage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/lunartide-plunderer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/machinations-of-dominion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/macho-grande` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/madcap-charger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/madcap-muscle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mage-hunter-arrow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/malefic-incantation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/malign` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/malignant-migration` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/man-overboard` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mangle` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/manifest-muscle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/march-of-loyalty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mark-of-the-beast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mark-of-the-black-widow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mark-of-the-funnel-web` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mark-the-prey` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mark-with-magma` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/massacre` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mauling-qi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mauvrion-skies` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/maximum-velocity` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/meat-and-greet` — recorded-gap `amount/damage-recipient-provenance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mechanical-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/medkit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/meet-madness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/meganetic-lockwave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/meganetic-protocol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/meganetic-shockwave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/melting-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mercurial-skies` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/meteoric-impact` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/meteoric-rise` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/metex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mhz-script` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/micro-processor` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/midas-touch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mighty-windup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mind-meets-might` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mind-s-desire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mind-warp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mindstate-of-tiger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mini-forcefield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/minnowism` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/miraging-metamorph` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mischievous-meeps` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mist-hunter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mocking-blow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/money-or-your-life` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/money-where-ya-mouth-is` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/monkey-powder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/monolith-of-galcia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/moon-wish` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/moonshot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/moray-le-fay` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/mordred-tide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mounting-anger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mugenshi-release` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mulch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/murderous-rabble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/murkmire-grapnel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/murky-water` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/murmur-of-i-arathael` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/murmuring-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/muscle-mutt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mutated-mass` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mutiny-on-the-battalion-barque` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mutiny-on-the-nimbus-sovereign` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/mutiny-on-the-swiftwater` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/mutual-sacrifice` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/mutually-assured-destruction` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nasty-surprise` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nature-s-path-pilgrimage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nebula-duality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nerves-of-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nettling-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/never-yield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nimble-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nimblism` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nimby` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ninth-blade-of-the-blood-oath` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nix-the-nimble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/no-hero-stands-alone` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/no-tall-tales` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nock-the-deathwhistle` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/northern-winds` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nourishing-emptiness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/nucleus-aetherbolt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/null-time-zone` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/numbskull` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/oaken-old` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/oath-of-loyalty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/oath-of-oak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/oath-of-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/oath-of-the-arknight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/odds-on-favorite` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/off-beat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/off-cuts` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/offensive-behavior` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/old-favorite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/old-leather-and-vim` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/ominous-toll` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/on-a-knife-edge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/one-two-punch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/onyx-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/opal-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/open-the-center` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/open-the-flood-gates` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/open-the-gate-to-i-arathael` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/optekal-monocle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/orb-weaver-spinneret` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/otherworldly-ossuary` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/otherworldly-sins` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/out-muscle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/out-pace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/outed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/outland-skirmish` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/outside-interference` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/over-flex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/over-loop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/over-the-top` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/overbear` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/overblast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/overcharge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/overcrowded` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/overflow-the-aetherwell` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/overload-script` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/overload` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/overswing` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/overturn-the-results` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/oysten-heart-of-gold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pack-call` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pack-hunt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/paddle-faster` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pain-in-the-backside` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/painful-passage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/painful-premonition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/palantir-aeronought` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/panel-beater` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/passing-mirage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/path-of-same-ends` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pathing-helix` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pay-day` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pay-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/payload` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/peaceful-sanctuary` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/peak-power` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pearl-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pec-perfect` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pedal-to-the-metal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/penetration-script` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/perennial-aetherbloom` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/performance-bonus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/perk-up` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/permanent-interment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/persuasive-prognosis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phantasmaclasm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phantasmal-haze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phantasmal-symbiosis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phantasmify` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phoenix-bannerman-arms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phoenix-bannerman-chest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phoenix-bannerman-head` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phoenix-bannerman-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phoenix-flame` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/phoenix-form` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/photon-rush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/photon-splicing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pick-a-card-any-card` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pick-to-pieces` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pick-up-the-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pierce-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/piercing-shadow-vise` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pilfer-the-wreck` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pint-of-strong-and-stout` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plan-for-the-worst` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/planar-chaos` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plasma-mainline` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plasma-purifier` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/platinum-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plow-through` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plow-under` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plunder-run` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plunder-the-poor` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/plundersong-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plunge-the-prospect` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/plunge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/point-of-engagement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/point-the-tip` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/poison-the-tips` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/poisoned-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/polar-blast` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/polar-cap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/polarity-reversal-script` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/polarus-pulse-ray` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pop-the-bubble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/portside-exchange` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/potion-of-d-j-vu` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/potion-of-ironhide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/potion-of-luck` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/potion-of-seeing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/potion-of-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pounamu-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pouncing-qi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pound-for-pound` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pound-of-flesh` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pound-town` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pounding-gale` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pour-the-mold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/powder-keg` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/power-of-make-believe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/power-play` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/power-stance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/prayer-of-bellona` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/preach-modesty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/precision-press` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/predatory-assault` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/predatory-streak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/premeditate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/prey-on-insecurity` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/prime-the-crowd` — recorded-gap `mechanic/crowd-cheers-resolution` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/primed-to-fight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/primeval-bellow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/prismatic-lens` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/prismatic-leyline` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/prognosticate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/promise-of-plenty` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/promise-of-power` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/promising-terrain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/prophetic-quickstep` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/prowess-of-agility` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/prowl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/public-bounty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pull-from-beyond` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pulping` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pulse-of-candlehold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pulsewave-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pulsewave-protocol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pulsing-aether-life` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pulsing-cardia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pulverize` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/punch-above-your-weight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pursue-to-the-edge-of-oblivion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pursue-to-the-pits-of-despair` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pursuit-of-knowledge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/push-forward` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/push-the-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/put-em-in-their-place` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/put-on-ice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/putrid-stirrings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/pyroglyphic-protection` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/qi-unleashed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/quantum-processor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/quick-succession` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/quickening-sand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/quickfire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rage-specter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/raging-onslaught` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/raise-an-army` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/raise-blades` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rake-back` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rake-the-embers` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/rally-the-coast-guard` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rally-the-rearguard` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/rally-the-shadow-horde` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ram-raider` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ransack-and-raze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rapid-fire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rapturous-applause` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/ratchet-up` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rattle-bones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ravenous-rabble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rawhide-rumble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/razzle-dazzle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/re-charge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/read-the-glide-path` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/read-the-ripples` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/read-the-runes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ready-to-roll` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/reaper-s-call` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rebellious-rush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/reckless-arithmetic` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/reckless-charge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/reckless-stampede` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/recoil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/red-fin-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/red-hot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/red-in-the-ledger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/red-lure-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/reek-of-corruption` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/regain-composure` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/regicide` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/regrowth-shock` — recorded-gap `amount/damage-recipient-provenance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/regurgitating-slog` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/reincarnate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/reinforce-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rejuvenate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/release-the-tension` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/relentless-pursuit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/remember-the-mists` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/remorseless` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rend-flesh` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/renounce-grandeur` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/requiem-for-the-damned` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rest-before-battle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/restless-bones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/restless-cleric` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/restless-commander` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/restless-corporal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/restless-looter` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/restless-magister` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/restless-outlaw` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/restless-plowman` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/restless-quartermaster` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/restless-shieldmaiden` — recorded-gap `end-phase/blood-debt-decay-order` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/restless-steed` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/restless-templar` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/restvine-elixir` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/retrace-the-past` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rev-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/revel-in-runeblood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/reverberate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/revolting-gesture` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/riddle-with-regret` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ride-the-tailwind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ridge-rider-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rift-bind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rift-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rift-skitter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rifted-torment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rifting` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/riggermortis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/right-behind-you` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/righteous-cleansing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/riled-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ring-of-roses` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rip-off-the-top` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rip-through-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/ripple-away` — recorded-gap `engine/token-creator-owner-controller` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rise-from-the-ashes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rise-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rising-energy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rising-knee-thrust` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rising-power` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rising-resentment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rising-solartide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rising-speed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rising-tide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rites-of-earthlore` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rites-of-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/rites-of-nightfall` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rites-of-replenishment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/roar-of-the-tiger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rob-the-rich` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/rocktop-bellow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rockyard-rodeo` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/roiling-fissure` — recorded-gap `engine/optional-repeat-continuation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rolling-thunder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ronin-renegade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rotary-ram` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/rotten-remains` — recorded-gap `engine/continuous-locked-object-reset`<br>recorded-gap `engine/optional-repeat-continuation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rough-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rouse-the-ancients` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rousing-aether` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rowdy-locals` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rubble-raiser` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ruby-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rumble-grunting` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/rumbling-hunger` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/rumbling-of-i-arathael` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/run-roughshod` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rune-flash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rune-snare` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/runeblood-barrier` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/runeblood-incantation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/runerager-swarm` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/runic-disposition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/runic-fellingsong` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/runic-reaping` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/runic-reaving` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/runic-reckoning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/runic-reclamation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/runner-runner` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/rush-of-knowledge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rush-of-power` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rushing-river` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rusted-relic` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/rusty-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sack-the-shifty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sadistic-scowl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/salt-the-wound` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/saltwater-swell` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/salvage-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sand-sketched-plan` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sapphire-amulet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sapwood-elixir` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/satiate-bloodthirst` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/savage-beatdown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/savage-feast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/savage-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/savor-bloodshed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sawbones-dock-hand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scalding-rain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scar-for-a-scar` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scarf-for-a-scarf` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scattering-conflux` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scooba-salty-sea-dog` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scour-the-battlescape` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scour` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scout-the-periphery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scouting-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scramble-pulse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scrap-compactor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scrap-harvester` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scrap-hopper` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scrap-prospector` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scrap-trader` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scrub-the-deck` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/scuttle-the-canal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sea-floor-salvage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sea-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/searing-ray` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/searing-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/searing-touch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/second-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/second-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/second-tenet-of-chi-moon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/second-tenet-of-chi-tide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/second-tenet-of-chi-wind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/security-script` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/sedate` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/sedation-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seeds-of-agony` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seeds-of-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seek-and-destroy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seek-enlightenment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seek-horizon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seek-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seeping-shadows` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seismic-shelter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seismic-shift` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/seismic-stir` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/send-packing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sense-weakness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/serpent-s-kiss` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/settle-the-bill` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shaden-death-hydra` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shaden-scream` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shaden-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shadow-of-blasmophet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shadow-of-ursur` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shadow-puppetry` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/shadowake-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/shadowrealm-bloodhound` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shadowrealm-harrower` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shadowrealm-harvester` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shadowrealm-horror` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shadowrealm-reaper` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/shadowrealm-ripper` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/shadowrealm-solace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shadowrealm-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/shadowrealm-swiftness` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/shadowrealm-walker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shake-down` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shallow-water-shark-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shapeless-form` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sharp-incline` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sharp-n-shine` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sharpen-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sharpened-senses` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shatter-the-weakpoint` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shattering-flowtide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shattering-stardust` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shelly-hardened-traveler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shifting-tides` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shifting-winds-of-the-mystic-beast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shimmering-specter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shimmers-of-silver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shitty-xmas-present` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shock-striker` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/shoot-your-mouth-off` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/short-shrift` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/show-no-mercy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/show-of-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/show-time` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/showdown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shrill-of-skullform` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/shuck` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sic-em-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sift` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-cycles` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-deadwood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-earth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-fyendal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-gravespawning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-protection` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-silphidae` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-solitude` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sigil-of-the-arknight` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/sigil-of-the-muse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/signal-jammer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/silver-talons` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/silver-the-tip` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/silverwind-shuriken` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/singe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/singeing-flowstride` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/singeing-steelblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/single-minded-determination` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/singularity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sinker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sinspeaker-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sirens-of-safe-harbor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sizzle` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/skeletal-puppetry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/skittering-sands` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/skull-crack` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sky-fire-lanterns` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sky-skimmer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/skybound-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/skyward-serenade` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/skywarden-no-161803` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/skyzyk` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/slay-the-scholars` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sleep-dart` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/slice-and-dice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/slithering-shadowpede` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sloggism` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smack-of-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/small-problem` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smash-and-grab` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smash-instinct` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smash-up` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/smash-with-big-rock` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smash-with-big-tree` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smashback-alehorn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smashing-good-time` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smashing-ground` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smashing-performance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smell-fear` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/smelting-of-the-old-ones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/snap-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/snapback` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/snarky-prick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/snatch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sneak-attack` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/snow-under` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/snuff-out` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soaring-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/solitary-companion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sonata-arcanix` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/sonata-dystopia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sonata-fantasmia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sonata-galaxia` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/song-of-jack-be-quick` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/song-of-larinkmorth-white` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/song-of-sinew` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/song-of-sweet-nectar` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/song-of-the-rosen-matador` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/song-of-the-shining-knight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/song-of-the-wandering-mind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/song-of-yesteryears` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sonic-boom` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soul-bond-belief` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soul-butcher` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soul-cleaver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soul-food` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soul-harvest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soul-reaping` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soulbead-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sound-the-alarm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/soup-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sow-tomorrow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sowing-thorns` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spark-of-genius` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spark-spray` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spears-of-surreality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spectral-manifestations` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spectral-procession` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spectral-prowler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spectral-rider` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/speed-demon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spellbane-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spellblade-assault` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spellblade-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spew-obscenities` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spew-shadow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spill-blood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spillover` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spinal-crush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spinning-wheel-kick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spire-sniping` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/spirit-of-christmas` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spirit-of-eirina` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spirit-of-war` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/splatter-skull` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/splintering-deadwood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spoils-of-war` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spreading-flames` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/spreading-mist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spring-a-leak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spring-load` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/spring-tidings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sprocket-rocket` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sprout-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/spur-locked` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stab-wound` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stacked-in-your-favor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stadium-security` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stamp-authority` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/standing-order` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/standing-ovation` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/star-struck` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/starting-stake` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stasis-cell` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/static-shock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/steam-canister` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/steel-street-hoons` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/steel-to-the-dome` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/steelblade-supremacy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stellar-glide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/step-between` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/step-through-realms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sting-of-sorcery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stinging-sprite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stir-the-aetherwinds` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stir-the-wildwood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stoke-the-flames` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/stoke-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stone-rain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stonewall-confidence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stony-woottonhog` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/story-beats` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/strategic-planning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/strength-of-four-seasons` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/strength-of-sequoia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/strength-rules-all` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/strike-gold` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/strike-twice` — recorded-gap `amount/damage-recipient-provenance`<br>recorded-gap `targeting/any-target-encoded-as-hero` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/strong-wood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/strong-yield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/strongest-survive` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/stunning-swipe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/submerge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/succumb-to-temptation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/succumb-to-winter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/summer-s-fall` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sun-kiss` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/supercell` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/surface-shaking` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/surgical-extraction` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/surging-militia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/surging-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sutcliffe-s-research-notes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swabbie` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swarming-gloomveil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sweeping-blow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swell-tidings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swift-pickup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swift-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swiftwater-sloop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swindler-s-grift` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/swing-big` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swing-fist-think-later` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/swordmaster-s-path` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/sworn-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/system-failure` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/system-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/t-bone` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tag-the-target` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/take-aim` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/take-flight` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/take-that` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/take-the-bait` — recorded-gap `engine/token-creator-owner-controller` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/take-the-tempo` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/tales-of-adventure` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/talisman-of-balance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/talisman-of-cremation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/talisman-of-dousing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/talisman-of-featherfoot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/talisman-of-recompense` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/talisman-of-tithes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/talisman-of-warfare` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/talk-a-big-game` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tame-the-beastly-behavior` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tap-lessons-past` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tear-asunder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tear-down-the-idols` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tear-limb-from-limb` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tear-through-the-portal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tectonic-instability` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tectonic-rift` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/teeth-of-the-cog` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/teklo-core` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/teklo-pounder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/teklo-trebuchet-2000` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/teklovossen-s-workshop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tempest-aurora` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tempest-palm-gustwave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tempestuous-kiss` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tempt-over` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/ten-foot-tall-and-bulletproof` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tenacity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tentacular-toll` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/terminator-tank` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/terms-of-combat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/thaw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/the-golden-son` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/the-old-switcheroo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/the-weakest-link` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/thick-hide-hunter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/thiev-n-varmints` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/this-round-s-on-me` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/thistle-bloom-life` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/three-of-a-kind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/thrive` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/throttle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/throw-yourself-at-them` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/thump` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/thunder-quake` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/thunk` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tick-tock-clock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tidal-surge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tiger-form-incantation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tiger-swipe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tighten-the-screws` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tigrine-reflex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/time-flies-when-you-re-having-fun` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/timekeeper-s-whim` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/timesnap-potion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/timidity-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tip-off` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tip-the-barkeep` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tit-for-tat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-aeo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-aetherwind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-duplicity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-fyendal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-harvests` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-imperial-flame` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/tome-of-necrosis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-pandemonium` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-the-arknight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tome-of-torment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tongue-tied` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tooth-and-claw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/torque-tuned` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/torrent-of-tempo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tough-as-a-rok` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tough-old-wrench` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/tough-smashup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/towering-titan` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/toxicity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/trade-in` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/trailblazing-aether` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tranquil-passing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/transmogrify` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/trap-and-release` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tremor-of-i-arathael` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tri-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tribute-to-demolition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tribute-to-greater-power` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/tribute-to-the-legions-of-doom` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/trip-the-light-fantastic` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/trot-along` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/truce` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/turn-the-crowd-grateful` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/turn-the-crowd-hateful` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/turn-to-mindfire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/twin-drive` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/twin-twisters` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/twintek-charging-station` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/twist-and-turn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/two-steps-ahead` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/unbound-by-shadow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/under-loop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/under-the-trap-door` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/undercover-acquisition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/unexpected-backhand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/unhallowed-rites` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/united-we-stand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/unmake-the-underlings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/unsheathed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/untamed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/unwavering-resolve` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/unwinding-finality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/unworldly-bellow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/up-sticks-and-run` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/uplifting-performance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/uprising` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/urgent-delivery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/usurp-the-shadow-throne` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/v-for-valor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/v-of-the-vanguard` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/valiant-thrust` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vantage-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vantom-banshee` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vantom-wraith` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/veiled-intentions` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vela-flash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vengeance-never-rests` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vengeful-apparition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/venomback-fabric` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/verdant-tide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vexing-gloomblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vexing-malice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vigor-rush` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vigorous-roar` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/vigorous-smashup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vigorous-windup` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vile-inquisition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/villainous-pose` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/violent-gusto` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/vipox` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/virulent-touch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/visionary-of-orbits` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/visit-anvilheim` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/visit-goldmane-estate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/visit-the-blacksmith` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/visit-the-dawnsmith` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/visit-the-golden-anvil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/visit-the-imperial-forge` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/visit-the-prize-room` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/void-wraith` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/volatile-fluxor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/voltbound-duality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/voltic-bolt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/voltic-impact` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wage-agility` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wage-gold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wage-might` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wage-vigor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wailer-humperdinck` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/walk-in-my-shoes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/walk-the-plank` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wall-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wallop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wander-with-purpose` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/war-cry-of-themis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/war-machine` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/warmonger-s-diplomacy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/warmonger-s-recital` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/warrior-s-valor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wartune-herald` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/water-glow-lanterns` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/water-the-seeds` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/weave-earth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/weave-ice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/weave-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wee-wrecking-ball` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/whelming-gustwave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/whirling-mist-blossom` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/whisper-of-the-oracle` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/whispers-within` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/whittle-from-bone` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/who-s-the-tough-guy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/widespread-annihilation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/widespread-destruction` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/widespread-ruin` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/widowmaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wild-ride` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wind-chakra` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wind-up-the-crowd` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/winds-of-eternity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/winter-s-bite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/winter-s-grasp` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/wither` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `actions/withering-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wounded-bull` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wounding-blow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wrath-of-retribution` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wreck-havoc` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wrecker-romp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/wrecking-ball` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/writhing-beast-hulk` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/written-in-the-stars` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/yellow-fin-harpoon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/yinti-yanti` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/yo-ho-ho` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/zap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/zealous-belting` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/zero-to-fifty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/zero-to-sixty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/zipper-hit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `actions/zoom-in` | ✅ | ✅ | en | ✅ | ✅ |

## allies

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `allies/aegis-archangel-of-protection` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/avalon-archangel-of-rebirth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/azvolai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/bellona-archangel-of-war` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/cromai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/dominia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/dracona-optimai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/kyloria` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/metis-archangel-of-tenacity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/miragai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/nekria` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/ouvia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/sekem-archangel-of-ravages` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/suraya-archangel-of-erudition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/suraya-archangel-of-knowledge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/themai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/themis-archangel-of-judgment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/tomeltai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/victoria-archangel-of-triumph` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/vynserakai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `allies/yendurai` | ✅ | ✅ | en | ✅ | ✅ |

## attack-reactions

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `attack-reactions/affirm-loyalty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/agile-engagement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/ancestral-empowerment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/back-for-seconds` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/backside-of-the-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/beacon-of-victory` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/beat-of-the-ironsong` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/beckon-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/big-blinder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/biting-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/blade-flash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/blade-flurry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/blade-runner` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/blistering-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/blood-follows-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/brothers-of-flame` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/carve-up` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/chorus-of-ironsong` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/coercive-tendency` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/combustion-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/concealed-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/courageous-steelhand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/cut-the-deck` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/cut-to-the-chase` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/deadly-display` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/descend-into-madness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/dice-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/diced` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/display-of-artistry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/display-of-craftsmanship` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/donkey` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/downswing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/drawing-dead` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/dynastic-dedication` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/endear-devotion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/exposed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/fang-strike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/fatal-engagement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/fire-and-brimstone` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/fresh-from-the-forge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/gleam-of-the-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/glint-the-quicksilver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/gorgon-s-gaze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/hiss` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/hunt-s-end` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/imperial-intent` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/in-the-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/incision` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/intimate-inducement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/into-the-muck` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/ironsong-response` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/jagged-edge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/just-a-nick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/knives-out` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/legacy-of-ikaru` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/liquefy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/long-whisker-loyalty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/lumina-lance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/lunging-press` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/maul` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/night-s-embrace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/nip-at-the-heels` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/ol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/out-for-blood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/overpower` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/overwhelming-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/perforate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/point-of-escalation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/polished-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/provoke` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/pummel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/puncture` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/quicksilver-dance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/rapid-reflex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/razor-reflex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/razor-s-edge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/resounding-courage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/roaring-beam` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/rout` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/run-through` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/scalding-iron` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/scar-tissue` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/searing-gaze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/sharpening-sparks` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/shatter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/shift-the-tide-of-battle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/shimmer-of-the-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/short-and-sharp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/shove-off` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/shred` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/silverdrop-downpour` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/singing-steelblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/siren-s-call` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/sisters-of-fire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/sizzling-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/slice-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/slither` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/small-blinder` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/smoldering-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/spike-with-bloodrot` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/spike-with-frailty` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/spike-with-inertia` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `attack-reactions/spreading-plague` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/stabbing-pain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/stains-of-the-redback` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/stroke-of-foresight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/swordmaster-s-shine` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/take-a-stab` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/take-the-upper-hand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/take-up-the-mantle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/tarantula-toxin` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/throw-dagger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/thrust` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/tide-chakra` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/to-the-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/twinning-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/two-sides-to-the-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/unified-decree` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/up-the-ante` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/venomous-bite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/vigorous-engagement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/war-cry-of-bellona` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `attack-reactions/wide-blue-yonder` | ✅ | ✅ | en | ✅ | ✅ |

## blocks

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `blocks/a-moment-s-peace` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/asking-for-trouble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/blunten` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/boast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/canopy-shelter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/chivalry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/clash-of-arms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/clash-of-chests` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/clash-of-heads` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/clash-of-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/clash-of-shields` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/cognition-field` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/corpse-cover` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/crash-and-bash` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/crowd-control` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/dam-the-shadowake` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/darling-of-the-crowd` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/disdainful-delight` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/echoing-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/fiddler-s-green` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/firewall` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/gesture-of-goodwill` — recorded-gap `protect/protect-another-hero-1v1` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/haunting-rendition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/hearty-block` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/hoist-em-up` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/induce-panic` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/lost-in-transit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/mental-block` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/never-give-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/not-so-mighty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/not-so-tuff` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/on-the-horizon` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/pinion-sentry` — recorded-gap `harness/authored-token-count-baseline` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/return-fire` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/rise-to-the-challenge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/run-into-trouble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/sit` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/stand-tall` — recorded-gap `trigger/stand-tall-reaction-play-boost-never-declares` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/steal-victory` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/steel-street-enforcement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/sunken-treasure` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/teklonetic-force-field` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/test-of-agility` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/test-of-iron-grip` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/test-of-might` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/test-of-strength` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/test-of-vigor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/thwart` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/tiger-eye-reflex` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/trounce` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `blocks/truth-or-trickery` — recorded-gap `engine/optional-repeat-continuation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/turning-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/unforgetting-unforgiving` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/valahai-riven` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/wall-of-meat-and-muscle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `blocks/will-of-the-crowd` | ✅ | ✅ | en | ✅ | ✅ |

## companions

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `companions/polly-cranka` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `companions/sticky-fingers` | ✅ | ✅ | en | ✅ | ✅ |

## conditions

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `conditions/marked` | ✅ | ✅ | en | ✅ | — |

## defense-reactions

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `defense-reactions/absorb-in-aether` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/beneath-the-surface` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/big-blue-sky` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/biting-gale` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/blood-in-the-water` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/bloodrot-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/bone-barrier` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/boulder-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/buzzsaw-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/chain-reaction` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/collapsing-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/den-of-the-spider` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/dodge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/drag-down` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/emboldened-by-the-crowd` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/engulfing-shadows` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/evasive-leap` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/expendable-limbs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/fate-foreseen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/flic-flak` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/flicker-trick` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/flittering-forcefield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/flurry-foot-dance` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/frailty-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/frosthaven-sheath` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/golden-company` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/guardian-of-the-shadowrealm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/hold-the-line` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/hunted-or-hunter` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/hunter-or-hunted` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/inertia-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/lair-of-the-spider` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/lay-low` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/leaven-sheath` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/loyalty-beyond-the-grave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/mistborn-protector` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/pendulum-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/pitfall-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/pulse-of-isenloft` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/put-in-context` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/rainbow-goo-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/reckless-swing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/reduce-to-runechant` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/rise-above` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/rockslide-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/rootbound-carapace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/saving-grace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/shelter-from-the-storm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/shield-bash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/shield-wall` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/shimmering-mirage` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/sigil-of-parapets` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/sigil-of-permafrost` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/sigil-of-suffering` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/sink-below` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/smoke-out` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/solid-ground` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/soul-shield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/spike-pit-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/springboard-somersault` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/static-shelter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/staunch-response` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/steel-on-steel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/steelblade-shunt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/stormwind-sheath` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/take-cover` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/tarpit-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/territorial-domain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/that-all-you-got` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/tiger-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/toughen-up` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/tripwire-trap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/turn-timber` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/unmovable` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/unravel-aggression` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `defense-reactions/viral-diffusion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/wash-away` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/wax-off` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/wax-on` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `defense-reactions/weeping-battleground` | ✅ | ✅ | en | ✅ | ✅ |

## demi-heroes

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `demi-heroes/arakni-black-widow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `demi-heroes/arakni-funnel-web` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `demi-heroes/arakni-orb-weaver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `demi-heroes/arakni-redback` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `demi-heroes/arakni-tarantula` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `demi-heroes/arakni-trap-door` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `demi-heroes/blasmophet-levia-consumed` — recorded-gap `transform/blasmophet-legs-unreachable-post-transform` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `demi-heroes/levia-redeemed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `demi-heroes/teklovossen-the-mechropotent` | ✅ | ✅ | en | ✅ | ✅ |

## equipment

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `equipment/achilles-accelerator` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/adaptive-alpha-mold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/adaptive-dissolver` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/adaptive-plating` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/aether-bindings-of-the-third-age` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/aether-crackers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/aether-ironweave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/aetherstorm-wellingtons` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/alluvion-constellas` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/amethyst-tiara` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/anticipating-gaze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/apex-bonebreaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/appalling-bearers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/aqua-laps` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/aqua-seeing-shell` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/arcane-lantern` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/arcanite-fortress` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/arcanite-skullcap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/arousing-wave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/attention-grabbers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/aurum-aegis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/balance-of-justice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bandana-of-the-blue-beyond` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/barkbone-strapping` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/barkskin-of-the-millennium-tree` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/basalt-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/base-of-the-mountain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bastion-of-duty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bastion-of-unity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/beaten-trackers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/beckon-applause` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/beckoning-haunt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blackstone-greaves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blacktek-whisperers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blade-beckoner-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blade-beckoner-gauntlets` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blade-beckoner-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blade-beckoner-plating` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blade-cuff` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blazen-yoroi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blitz-kicks` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blood-drop-brocade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blood-scent` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blood-splattered-vest` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/bloodied-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bloodied-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/bloodied-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bloodied-oval` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/bloodied-shield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bloodied-strapping` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bloodsheath-skeleta` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bloodtorn-bodice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blossom-of-spring` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blue-sea-tricorn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/blunt-retort` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bolt-n-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bone-puppetry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bone-vizier` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/boneseer-skullcap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/boots-of-astral-sanctuary` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/boots-of-omnis-ward` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/boots-to-the-boards` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bracers-of-belief` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bracers-of-bellona-s-grace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/braveforge-bracers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/breaker-helm-protos` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/breaking-scales` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/breakwater-undertow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/breeze-rider-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bruised-leather` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/buccaneer-s-bounty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bull-s-eye-bracers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/bunker-beard` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/burnished-bunkerplate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/buzzard-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/calming-cloak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/calming-gesture` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cap-of-quick-thinking` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/captain-s-coat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/carrion-crown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/carrion-husk` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/celestial-kimono` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/circlet-of-eternal-end` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/civic-duty` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/civic-guide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/civic-peak` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/civic-steps` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/clip-flexor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cloak-of-darkness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/coat-of-allegiance` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/coat-of-frost` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cogwerx-base-arms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cogwerx-base-chest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cogwerx-base-head` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cogwerx-base-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cogwerx-tinker-rings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/comeback-kicks` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/compass-of-sunken-depths` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/concealed-nerve-gas` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/concealed-pathogen` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/concealed-sedative` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/conduit-of-frostburn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/confront-adversity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/constella-tiara` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/constella-waves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/coronet-peak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/corrupted-crown` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/courage-of-bladehold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cracker-jax` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crater-fist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/craterhoof` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crow-s-nest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crown-of-dichotomy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crown-of-dominion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crown-of-everbloom` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crown-of-frozen-thoughts` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crown-of-providence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crown-of-reflection` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/crown-of-seeds` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/cutting-couriers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/dance-of-darkness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/danger-digits` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/danse-macabre` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/dark-arcanite-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/dead-threads` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/dealer-s-grip` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/deep-blue` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/diadem-of-dreamstate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/diamond-hands` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/double-cross-strap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/dragonscaler-flight-path` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/dream-weavers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/driftwood-quiver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/drive-brake` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/duelist-gauntlets` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/dyadic-carapace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/dyed-silk-sleeves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/dynastic-diadem` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/earthlore-bounty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ebon-fold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/echo-casque` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/edge-laden-plate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/embrace-adversity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/embraforged-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/empyrean-rapture` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/enchanted-quiver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/enclosed-firemind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/face-adversity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/face-purgatory` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/fiddle-dee` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/fingers-of-fragmentation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/fish-fingers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/fist-pump` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/fisticuffs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/flamescale-furnace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/flash-of-brilliance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/flat-trackers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/fleet-foot-sandals` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/flick-knives` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/flight-path` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/fluttersteps` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/fortitude-of-anvilheim` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/four-finger-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/frontline-gauntlets` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/frontline-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/frontline-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/frontline-plating` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/fyendal-s-spring-tunic` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gallantry-gold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/galvanic-bender` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gambler-s-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/garland-of-spring` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gauntlet-of-boulderhold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gauntlet-of-might` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gauntlet-of-sword-and-sorcery` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gauntlets-of-iron-will` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gauntlets-of-the-boreal-domain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gauntlets-of-tyrannical-rex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gauntlets-of-unity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ghostly-touch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/glacial-horns` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/glidewell-fins` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/glory-plate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/glory-seeker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gloves-of-astral-sanctuary` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gloves-of-azure-waves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gloves-of-erasure` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/gold-baited-hook` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/golden-gait` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/golden-galea` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/golden-gauntlets` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/golden-glare` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/golden-heart-plate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/goliath-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/good-time-chapeau` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/grains-of-bloodspill` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/grandstand-legplates` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/grasp-of-darkness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/grasp-of-the-arknight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/grasp-of-the-darknight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/graven-cowl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/graven-gaslight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/graven-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/graven-justaucorpse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/graven-vestment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/graven-walkers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/grille-of-repentance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/grimoire-of-fellingsong` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/grimoire-of-the-haunt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/halo-of-illumination` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/halo-of-lumina-light` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hand-of-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hard-knuckle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/havoc-wrap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/head-stone` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/headliner-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/heart-of-bladehold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heart-of-ice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heart-of-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/heart-throb` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heartened-cross-strap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heat-wave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heavy-industry-gear-shift` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heavy-industry-power-plant` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heavy-industry-ram-stop` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heavy-industry-surveillance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heirloom-of-rabbit-hide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heirloom-of-snake-hide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/heirloom-of-tiger-hide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helio-s-mitre` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-astral-sanctuary` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-halo-s-grace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-hindsight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-isen-s-peak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-lignum-vitae` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-might-and-magic` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-safe-haven` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/helm-of-sharp-eye` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-the-adored` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-the-arknight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helm-of-unity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/helmsman-s-peak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hex-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hidden-agenda` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hide-tanner` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hoarding-of-denial` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hold-firm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hold-focus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/honing-hood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hood-of-red-sand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hood-of-second-thoughts` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/hooves-of-the-shadowbeast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hope-merchant-s-hood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hornet-s-sting` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/horns-of-the-despised` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hot-top` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/hyper-x3` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ink-lined-cloak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/inverter-s-nightcowl` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/iris-of-the-blossom` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironfist-revelation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironhide-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironhide-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironhide-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironhide-plate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironrot-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironrot-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironrot-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironrot-plate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ironsong-versus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/kabuto-of-imperial-authority` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/kimono-of-layered-lessons` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/knucklehead` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/koi-blessed-kimono` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/laced-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/laughing-knee-slappers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/leap-frog-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/leap-frog-leggings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/leap-frog-slime-skin` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/leap-frog-vocal-sac` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/light-fingers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/lightning-greaves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/limbs-of-lignum-vitae` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/line-crossers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/longdraw-half-glove` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/longsword-leggings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mage-master-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/magmatic-carapace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/magrar` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/mark-of-lightning` — recorded-gap `trigger/defend-attack-binding-inert` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-deceit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-malicious-manifestations` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-many-faces` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-momentum` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-perdition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-recurring-nightmares` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-shifting-perspectives` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/mask-of-the-pouncing-lynx` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/mask-of-the-swarming-claw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-three-tails` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mask-of-wizened-whiskers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mbrio-base-cortex` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mbrio-base-digits` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/mbrio-base-vizier` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mbrio-base-walkers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/meridian-pathway` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/metacarpus-node` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mightybone-knuckles` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/misfire-dampener` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/monstrous-veil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/mournful-casket` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/myrkhellir-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/new-horizon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/nitro-mechanoid` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/nom-de-plume` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/nullrune-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/nullrune-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/nullrune-hood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/nullrune-robe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/okana-scar-wraps` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/old-knocker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/olde-leather-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/olde-leather-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/olde-leather-helm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/olde-leather-plate` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/ollin-ice-cap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ornate-tessen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/overbearing-presence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/overcome-adversity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/paragon-plate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/parry-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/patch-the-hole` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/path-of-repentance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/path-of-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/peg-leg` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/perch-grapplers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/phantasmal-footsteps` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/pillar-of-unity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/pink-visor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/plate-of-tough-love` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/plating-of-unity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/plume-of-evergrowth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/plutonic-starplate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/popped-collar-polo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/pouncing-paws` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/predatory-plating` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/prey-spotters` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/prized-galea` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/prizeworn-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/prizeworn-pathfinders` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/prizeworn-plating` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/proclamation-of-abundance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/proclamation-of-combat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/proclamation-of-production` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/proclamation-of-requisition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/proto-base-arms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/proto-base-chest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/proto-base-head` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/proto-base-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/puffer-jacket` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/punching-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/quartermaster-s-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/quelling-robe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/quelling-sleeves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/quelling-slippers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/quick-clicks` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/quickdodge-flexors` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/quickstep` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/quiver-of-abyssal-depths` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/quiver-of-rustling-leaves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/radiant-flow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/radiant-raiment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/radiant-touch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/radiant-view` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ragamuffin-s-hat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/rage-baiters` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/rampart-of-the-ram-s-head` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/raw-meat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/reach-beyond-the-grave` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/reach-of-the-abyss` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/red-alert-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/red-alert-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/red-alert-vest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/red-alert-visor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/redback-shroud` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/refraction-bolters` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/reverent-rerebrace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/richter-scale` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/rippling-wave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/robe-of-astral-sanctuary` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/robe-of-autumn-s-fall` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/robe-of-rapture` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/robe-of-repentance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/robe-of-resourcefulness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/root-bound-trunks` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/rotten-old-buckler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/runaways` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/runebleed-robe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/runehold-release` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/rust-belt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sash-of-sandikai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/savage-sash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/scabskin-leathers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/scowling-flesh-bag` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/scuttle-toes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sealace-sarong` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/seasoned-saviour` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/seeker-s-gilet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/seeker-s-hood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/seeker-s-leggings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/seeker-s-mitts` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/shamanic-shinbones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sharp-shooters` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/shattering-grasp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sheltered-cove` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/shock-charmers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/shock-frock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/shriek-razors` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/shroud-of-darkness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/shroud-of-the-fate-watcher` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silent-stilettos` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silken-form` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silken-gi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silken-shawl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silken-shroud` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silken-slippers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silken-symphony` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silver-palms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silversheen-needle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/silverstride-dodgers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/skera-strapping` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/skull-crushers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/skullbone-crosswrap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/skullhorn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/skybody-keikoi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/skycrest-keikoi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/skyhold-keikoi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/skywalker-keikoi` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/smoldering-scales` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/snap-fingers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/snapdragon-scalers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/solar-plexus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/solforge-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/solray-plating` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/soulbond-resolve` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/spell-fray-cloak` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/spell-fray-gloves` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/spell-fray-leggings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/spell-fray-tiara` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/spellbound-creepers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/spellfire-cloak` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/spoiled-skull` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/squire-s-bracers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stadium-centerpiece` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/stalagmite-bastion-of-isenloft` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stalker-s-steps` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stand-ground` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stand-strong` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/starfield-carapace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/starfield-touch` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/starfield-veil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/starflow-robes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/starlight-striders` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/starting-point` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/steelbraid-buckler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stonewall-gauntlet` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stonewall-impasse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/storm-striders` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stormweaver-s-aegis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stride-of-reprisal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/strong-stomach-for-adversity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/stubby-hammerers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sunkwater-exoshell` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sunkwater-lookout` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sunkwater-pincers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sunkwater-scalers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/sutcliffe-s-suede-hides` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/swiftstrike-bracers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/synapse-sparkcap` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/talismanic-lens` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/target-totalizer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tearing-shuko` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tectonic-crust` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tectonic-plating` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/teklo-base-arms` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/teklo-base-chest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/teklo-base-head` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/teklo-base-legs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/teklo-foundry-heart` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tempest-dancers` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/templar-spellbane` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/testament-of-valahai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/third-eye-of-the-sphinx` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/threadbare-tunic` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tiara-of-suspense` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/ticket-puncher` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tide-flippers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tiger-stripe-shuko` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/time-skippers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/toby-jugs` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/topsy-turvy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/torc-of-vim` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/touch-of-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tough-leather-boots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/toxic-tips` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/trampling-trackers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/traverse-the-universe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tremor-of-resistance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tremorshield-sabatons` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/trench-of-sunken-treasure` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/trench-of-watery-depths` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/tricorn-of-saltwater-death` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/truths-retold` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/twelve-petal-k-ya` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/twinkle-toes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/two-faced` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/two-steps-forward` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/undead-grasp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/undertow-stilettos` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/unflinching-foothold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/unicycle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/unyielding-grip` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/uphold-tradition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/valiant-dynamo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/vambrace-of-determination` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/vest-of-the-first-fist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/vestige-of-flagellation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/vestige-of-sol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/vexing-quillhand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/vigilant-dodgers` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/vigor-girth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/virtuoso-bodice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/viziertronic-model-i` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/volcanic-vice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/voltic-vanguard` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/vow-of-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/warband-of-bellona` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/warpath-of-winged-grace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/washed-up-wave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/wave-of-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/waves-of-aqua-marine` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `equipment/wayfinder-s-crest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/well-grounded` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/widow-back-abdomen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/widow-claw-tarsus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/widow-veil-respirator` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/widow-web-crawler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/wind-cutter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `equipment/zap-clappers` | ✅ | ✅ | en | ✅ | ✅ |

## events

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | `events/air-of-a-comeback` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/arena-medic` — recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/benefactor-of-bloodworth-goldmane` — recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/big-hits-big-applause` — recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/code-of-conduct-kill-or-be-killed` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/crowd-roars-fight` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/crushing-impact` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/didn-t-see-that-coming` — recorded-gap `event-play-timing`<br>recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/dominate-the-competition` — recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/ez-sqeez-bookie-syndicate` — recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/fight-night-prize-purse` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/hit-the-jackpot` — recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [x] | `events/ire-of-the-crowd` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/let-me-buy-you-a-drink` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/lion-s-pounce` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/pick-yourself-up-off-the-floor` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/rally-the-underdog` — recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/random-events-unfold` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/the-moat-exchange` — recorded-gap `event-in-1v1` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/tremor-of-anticipation` | ✅ | ✅ | en | ✅ | — |
| [ ] | `events/visit-the-winner-takes-all` — recorded-gap `out-of-scope/event-in-1v1` | ✅ | ✅ | en | ✅ | — |

## heroes

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `heroes/arakni-5l-p3d-7hru-7h3-cr4x` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/arakni-huntsman` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/arakni-marionette` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/arakni-solitary-confinement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/arakni-web-of-deceit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/arakni` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/aurora-emissary-of-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/aurora-legacy-of-tempest` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/aurora-shooting-star` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/aurora` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/azalea-ace-in-the-hole` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/azalea` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/baalghor-omen-of-the-end` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/benji-the-piercing-wind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/betsy-skin-in-the-game` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/betsy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/blaze-firemind` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/bolfar-bear-hands` — recorded-gap `additional-hero-target-1v1` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/boltyn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/bravo-flattering-showman` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/bravo-showstopper` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/bravo-star-of-the-show` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/bravo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/brevant-civic-protector` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/briar-warden-of-thorns` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/briar` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/brutus-summa-rudis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/chane-bound-by-shadow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/chane` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/cindra-dracai-of-retribution` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/cindra` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dash-database` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dash-i-o` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dash-inventor-extraordinaire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/data-doll-mkii` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dorinthea-ironsong` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dorinthea-quicksilver-prodigy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dorinthea` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dr-mortimer-blight-of-the-pits` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dr-mortimer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dromai-ash-artist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/dromai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/emperor-dracai-of-aesir` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/enigma-ledger-of-ancestry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/enigma-new-moon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/enigma` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/fai-rising-rebellion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/fai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/fang-dracai-of-blades` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/fang` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/fightmaster-kox` — recorded-gap `event-deck-look-out-of-scope` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/florian-rotwood-harbinger` — recorded-gap `engine/token-creator-owner-controller` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/florian` — recorded-gap `engine/token-creator-owner-controller` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/frankie-make-ends-meat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/genis-wotchuneed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/gravy-bones-shipwrecked-looter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/gravy-bones` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/groundbreaker-crix` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/hala-bladesaint-of-the-vow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/hala` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/ira-crimson-haze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/ira-scarlet-revenger` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/iyslander-stormbind` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/iyslander` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/jarl-vetrei-i` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kano-dracai-of-aether` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kano` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/kassai-cintari-sellsword` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kassai-of-the-golden-sand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kassai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/katsu-the-wanderer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/katsu` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/kavdaen-trader-of-skins` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kayo-armed-and-dangerous` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kayo-berserker-runt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kayo-strong-arm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kayo-underhanded-cheat` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/kayo` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/killjoy-the-crooked-blade` — recorded-gap `attack/additional-hero-target-1v1` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/levia-shadowborn-abomination` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/levia` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/lexi-livewire` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/lexi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/lyath-goldmane-vile-savant` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/lyath-goldmane` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/malice-domina-of-the-dead` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/malice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/marlynn-treasure-hunter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/marlynn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/maxx-nitro` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/maxx-the-hype-nitro` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/melody-sing-along` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/nuu-alluring-desire` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/nuu` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/oldhim-grandfather-of-eternity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/oldhim` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/olympia-prized-fighter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/olympia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/oscilio-constella-intelligence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/oscilio-forked-continuum` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/oscilio-scion-of-the-third-age` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/oscilio` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/pleiades-superstar` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/pleiades` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/prism-advent-of-thrones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/prism-awakener-of-sol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/prism-sculptor-of-arc-light` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/prism` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/professor-teklovossen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/puffin-hightail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/puffin` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/reya-the-unyielding` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/rhinar-reckless-rampage` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/rhinar` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/riptide-lurker-of-the-deep` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/riptide` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/ruu-di-gem-keeper` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/scurv-stowaway` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/ser-boltyn-breaker-of-dawn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/shiyana-diamond-gemini` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/squizzy-floof` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/taipanis-dracai-of-judgement` — recorded-gap `engine/retarget-non-attack-damage-source` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/taylor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/teklovossen-esteemed-magnate` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/teklovossen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/terra` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/the-librarian-magister-of-history` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/theryon-magister-of-justice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/tuffnut-bumbling-hulkster` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/tuffnut` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/uzuri-switchblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/uzuri` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/valda-brightaxe` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/valda-seismic-impact` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/verdance-thorn-of-the-rose` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/verdance` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/victor-goldmane-high-and-mighty` — recorded-gap `engine/token-creator-owner-controller` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/victor-goldmane-match-fixer` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/victor-goldmane` — recorded-gap `engine/token-creator-owner-controller` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/viserai-between-worlds` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/viserai-rune-blood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/viserai-the-forsaken` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/viserai-usurper` — recorded-gap `set/iar-prints-no-transcend` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/viserai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/vynnset-iron-maiden` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/vynnset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/yoji-royal-protector` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/yorick-weaver-of-tales` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `heroes/zane-broadly-beloved` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/zen-tamer-of-purpose` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/zen` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/zyggy-starlight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `heroes/zyggy` | ✅ | ✅ | en | ✅ | ✅ |

## instants

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `instants/a-drop-in-the-ocean` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/act-of-glory` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/aetherize` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/anaphylactic-shock` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/angelic-descent` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/angelic-wrath` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/arc-light-sentinel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/arcane-compliance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/arcane-polarity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/arcanic-reproach` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/arcbane-grasp` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/arrogant-showboating` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/art-of-the-phoenix-war` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/art-of-war` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/astral-bridge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/auric-shards` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/awakening` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/battered-not-broken` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/blessing-of-serenity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/blinding-beam` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/blink` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/blizzard` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/blood-tribute` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/blur-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/bone-head-barrier` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/brainstorm` — recorded-gap `engine/printed-arcane-resolution-fallback`<br>recorded-gap `trigger/draw-individual-versus-multi-event` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/break-of-dawn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/brush-off` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/bubble-to-the-surface` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/calming-breeze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/calmveil-of-volthaven` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/celestial-reprimand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/celestial-resolve` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/chains-of-consecration` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/channel-lightning-valley` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/channel-stormgarden` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/cheater-s-charm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/chromatic-refinement` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/circular-flowtide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/cloud-cover` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/concealed-object` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/constella-contemplation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/constella-flowslide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/constella-uplift` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/core-reaction` — recorded-gap `engine/printed-arcane-resolution-fallback` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/corrosive-space-dust` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/cosmic-flare` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/cosmic-suture` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/count-your-blessings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/crackle-from-afar` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/dense-blue-mist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/destructive-tendencies` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/doomsday` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/draco-fire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/dramatic-pause` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/drop-of-dragon-blood` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/echoflash` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/eclipse-existence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/eclipse` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/edge-of-their-seats` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/eirina-s-prayer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/electromagnetic-somersault` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/electrostatic-discharge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/elliptical-conflux` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/embody-greatness` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/escalate-bloodshed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evasive-nageboshi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/even-bigger-than-that` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/evo-atom-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evo-buzz-hive` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/evo-circuit-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/evo-face-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evo-heartdrive` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evo-mach-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evo-recall` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evo-shortcircuit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evo-speedslip` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evo-whizz-bang` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/evo-zip-line` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/evo-zoom-call` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/exposed-to-the-elements` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/fabricate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/feign-death` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/fertile-ground` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/figment-of-erudition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/figment-of-judgment` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/figment-of-protection` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/figment-of-ravages` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/figment-of-rebirth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/figment-of-tenacity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/figment-of-triumph` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/figment-of-war` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/flash-bolt` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/fleeing-starbreeze` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/flicker-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/flow-through` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/frost-spike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/future-sight` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/genesis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/glisten` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/go-bananas` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/haven-veil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/haze-shelter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/head-banging-chorus` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/high-voltage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/holo-shield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/homage-to-ancestors` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/hungry-for-more` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/in-the-palm-of-your-hand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/interlude` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/invert-existence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/ion-charged` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/ironsong-pride` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/kindle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/leave-them-hanging` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/lessons-learned` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/ley-line-of-the-old-ones` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/liar-s-charm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/lightning-press` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/livewire-press` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/lubricate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/manifestation-of-miragai` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/mark-of-neverest` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/mark-of-pathstone` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/mark-of-ushering` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/memorial-ground` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/merciful-retribution` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/mistcloak-gully` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/moon-chakra` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/morlock-hill` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/nebulus-cycle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/no-fear` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/not-so-fast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/nourishing-glow` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/null-shock` — recorded-gap `amount/damage-recipient-provenance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/numbskull-charm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/oasis-respite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/oblivion` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/ode-to-wrath` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/ominous-aggression` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/ominous-excavation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/ominous-respite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/orihon-of-mystic-tenets` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/parable-of-humility` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/parched-terrain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/pass-over` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/path-well-traveled` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/peace-of-mind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/phantom-tidemaw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/pilfer-the-tomb` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/pledge-fealty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/poison-the-well` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/preserve-tradition` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/prismatic-shield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/proclaim-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/pulse-of-volthaven` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/radiant-forcefield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/rain-razors` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/rake-over-the-coals` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/rampant-growth-life` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/ray-of-hope` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/razor-ring` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/recede-to-mistform` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/reel-in` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/reinforce-the-line` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/remembrance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/renounce-violence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/restless-coalescence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/rewind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/rip-up-their-virtues` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/rising-sun-setting-moon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/runechant-of-envy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/runechant-of-gluttony` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/runechant-of-greed` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/runechant-of-lust` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/runechant-of-pride` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/runechant-of-sloth` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/runechant-of-wrath` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sacred-art-immortal-lunar-shrine` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sacred-art-jade-tiger-domain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sacred-art-undercurrent-desires` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sand-cover` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/save-the-thought` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/seduce-secrets` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/seeds-of-tomorrow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/seeker-kunai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/seismic-eruption` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/semblance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/shatter-sorcery` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/shining-courage` — recorded-gap `engine/continuous-locked-object-reset`<br>recorded-gap `mechanic/crowd-cheers-resolution` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/sigil-of-aether` — recorded-gap `engine/printed-arcane-resolution-fallback`<br>recorded-gap `targeting/any-target-encoded-as-hero` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-astral-flow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-brilliance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-conductivity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-forethought` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-sanctuary` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-shelter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-solace` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-temporal-manipulation` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/sigil-of-voltaris` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/slap-happy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/slay` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/snag` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/spellbane-sigil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/stardust-spike` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/starlight-road` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/starworld-warning` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/steadfast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/stir-the-pot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/stormshard` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/stormshatter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/stormwhirl` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/stun-star` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/summerwood-shelter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/superstar` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/take-it-on-the-chin` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/take-the-lead` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/temporal-wobble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/tension-in-the-air` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/the-grain-that-tips-the-scale` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/the-suspense-is-killing-me` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/thespian-charm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/three-visits` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/throw-caution-to-the-wind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/thunderous-retort` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/to-be-continued` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/toe-the-line` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/tome-of-divinity` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/tome-of-firebrand` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/tome-of-quandaries` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/tooth-of-the-dragon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/turn-heads` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/up-on-a-pedestal` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/vaporize-shock` — recorded-gap `amount/damage-recipient-provenance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/visit-the-boneyard` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/visit-the-floating-dojo` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/voltic-veil` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/waning-vengeance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/wax-and-wane` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/waxing-specter` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/what-happens-next` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/whispering-mist` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/who-blinks-first` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `instants/wind-slicer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `instants/withstand` | ✅ | ✅ | en | ✅ | ✅ |

## macros

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | `macros/intellect-penalty` | ✅ | ✅ | en | ✅ | — |
| [ ] | `macros/omens-of-arcana` | ✅ | ✅ | en | ✅ | — |
| [x] | `macros/sanctuary-of-aria` | ✅ | ✅ | en | ✅ | — |
| [x] | `macros/treasure-island` | ✅ | ✅ | en | ✅ | — |

## mentors

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [ ] | `mentors/chief-ruk-utan` — recorded-gap `search/search-to-arsenal-never-materializes` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `mentors/hala-goldenhelm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `mentors/lady-barthimont` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `mentors/lord-sutcliffe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `mentors/minerva-themis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `mentors/the-hand-that-pulls-the-strings` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `mentors/the-librarian` | ✅ | ✅ | en | ✅ | ✅ |

## placeholders

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `placeholders/dragons-of-legend` | ✅ | ✅ | en | ✅ | — |

## resources

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `resources/arknight-shard` | ✅ | ✅ | de-DE, en, es-ES, fr-FR, it-IT | ✅ | ✅ |
| [x] | `resources/authority-of-ataya` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/blood-of-the-dracai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/cracked-bauble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/cracker-bauble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/eye-of-ophidia` | ✅ | ✅ | de-DE, en, es-ES, fr-FR, it-IT | ✅ | ✅ |
| [x] | `resources/fool-s-gold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/grandeur-of-valahai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/heart-of-fyendal` | ✅ | ✅ | de-DE, en, es-ES, fr-FR, it-IT | ✅ | ✅ |
| [x] | `resources/inner-chi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/light-of-sol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/master-cog` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/plague-hive` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/riches-of-tr-pal-dhani` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/schism-of-chaos` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/soul-of-existence-purple` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/titanium-bauble` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/voltaris` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `resources/will-of-arcana` | ✅ | ✅ | en | ✅ | ✅ |

## tokens

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `tokens/aether-ashwing` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/agility` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/ash` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `tokens/bait` — recorded-gap `engine/token-creator-owner-controller` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/blade-dance` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/blasmophet-the-insatiable-hunger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/blasmophet-the-soul-harvester` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/bloodrot-pox` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `tokens/cintari-sellsword` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/confidence` | ✅ | ✅ | en | ❌ | ✅ |
| [x] | `tokens/copper` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/courage` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/diamond` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/eloquence` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/embodiment-of-earth` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/embodiment-of-lightning` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `tokens/fealty` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/flurry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/frailty` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/frostbite` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `tokens/gate-to-i-arathael` | ✅ | ✅ | en | ❌ | ✅ |
| [x] | `tokens/gold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/golden-cog` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/goldkiss-rum` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/hyper-driver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/inertia` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/lightning-flow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/might` | ✅ | ✅ | en | ❌ | ✅ |
| [x] | `tokens/nasreth-the-soul-harrower` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/ponder` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/quicken` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/runechant` | ✅ | ✅ | en | ❌ | ✅ |
| [x] | `tokens/seismic-surge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/sigil-of-fate` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/silver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/soul-shackle` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/spectral-shield` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/spellbane-aegis` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/toughness` | ✅ | ✅ | en | ❌ | ✅ |
| [x] | `tokens/ursur-the-soul-reaper` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `tokens/vigor` | ✅ | ✅ | en | ❌ | ✅ |
| [x] | `tokens/zen-state` | ✅ | ✅ | en | ✅ | ✅ |

## weapons

| audited | unit | definition | i18n en sync | locales | assets | tests |
| --- | --- | --- | --- | --- | --- | --- |
| [x] | `weapons/aether-conduit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/annals-of-sutcliffe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/anothos` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/aphrodias` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/ball-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/bank-breaker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/banksy` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/barbed-castaway` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/beaming-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `weapons/beckoning-mistblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/bone-basher` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/brush-of-heavenly-rites` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/celebrant-broadsword` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/cintari-saber` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/claw-of-vynserakai` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/cogwerx-blunderbuss` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/cosmo-scroll-of-ancestral-tapestry` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/crucible-of-aetherweave` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/cutpurse-rapier` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/dawnblade-resplendent` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/dawnblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/death-dealer` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `weapons/decimator-great-axe` — recorded-gap `engine/continuous-locked-object-reset` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/dread-scythe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/dreadbore` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/durendal` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/duskblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/edge-of-autumn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/farflight-longbow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/flail-of-agony` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/galaxxi-black` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/gavel-of-natural-order` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/golden-grail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/graphene-chelicera` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/graven-call` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hammer-of-havenhold` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hammerhead-harpoon-cannon` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hanabi-blaster` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/harmonized-kodachi` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hatchet-of-body` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hatchet-of-mind` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hell-hammer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hexagore-the-death-hydra` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/high-riser` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hot-streak` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `weapons/hummingbird-call-of-adventure` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/humour-plunge` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/hunter-s-klaive` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/iris-of-reality` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `weapons/jinglewood-smash-hit` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/jubeel-spellbane` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/kraken-s-aethervein` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/kunai-of-retribution` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/lionclaw-maul` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/luminaris-angel-s-glow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/luminaris-celestial-fury` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/luminaris` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/mandible-claw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/mark-of-the-huntsman` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/merciless-battleaxe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/miller-s-grindstone` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/mini-meataxe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/moment-maker` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/nebula-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/nerve-scalpel` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/obsidian-fire-vein` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/orbitoclast` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/pile-driver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/plasma-barrel-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/quicksilver-dagger` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/ravenous-meataxe` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/raydn-duskbane` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/reality-refractor` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/reaping-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/red-liner` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/redspine-manta` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/redwood-hammer` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/rok` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/romping-club` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/rosetta-thorn` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/rotwood-reaper` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/rugged-roller` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/sandscour-greatbow` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/savage-claw` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/scale-peeler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/scepter-of-pain` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/scorpio-comet-tail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/searing-emberblade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/seerstone` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/seven-sin-nebula` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/shield-beater` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/shiver` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/sledge-of-anvilheim` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/spider-s-bite` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/spitfire` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/staff-of-verdant-shoots` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/star-fall` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/storm-of-sandikai` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `weapons/summit-the-unforgiving` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/surgent-aethertide` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/symbiosis-shot` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/talishar-the-lost-prince` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/teklo-blaster` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/teklo-leveler` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/teklo-plasma-pistol` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/tiger-taming-khakkara` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/titan-s-fist` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `weapons/voltaire-strike-twice` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/volzar-meteor-storm` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/volzar-the-lightning-rod` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/vox-necropolis` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `weapons/waning-moon` | ✅ | ✅ | en | ✅ | ✅ |
| [ ] | `weapons/winter-s-wail` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/zenith-blade` | ✅ | ✅ | en | ✅ | ✅ |
| [x] | `weapons/zephyr-needle` | ✅ | ✅ | en | ✅ | ✅ |

