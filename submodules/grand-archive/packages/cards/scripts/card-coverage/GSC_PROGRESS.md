# GSC Behavioral Coverage Progress

Last updated: 2026-09-24

Authoritative coverage: **2/2 cards complete; 2/2 abilities directly proven; 0 centrally covered; 0 untested or blocked.**

## Inventory and behavioral evidence

Baseline: 0/2 cards complete and 0/2 abilities covered. Both generated implementations already express their printed behavior; no engine or compiler changes were necessary.

| Card | Ability | Evidence |
| --- | --- | --- |
| Enchanted Fete | `s190ox288c-a1` | Three public-runtime tests: four-card reserve payment and underpayment rejection; recovery at zero, two, and five damage; controller-only champion recovery; ally damage unchanged; exactly one deck card drawn into memory after resolution; opponent zones unchanged. |
| Enthralling Visage | `ycwz9gv4vm-a1` | Eight public-runtime tests: reserve cost and invalid-target rejection; own and opposing graveyards; one- and three-damage hits; single-instance consumption; ally protection and unrelated-unit damage; unpreventable damage suppresses banishment and consumes the instance; invalidated unit target fizzles while costs remain paid; opposing ally targeting and turn expiry. |

Sibling evidence: `src/cards/GSC/actions/enchanted-fete.test.ts` and `src/cards/GSC/actions/enthralling-visage.test.ts`.

## Rules reviewed

- Playing Cards — Card Activation, rules 1.2, 1.5–1.9: elements, announcement targets, legality, reserve payment, and Opportunity.
- Playing Cards — Resolution, General rules 1–4 and Checking Resolution rule 1.4: controller perspective, ordered resolution, and required targets remaining legal.
- Game Terms — Recover, rules 1–2: remove champion damage up to the amount present, including zero damage.
- Game Mechanics — Damage Prevention, rules 4–11: damage types, instance consumption, unpreventable damage, duration, recipient scope, and linked effects.
- Abilities — Triggered Abilities, rules 5–11: target timing and delayed/reflexive triggers, compared against the specific prevention rule.

Damage Prevention rule 11 was verified against the live official page. Enthralling Visage's banishment shares its prevention paragraph and is part of the replacement, not a separately stacked trigger. Both targets are selected on activation; banishment occurs only when positive damage is prevented.

Official source: https://rules.gatcg.com/game-mechanics/game-mechanics-damage-prevention

## Coverage preservation and generated output

Only the two GSC card rows change semantically in the authoritative report. No generated card definitions, catalog data, compiler output, or manifests change inside or outside GSC.

Previously completed sets remain complete, including ability-less cards:

| Set | Complete cards | Covered abilities | Untested abilities |
| --- | ---: | ---: | ---: |
| DOA | 255/255 | 411/411 | 0 |
| AMB | 239/239 | 415/415 | 0 |
| ALC | 210/210 | 400/400 | 0 |
| DTR | 172/172 | 307/307 | 0 |
| EVP | 21/21 | 43/43 | 0 |

GSC has no keyword paragraphs. Existing structural central-keyword guards remain unchanged; their negative coverage tests for parameterized, restricted, grouped, granted, inherited, unsupported, zone-specific, and disabled-evidence cases pass.

## Validation

- Focused GSC suites: 11 tests passed.
- Focused GSC plus central-keyword accountability: 19 tests passed.
- Cards package type check: passed.
- Authoritative coverage regeneration: passed; direct evidence increased by exactly two abilities.
- CI initially exposed wall-clock timeouts in existing DTR/AMB suites under the cards package's default five-second timeout and unrestricted worker count. Focused reruns confirmed timeout-only failures. The cards test command now matches the existing engine command's two-worker limit and 15-second per-test timeout; no assertions, coverage markers, or gameplay behavior were relaxed.
- Focused Cometary Vantage and Candlelight Hourglass rerun with those limits: 28/28 tests passed.
- `pnpm run ci-check` from `submodules/grand-archive`: passed (exit 0).
- Generated output: reproduced twice without changes; fingerprint `b9fe78494c851d70d971dc42d238566a64b21e86e6441e0af1554c3bb12bafe3`.
- Rules audit: 300/300 units implemented; zero partial, missing, or pending units across 105 files.
- All five workspace package/tool type checks: passed.
- Cards: 1,151 suites, 5,947 tests passed; no skips.
- Engine: 179 suites passed, 2 existing suites skipped; 891 tests passed, 3 existing tests skipped. No skipped evidence was added or used for GSC.
- Catalog and scraper: 2 suites, 4 tests passed.
- `git diff --check`: passed.

No uncovered GSC work remains. The only change outside GSC tests and coverage documentation is the cards package test-runner resource configuration described above; there are no generated changes outside GSC.
