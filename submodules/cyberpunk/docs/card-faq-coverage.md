# Official card FAQ coverage

The 2026-10-08 audit checked the [official card FAQ feed](https://api.netdeck.gg/api/faqs/cyberpunk?scope=card), linked from the [rules FAQ](https://cyberpunktcg.com/rules-faq). It contains 244 English FAQs for 140 cards. Every FAQ ID, question, and answer matches the downloaded catalog in `packages/cards/src/generated.ts`.

`tools/scraper/src/index.ts` already downloads card FAQs and joins them to all matching printings. Run the scraper's `scrape:faqs` task to refresh only the FAQs. A new or changed FAQ must then be reviewed and linked to behavior tests.

## Coverage check

[The consolidated inventory](card-faq-inventory.md) lists all questions, answers, source IDs, and unit tests. `card-faq-coverage.json` is its source of truth: 244 official source FAQs are consolidated into 239 entries. Four identical question/answer pairs across cards and two equivalent Misty questions share entries. Each source ID still needs its own explicit test mapping. Related questions that test different facts stay separate. The current audit maps 240 FAQs to behavior tests. Four source conflicts remain unresolved; their tests describe current behavior and do not count as verified FAQ coverage.

To refresh the readable inventory after changing the manifest, run `node tools/check-card-faq-coverage.mjs --write-inventory`. CI rejects a stale inventory, duplicate wording in separate groups, duplicate source IDs, and source FAQs that lost their test mappings during consolidation.

From this workspace, run:

```sh
vp run ci:faq
vp run ci:check
```

`ci:faq` executes the files referenced by the manifest. The check requires every referenced test to pass. `ci:check` runs formatting, lint, types, catalog layout, and the full suite, then verifies the same references against the test report. The manifest check rejects missing, duplicate, or changed scraped FAQs, missing test files, and test titles that were not executed or did not pass. It does not infer test quality from titles; review must confirm that the assertions test the stated ruling.

The tests cover game behavior through the local engine. Some FAQs describe hypothetical interactions that current cards cannot produce. The Judy QUICK scenario adds QUICK to an otherwise unchanged real Program. The simultaneous Meredith swap scenario supplies one engine event for two friendly Gigs. These prove those rule boundaries, rather than a current retail-card combination. These tests do not prove browser presentation, hosted matches, or deployment.

## Unresolved source conflicts

| Card | FAQ | Current source and behavior |
| --- | --- | --- |
| Appetite for Destruction | Choose a Unit when the Program is played. | Retail text applies to the next friendly Unit that wins by 3 or more. It has no selection when played. |
| Bootleg: Black Sapphire Show | Sell the top card without revealing it. | Sell reveals the card under CR 11.9.1. Retail text instructs a Sell without a hidden-card exception. |
| Dying Night: V's Pistol | The delayed Ready still occurs if the host leaves play. | Retail text gives a separate end-of-turn ability to the equipped host. The current engine requires that host and Gear to remain in play. |
| Safety Override | Choose a Unit when the Program is played. | Retail text applies to the next friendly Unit that loses a Fight. It has no selection when played. |

Each conflict entry links the source and a current-behavior test. A source-policy decision is required before changing these four interactions. Do not report them as completed FAQ coverage.
