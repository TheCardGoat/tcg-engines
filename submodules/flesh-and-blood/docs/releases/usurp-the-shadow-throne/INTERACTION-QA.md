# Preview interaction QA

Run the agnostic simulator app with `pnpm run dev --host 127.0.0.1 --port 5190`.
These fixtures use the shipped practice surface and real engine decisions. No
asset upload or backend connection is needed.

| Fixture                                                                                                        | QA actions                                                                                                                                                                                                                                                                                                                                                                                                                                | Expected presentation                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Forsaken Strike](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/usurp-preview-forsaken-strike-yellow)  | Click the arena Restless Corporal, then the hand copy. Choose Gate, then +2 power. Reload and choose none twice for the contrast.                                                                                                                                                                                                                                                                                                         | Only the current cost's eligible zombie is highlighted. Each direct click advances without a picker or extra confirmation. Rewards have printed labels. History includes the destroyed zombie, discarded additional cost, Gate creation, and eventual 5-damage hit. Declining both costs leaves the zombies and skips reward choices. |
| [Runic Reaving](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/usurp-preview-runic-reaving-red)         | Inspect the opposing Runechant, then click your Runechant or Runechant of Envy.                                                                                                                                                                                                                                                                                                                                                           | Both controlled Runechants are eligible; the opposing one cannot pay Usurp. Confirm is disabled until a valid selection. A direct legal click pays the cost and advances.                                                                                                                                                             |
| [Restless Corporal](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/usurp-preview-restless-corporal-red) | Choose the blue Hellbound Assault in the automatically opened banished picker. Repeat at a portrait phone viewport.                                                                                                                                                                                                                                                                                                                       | Exactly two owned candidates, distinguishable by pitch. The opposing red copy is excluded. One click commits and closes the picker; your graveyard increases to one.                                                                                                                                                                  |
| [Zombie choice board](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/usurp-zombie-choice-board)         | Acrid Stench is attacking. Discard Restless Cleric or Restless Plowman from hand. Arena Restless Corporal / Steed / Shieldmaiden and the opposing Magister must stay ineligible. Minimize the combat chain to inspect those idle arena copies — the overlay intercepts clicks on them. After the attack, pass and try Bone Mass, Bonded Burial (destroy vs discard), Malignant Migration, or Corpse Cover from the same hand.             | Current effect reads "Choose a card for Acrid Stench" (required 1). Only the two hand Restless copies are `actionable`. A direct click commits immediately; there is no Confirm on this prompt. Follow-up cards remain in hand.                                                                                                       |
| [Gloomblade Usurp board](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/usurp-gloomblade-usurp-board)   | Pay Usurp by clicking one of your three similar Runechants (plain Runechant, of Envy, of Wrath). The opposing Runechant must not highlight. Clicking it should inspect, not pay. Pause the bot before confirming if you want to walk the chain — auto-pass otherwise runs combat and remaining Runechants may pop. After the chain, play Shadowake or Bloodfrenzy Gloomblade from banished, or Promise of Power / Enshrine Sin from hand. | Current effect reads "Choose 1 object to destroy for Murmuring Gloomblade". Confirm stays disabled until a selection; a direct legal click still pays Usurp. Three controlled Runechants are `actionable`; the opposing copy is idle. History records the usurped Runechant. Banished gloomblades stay available.                     |

The existing 114-card preview catalog remains available for individual card QA.
The two board labs stack similar names on a live table (Restless zombies, then
Runechant / Gloomblade families) so prompt highlighting and Confirm-versus-direct-click
bugs show up. They do not claim browser interaction coverage for every card in the set.

Regression coverage lives in the agnostic app's
`src/games/flesh-and-blood/usurp-interactions.test.tsx` and mounts the real route,
clicks rendered controls, and checks highlights, choices, and rendered history.
The token fixture registry now uses authored English names instead of title-casing
slugs, preserving punctuation and casing such as `Gate to i'Arathael`.

## Layout verification

The modal now measures its width against the available tabletop column rather
than the full viewport. Its sidebar offset matches the shared shell's responsive
column. Card frame geometry is independent of image availability; fallback text
cannot stretch the frame or overflow below it.

In-app browser inspection at 1196×839: modal x=251, width=933 (12px right inset);
missing-art card frames 136.7×191.4 (5:7). At 390×844: modal x=12, width=366;
card frames 162×226.8 (5:7). The title, choice count, minimize control, preview,
and both candidate cards remain within the viewport. Temporary device emulation
was cleared after verification.

## Validation — 2026-09-04

- Five route integration cases pass, including the selected +2 reward's rendered
  five-damage outcome. Reward assertions wait for the next numbered prompt and
  match the action label independently of the power icon's accessible name.
- `pnpm run ci:agnostic:check`: passed; simulator 276 files / 2,218 tests.
- FAB `vp run ci-check`: passed; cards 9,829 tests, engine 4,036 tests
  (plus four existing expected failures and one existing skip), with type and
  catalog/authoring checks passing.
- Desktop and portrait mobile browser geometry verified above. The visual fixes
  change layout only; existing selection handlers and card image sources are
  preserved. No artwork was uploaded.

## Decay lifecycle

[Open Decay QA](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/decay-ability).
The dedicated fixture is in `engine-scenarios/decay.ts`, under **Edge cases**.
Click **Pass** three times, letting the pass-only opponent finish each turn.

- Each controller's end phase adds one −1 life counter to their Decay allies.
- Cintari Sellsword receives no counter; both heroes remain at 20 life.
- On the third counter, the three-life allies leave the arena for their graveyards.
- History shows the counter, destruction, and death events in the correct turn.

The fixture uses Bravo and Dash to isolate Decay from Malice's zombie-death
trigger and the resulting Corrupted Corpse Blood Debt. Empty hands and decks
avoid unrelated draw and arsenal decisions. Decay itself requires no target selection.

Engine regression coverage lives in `keyword-decay.test.ts`: controller scope,
non-Decay allies, cards outside the arena, counter persistence across opposing
turns, and zero-life destruction. The third-counter case exposed a missing
zero-life game-state action after numeric life-counter changes (CR 2.5.3f).
Browser QA verified the complete three-turn sequence, history, surviving
Sellsword, and unchanged hero life.

## Forsaken Strike — complete payment and reward QA

- [Basic two-reward flow](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/usurp-preview-forsaken-strike-yellow)
- [Six rewards and target filters](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/forsaken-strike-six-rewards)
- [Malice: destruction versus discard](http://127.0.0.1:5190/flesh-and-blood/simulator/tests/forsaken-strike-malice)

In the six-reward fixture, select the three own arena zombies and **Confirm**,
then select the three hand zombies and **Confirm**. On mobile, **Choose card**
opens the arena selection picker. Cintari Sellsword, Snatch, and opposing
zombies are not valid payments. Selected cards can be deselected before
confirmation. Choosing none is legal independently for each cost.

Try three power rewards, two Gate rewards, and one go again reward: the attack
has 9 power, creates two Gates, and returns one action point after combat.
Pass any response window to resolve damage. The remaining Forsaken Strike is
available to check that the first attack's bonuses do not transfer. Six power
choices instead give 15 power; six Gate choices create six Gates at base power.
The printed caps are three destroyed **and** three discarded, not three total.

The Malice fixture distinguishes dying from discarding. A destroyed zombie is
banished face-down by Malice and creates a Corrupted Corpse; the discarded
zombie remains in the graveyard. Both count for Forsaken Strike's two rewards.

`packages/cards/src/cards/actions/forsaken-strike.test.ts` covers all 16 legal
payment-count combinations, repeatable rewards, all modes together, invalid
ownership/type/zone/duplicate selections, independent payment caps, actual
combat damage, fully defended attacks, one action point for repeated go again,
bonus isolation between successive attacks, and Malice's death trigger.
The two layout cases in `forsaken-strike-interactions.test.tsx` drive the
six-reward flow through real DOM controls and verify progress and history.

Browser validation at 390×844 also exposed the discard prompt covering the
hand. The FAB mobile prompt now reserves the hand track when hand cards are
selectable. Direct taps selected all three discards after the fix. The complete
mobile sequence showed three destructions, three discards, two Gates, a 9-damage
hit (30 → 21 life), and one action point at resolution. Missing-art headers
are visually hidden to give the card name and rules more space; assistive status
text is retained.

Validation: 26 focused Forsaken Strike engine cases and both layout interaction
cases pass. Full FAB gate: 9,851 card tests and 4,037 engine tests pass, with the
existing four expected failures and one skip. Full agnostic gate: 277 app test
files / 2,220 tests pass. The gates ran with `VITEST_MAX_WORKERS=2` after stopping
an earlier run under host memory pressure; test scope was unchanged.

## PR review follow-up

Echoing Trap now groups played-name history by name before checking for another
matching play. The regression cases use Mask of Many Faces and real attacks:
a single attack with two names leaves the attacking hero's remaining card in
hand, while an earlier matching attack causes that card to be discarded.
The four Echoing Trap cases pass, including the original single-name contrast.
The Vox Necropolis scenario description also corrects “enteres” to “enters”.

The source-comparison concern in the review summary did not reproduce against
the scraper's saved output. Running `compare-source.mjs` against
`.cache/raw/fab-cube/en-US/1e693bf3b333bbc24835ba65d67e026fd50fd59a.json`
accepts `payload.cards` and returns 114 variants with no changes. The source
snapshot remains pinned; this check does not claim that newer reveals were
imported.

The merge keeps main's catalog-based presentation generator, including localized
printing validation and square/full artwork pairs. Presentation shards were
regenerated for the combined catalog. Localized catalogs were re-extracted from
their existing pinned raw snapshots against the combined English identities,
preserving their approved image URLs and source provenance.

Browser follow-up: the merged Echoing Trap fixture loaded on port 5190. Opening
Your Graveyard showed Nimblism alongside red and blue Brutal Assault, with an
empty attacking hand. The graveyard inspection interaction and rendered card
art were verified in the in-app browser at 1280 × 720.

Final review-follow-up validation: FAB `VITEST_MAX_WORKERS=2 pnpm exec vp run
ci-check` passed (9,853 card tests; 4,071 engine tests, four expected failures
and one skip). Agnostic `VITEST_MAX_WORKERS=2 pnpm run ci-check` passed,
including 285 simulator files / 2,285 tests. The merged artwork tests now use
an actual unavailable-art card and accessible card names; the bot-seat handoff
flow has a bounded 30-second test timeout and five-second bot-response wait.
