# Hyperia final verification

Completed 2026-10-06 under the user's revised scope: printed text-box abilities, including keywords, costs, conditions, choices, ownership, duration and visible results/logs. Basic actions are setup only.

The inventory contains all 207 entries exported by the Hyperia catalog. Exact dynamic imports verify every recorded definition path against its ID, canonical ID, name and version. The 204 canonical identities include three reprint pairs: Héctor Gone to Pieces/D23, Mickey Best in Town/iconic and Cinderella Unintentional Icon/iconic. The duplicate collector number13 belongs to different printings. All definition/test paths exist. All18 excluded cards have no runtime abilities. The189 ability entries have reviewed unit tests and recorded browser evidence. All43 note-only boundaries reopened during completion review have explicit closures in the reconciliation record. Historical pending notes are superseded by their later closures.

| Check | Result |
| --- | --- |
| Hyperia cards, exact PR dependencies | 2923 pass, 0 fail, 22292 assertions, 195 files |
| Engine, exact PR dependencies | 1373 pass, 0 fail, 4168 assertions; 2 skipped, 50 TODO |
| Repaired card test declarations | 116 pass, 805 assertions |
| Activated ability log declarations | 6 pass, 25 assertions |
| Simulator actions, adapter, log and privacy checks | 186 pass, 409 assertions |
| Card and engine types | Pass |
| Simulator types | 0 errors, 1 existing warning |
| Set14 skipped/TODO card tests | None |
| Final browser proof | Héctor cost-one song in both seats; ownership rejection, exact effects, payment, expiry and both log views |

Shared node_modules link to another working copy. Temporary tsconfig paths and local Vite aliases resolved the engine, types, cards, card-model and bot-core exports to the PR checkout for final checks. A source comparison also parsed the emitted JavaScript syntax trees, ignoring comments, formatting and redundant parentheses: no executable differences exist between the linked packages and PR sources. Chief Bogo's removed type assertion and engine type-field ordering are erased during emission. This retains earlier browser proof without assuming that different source text is equivalent. Temporary aliases and caches are local scratch files and are not part of the PR.

Per-card printed text, test paths and browser outcomes are in [the inventory](hyperia-city-inventory.csv); repairs and branch closures are in [the audit status](hyperia-audit-status.md) and [completion reconciliation](hyperia-completion-reconciliation.md). The final screenshot is `/tmp/hyperia-hector-exact-final.png` and the reproducible page is `/tests/set14-audit-hector-cost-one`.

These results close the requested local ability audit. They do not establish production deployment or exhaustive correctness for every possible cross-card combination. The engine's existing skipped/TODO tests remain visible above.

## Production promotion review

The promotion review added 14 engine regressions and fixed limited-ability outcome tracking, staged usage propagation, queued once-per-song events, Support after source re-entry, discard ownership and additional fixture visibility/default decks. Opponent iteration uses active seating order and restricts each private choice to the affected seat. Production setup again requires exactly two players; extra seats are available only through the test fixture setup override.

The full card suite reports 10428 passing tests and 29 failures (28 unique names), with 26 skipped and 16 TODO. Comparing failure names with the existing full-card baseline finds no new failures; Pepa's Sing Together regression now passes. The existing unrelated failures remain. The Hyperia suite has no failures. The updated local browser confirms opposing singer rejection, Héctor's +2 Strength song result and formatted log. Screenshot: `/tmp/hyperia-promotion-browser.png`.
