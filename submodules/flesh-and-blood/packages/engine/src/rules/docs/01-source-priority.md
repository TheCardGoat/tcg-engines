# Source priority and conflict resolution

## Purpose

Flesh and Blood has three public rule-facing document families that **do not always agree**. Engineering tests must pick a single oracle. This document is the authority for that choice inside the AAA design pack.

---

## Official sources

| Rank        | Family                                | Primary URL / location                                                                                                                                | Nature                                             |
| ----------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1 (highest) | **Functional errata & Rules Updates** | https://fabtcg.com/rules-and-policy-center/errata-bulletins/ · https://fabtcg.com/articles/rules-update/ · Card Vault true text                       | Changes how cards/rules work                       |
| 2           | **Comprehensive Rules**               | https://rules.fabtcg.com/en/cr/ · local scrape: `submodules/flesh-and-blood/.agents/skills/fab-rules/references/flesh-and-blood-comprehensive-rules/` | Living rules reference                             |
| 3 (lowest)  | **Release notes**                     | https://fabtcg.com/rules-and-policy-center/release-notes/                                                                                             | Set launch intent; **rarely updated post-release** |

Official release-notes index disclaimer (fetched 2026-08): _“Release notes are rarely updated beyond the release of their respective set and do not accurately reflect changes to the rules and policy of the game that may have occurred post-release.”_

---

## Decision procedure

```
1. Does a Rules Update / Errata Bulletin / Card Vault true text speak to the interaction?
   → YES: use that outcome as the test oracle. Mark older release-note claim `superseded`.
2. Else, does the current CR define the behavior?
   → YES: cite Chapter.Section.Rule; implement that outcome.
3. Else, use the set release note as historical intent for a new keyword/card note.
4. If the behavior is pure policy/deckbuilding/product: mark untestable / n/a — do not write theater tests.
```

### Inventory encoding

Existing machine inventory (`release-notes/inventory/claim-inventory.json`) uses:

| Status       | Meaning for tests                                                     |
| ------------ | --------------------------------------------------------------------- |
| `tested`     | A scenario exists (may still be residual-suspect — see inventory doc) |
| `untested`   | No scenario yet                                                       |
| `superseded` | Older claim; **oracle is `supersededBy` URL**                         |
| `n/a`        | Non-relevant (legality, icons, packaging, …)                          |

As of audit: **2989 claims** — `tested` 2192 · `n/a` 478 · `untested` 317 · `superseded` **2**.

Known superseded rows:

| Claim ID                            | Old idea                                           | Oracle                                                                               |
| ----------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `WTR-card-pummel-obsolete-ally-hit` | Pummel discard mode without requiring “hit a hero” | https://fabtcg.com/articles/rules-update/ + Card Vault Pummel                        |
| `LEGACY-no-defending-hero-on-ally`  | No defending hero when ally is attacked            | Same Rules Update (you **are** defending hero; still cannot declare defending cards) |

---

## Worked conflict: Pummel (release note vs Rules Update)

| Layer                                                | Statement                                                                                                                                                                                                         |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Historical WTR printing / note                       | Pummel second mode commonly read as discard on hit without “hero” restriction in early framing                                                                                                                    |
| Rules Update (Compendium era, effective Feb 13 2026) | Special note: with new “defending hero” definition, Pummel is a **functional errata** for original WTR printing — second mode needs the attack to **hit a hero**; **does not** trigger if the attack hits an ally |
| Card Vault                                           | True text is the play oracle                                                                                                                                                                                      |
| **Test oracle**                                      | Hit hero → discard; hit ally → **no** discard (life/hand of controller unchanged)                                                                                                                                 |

AAA case lives in [`errata-and-rules-updates/README.md`](./errata-and-rules-updates/README.md) and is already production-proven in `../release-notes.test.ts`.

---

## Worked conflict: Ally as defending / attacking hero

| OLD (pre-update)                                                         | NEW (Rules Update)                                                                                                 |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Ally is attack source → controller is **not** attacking hero for effects | Controller **is** attacking hero for effects                                                                       |
| Ally is attack target → controller is **not** defending hero for effects | Controller **is** defending hero for effects                                                                       |
| —                                                                        | Still **cannot** declare defending cards or play/activate defense reactions when the hero is not the attack-target |

Release notes that assumed “no defending hero on ally” are **superseded**. Tests must encode NEW.

---

## Worked conflict: Layer resolution when targets vanish

| OLD                                                       | NEW                                                      |
| --------------------------------------------------------- | -------------------------------------------------------- |
| Layer with targeted effect fails entirely if targets gone | Layer **still resolves**; only the targeted effect fails |
| Could deny go again by removing targets                   | Unconditional go again still grants AP                   |

Example oracle: Rattle Bones + Pass Over (GY target banished) → banish fails, go again still grants 1 AP.

---

## Errata bulletins (index, not exhaustive card list)

Fetched from https://fabtcg.com/rules-and-policy-center/errata-bulletins/ (2026-08):

| Bulletin | Date (site)       | URL                                             |
| -------- | ----------------- | ----------------------------------------------- |
| #10      | March 10, 2026    | https://fabtcg.com/articles/errata-bulletin-10/ |
| #9       | May 23, 2024      | https://fabtcg.com/articles/errata-bulletin-9/  |
| #8       | February 2, 2024  | https://fabtcg.com/articles/errata-bulletin-8/  |
| #7       | July 14, 2023     | https://fabtcg.com/articles/errata-bulletin-7/  |
| #6       | March 15, 2023    | https://fabtcg.com/articles/errata-bulletin-6/  |
| #5       | October 03, 2022  | https://fabtcg.com/articles/errata-bulletin-5/  |
| #4       | January 12, 2022  | https://fabtcg.com/articles/errata-bulletin-4/  |
| #3       | November 5, 2021  | https://fabtcg.com/articles/errata-bulletin-3/  |
| #2       | June 4, 2021      | legacy.fabtcg.com functional-errata link        |
| #1       | September 1, 2020 | https://fabtcg.com/articles/errata-bulletin-1/  |

Policy from the bulletin index: only **functional** errata and significant templating clarifications appear; all printings play as the errata’d text. Engineering: when implementing a named card, check bulletin + Card Vault before trusting a set release note.

**Offline note:** full per-card text of every bulletin is large; this pack does not re-host LSS card text. When a bulletin cannot be fetched mid-task, use inventory `errataSources`, local CR scrape, and in-repo tests already citing the Rules Update. Do **not** invent bulletin contents.

---

## Citation style for tests and docs

| Source          | Form                                                          |
| --------------- | ------------------------------------------------------------- |
| CR              | `7.5.2` or `CR 7.5.2` — must match scrape headings            |
| Release note    | Set slug URL + subject (“WTR · Scar for a Scar”)              |
| Rules Update    | `Rules Update 2026 · ally defending hero` + article URL       |
| Errata bulletin | `Errata Bulletin #N · Card Name` + article URL                |
| Supersession    | Document **old claim** then **oracle claim** in the same case |

---

## What is intentionally untestable (all sources)

| Category                                                          | Why                                              |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| Format legality dates / set legality                              | Policy, not play outcome in-engine               |
| Icon legends, packaging                                           | Non-game                                         |
| Living Legend points                                              | Tournament policy                                |
| Pure deckbuilding (essence/specialization limits) without a match | No in-match move path; may register keyword only |
| “Design intent” prose without a resolvable game state             | Not executable                                   |

These belong as `untestable` / inventory `n/a` — never force a mock-only test.
