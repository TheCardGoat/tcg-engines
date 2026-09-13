# Flesh and Blood Practice Simulator Pre-production QA Handoff

**Date:** 2026-08-14
**Surface:** `http://localhost:5173/flesh-and-blood/simulator/play/practice`
**Fixture surfaces:** `/flesh-and-blood/simulator/tests/dual-target-open?ai=pass-only`, `/flesh-and-blood/simulator/tests/endgame?ai=pass-only`
**Evidence:** 285 browser screenshots in `/tmp/tcgo-fab-e2e-qa-2026-08-14`
**Result:** **NO-GO — no observed run reached a genuine win or loss**

## Executive summary

The local Flesh and Blood practice simulator can start a match, expose legal card and equipment actions, collect pitch and optional-effect decisions, and render combat through attack, defend, reaction, damage, and resolution steps. It is not ready for production because match progression is not reliable enough to reach a terminal result.

The longest practice run reached Turn 10 and command `#208`, with the opponent at 27 life and the player at 22. The bot then stopped on Sonata Galaxia's search decision while holding priority. Player Pass and Concede did not recover or terminate the match. Independent Snatch and low-life endgame fixtures reset to their initial states when the automated opponent reached the defend step. The requested end-to-end success condition — playing until either participant loses — therefore remains unverified.

## Method

- Used the Codex in-application browser against the real local simulator UI.
- Took a screenshot after every interaction or observed state transition.
- Drove gameplay through rendered cards, equipment, decision prompts, and Pass controls.
- After the user clarified the interaction constraint, no sidebar action controls were used.
- Compared visible life, resources, action points, priority, combat step, stack, hand, and public command history after each action.
- Retried the progression boundary in the preserved full match and in two deterministic fixtures.

This was browser QA, not a source-level diagnosis. Suspected ownership below is routing guidance, not a confirmed root cause.

## Release blockers

### P1-001 — Practice bot deadlocks on Sonata Galaxia search

**Observed state**

- Turn 10, action phase, opponent priority.
- Sonata Galaxia remains the single pending resolution-stack layer.
- Last command remains `#208 · Practice bot · Search for a card.`
- Life totals remain opponent 27, player 22.
- Status remains `Waiting for practice bot` indefinitely.

**Reproduction**

1. Start a normal bot practice match.
2. Allow the Vynnset bot to reach Sonata Galaxia.
3. Observe commands `#204 · Practice bot · Play Sonata Galaxia`, `#205 · Practice bot · Choose X for Sonata Galaxia`, and `#208 · Practice bot · Search for a card`.
4. Wait for the automated search decision.
5. Click the bottom Pass control.

**Expected:** The bot selects a legal search result, or deterministically selects a fail-safe legal fallback, and the stack continues resolving.

**Actual:** No command is appended and no state changes. Pass reports a successful browser click but cannot act because the bot owns priority.

**Evidence**

- `264-auto-d-100-pass.png`
- `267-visible-controls-opponent-search-deadlock.png`
- `284-turn10-deadlock-before-visible-pass.png`
- `285-turn10-deadlock-after-visible-pass.png`

**Suggested owner:** Flesh and Blood automation/bot decision pipeline, especially private search decisions and no-result/fallback handling.

### P1-002 — Match and fixture state reset during active combat

Two deterministic fixtures independently lose all progress at the automated defense boundary.

#### Snatch fixture

1. Open `/flesh-and-blood/simulator/tests/dual-target-open?ai=pass-only`.
2. Click Snatch in hand.
3. Close the card preview.
4. Click bottom Pass until combat reaches Defend.
5. Wait for the bot response.

**Expected:** The pass-only bot declares no defenders; Snatch deals damage and its hit effect continues.

**Actual:** The fixture returns to its baseline: 20–20 life, Snatch back in hand, one action point, and empty public history.

**Evidence:**

- `268-clean-match-visible-card-baseline.png`
- `271-recovered-click-snatch.png`
- `273-pass-priority-after-snatch.png`
- `274-combat-pass-two.png`
- `275-mid-combat-reset-snatch-returned.png`

#### Low-life endgame fixture

1. Open `/flesh-and-blood/simulator/tests/endgame?ai=pass-only`.
2. Starting state is player 4 life, opponent 6 life.
3. Click Anothos.
4. Click each Cracked Bauble when prompted to pitch.
5. Click bottom Pass twice to reach Defend.
6. Wait for the bot response.

**Expected:** The bot declares no defenders and the attack proceeds to damage.

**Actual:** The fixture restores its baseline: 6–4 life, both Baubles back in hand, one action point, and empty public history.

**Evidence:**

- `276-low-life-endgame-baseline.png`
- `278-clicked-anothos-legal-action.png`
- `279-pitched-cracked-bauble-by-card-click.png`
- `280-pitched-second-cracked-bauble.png`
- `281-endgame-anothos-pass-one.png`
- `282-endgame-anothos-pass-two.png`
- `283-endgame-reset-at-bot-defense.png`

**Suggested owner:** Simulator local-engine lifecycle and fixture runtime. Verify that bot decisions update the existing engine instance rather than remounting or reinitializing scenario state.

### P1-003 — Concede does not terminate a bot-deadlocked match

**Reproduction**

1. Reach the Sonata Galaxia deadlock described in P1-001.
2. Click Concede.
3. Repeat once after allowing time for the command to settle.

**Expected:** Concede immediately creates a terminal loss, regardless of priority or a pending opponent decision.

**Actual:** The match remains on Turn 10 with the same pending layer and command `#208`; no terminal result appears.

**Evidence:**

- `265-turn10-concede-after-bot-deadlock.png`
- `266-turn10-concede-retry-still-deadlocked.png`

**Suggested owner:** Match-action dispatch. Concede should be an unconditional out-of-band terminal action rather than a priority-gated engine move.

### P1-004 — Setup selection can launch different heroes/decks

**Observed:** The setup/sideboarding surface showed Gravy Bones versus Rhinar, but the launched match showed Tuffnut versus Vynnset.

**Expected:** The selected player and opponent decks are the decks instantiated by the local engine and displayed on the board.

**Actual:** The board does not match the immediately preceding setup selections.

**Evidence:**

- `053-gravy-rhinar-sideboard.png`
- `054-mismatched-tuffnut-vynnset-start.png`

**Suggested owner:** Practice setup form state, route state, and local-engine configuration handoff.

### P1-005 — Full-page runtime crash during card interaction

**Observed error:**

```text
ReferenceError: PracticeHistory is not defined
at createFabPracticeSidebarActivity (.../FabPracticeSidebarActivity.tsx:28:33)
at FabPracticeSidebarActivity (.../FabPracticeSidebarActivity.tsx:214:10)
```

The full board was replaced by the application error screen. Reload later recovered, so this may have been exposed by a live-edit/HMR boundary, but the active pre-production runtime was not resilient to it.

**Evidence:** `270-runtime-crash-practicehistory-undefined.png`

**Suggested owner:** `FabPracticeSidebarActivity.tsx` module/import integrity and HMR-safe component initialization.

## Usability and clarity findings

### P2-001 — Playing a card also opens a board-obscuring preview

Clicking the clearly playable Snatch card both initiated play and opened a large card preview. The action succeeded, but the preview covered much of the board and the newly created resolution stack. A user can easily interpret this as inspection-only or miss the next required Pass.

**Evidence:** `269-clicked-snatch-card.png`, `271-recovered-click-snatch.png`, `272-snatch-preview-closed.png`.

**Recommendation:** Separate inspect and play affordances, or close the preview automatically once a legal action is dispatched. Never obscure the resulting stack/decision without an explicit reason.

### P2-002 — Mandatory pitch selection can look like card inspection

During payment flows, clicking a highlighted pitch candidate can open or retain preview behavior while the decision prompt still reports `0/1 selected`. The sequential Anothos payment eventually worked, but after the first Bauble the replacement prompt again showed `0/1`, making cumulative payment progress unclear.

**Evidence:** `040-backhand-pitch-song-of-sinew.png`, `041-backhand-pitch-song-retry.png`, `042-close-song-preview.png`, `279-pitched-cracked-bauble-by-card-click.png`, `280-pitched-second-cracked-bauble.png`.

**Recommendation:** During a required selection, a candidate click should unambiguously select/submit that candidate. Show total cost, paid resources, remaining cost, and which cards have already been pitched across sequential prompts.

### P2-003 — Excessive priority/pass churn obscures meaningful decisions

The full practice run accumulated more than 200 commands by Turn 10, with long sequences of alternating Pass actions around card layers and combat steps. One continuation attempted 100 additional Pass interactions without reaching a terminal state.

**Evidence:** screenshots `086` through `163`, `165` through `264`, and the visible `Practice Lab · 200 commands` count in the deadlock evidence.

**Recommendation:** Preserve rules-correct windows but auto-pass seats with no legal non-Pass response where safe, collapse repeated public Pass entries, and make the next meaningful decision visually dominant.

### P2-004 — Stack and overlays compete with the playfield

The resolution stack and full-card preview can cover the central combat surface. A blank/empty preview overlay was also observed once during the long run but was not isolated into a deterministic reproduction.

**Recommendation:** Keep the active combat link and required prompt visible at all times; constrain previews to a side panel or dismiss them automatically on state transition.

### P2-005 — Transient life/resource presentation lacked a single stable truth

During rapid bot resolution, different visible life summaries briefly disagreed before settling. The long run also showed large life increases without a concise explanation near the life counter, forcing the player to search the history for cause.

**Recommendation:** Update all duplicated resource summaries atomically and surface the causative event next to significant life/resource changes.

## What worked well

- Hand, equipment, hero, weapon, arsenal, pitch, banished, graveyard, life, resources, and action points were visually distinguishable.
- Playable cards and equipment exposed useful accessible labels such as `1 action available`.
- Combat-chain attack/defend lanes and step labels were understandable once unobscured.
- Hidden opponent information remained hidden.
- Required and optional decisions were generally presented explicitly.
- Fyendal's Spring Tunic's optional yes/no decision was comparatively clear.
- The bottom Pass control was consistently discoverable.
- Card imagery retained its source aspect ratio in the observed desktop viewport.

## Engineering acceptance criteria

QA should resume only after the following are demonstrably true in the current browser runtime:

1. A normal practice match can run from setup to a real life-total or concession terminal result without reload, remount, or state reset.
2. The bot resolves Sonata Galaxia search decisions within a bounded time. No legal search result must produce a deterministic fallback rather than a permanent wait.
3. `dual-target-open?ai=pass-only` reaches Snatch damage/hit resolution without restoring fixture baseline.
4. `endgame?ai=pass-only` reaches damage and a terminal result without restoring fixture baseline.
5. Concede terminates immediately from any nonterminal state, including while the opponent owns priority or has a pending private decision.
6. Setup hero/deck selections exactly match the instantiated match.
7. `FabPracticeSidebarActivity` loads without a missing runtime symbol on initial load, reload, and HMR.
8. A card action and a card preview cannot ambiguously fire from the same click; required prompt selection remains visually authoritative.
9. All duplicated life/resource displays update together.

## QA continuation plan

After an engineering fix is available:

1. Re-run each deterministic blocker reproduction first.
2. Start a fresh normal practice match using explicitly recorded player/opponent decks.
3. Interact through visible cards, decision prompts, and playfield controls; avoid the sidebar except for an explicit Concede acceptance test.
4. Capture every iteration and compare visible priority, stack, combat step, zones, resources, and command history.
5. Continue until one player genuinely loses and verify the terminal result, winner/loser identity, disabled post-game actions, and restart flow.

Until all five release blockers are fixed and a genuine terminal match is observed, the pre-production decision remains **NO-GO**.
