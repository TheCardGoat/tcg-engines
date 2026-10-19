# Alpha Clash local practice

## Existing practice paths

The shared workspace is `submodules/agnostic-simulator`. There is no
`submodules/game-agnostic` directory in this checkout.

| Game            | Practice path in this workspace                                                                                                 | Authority              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Grand Archive   | `games/grand-archive/practice-setup.ts` resolves selected decks and creates a local runtime; the page drives automated actions. | Local engine           |
| Flesh and Blood | `games/flesh-and-blood/data/create-local-practice-match.ts` creates a native match from the practice deck catalog.              | Local engine           |
| Cyberpunk       | `games/cyberpunk/engine/practice/practiceEngine.ts` and `sessionStorage.ts` own the local match and restore path.               | Local engine           |
| One Piece       | `games/one-piece/pages/Practice.page.tsx` creates ST-01 mirror practice through the native public commands.                     | Local engine           |
| Gundam          | `games/gundam/pages/Practice.page.tsx` requests a quick match, then opens the hosted match route.                               | Hosted; needs platform |

Paths above are relative to `apps/multi-game-simulator/src`.

## Alpha Clash setup

Open `/alpha-clash/simulator/play/practice` or
`/alpha-clash/simulator/practice`. Select both decks, the opponent, the
practice mode, and a seed. The human starts. Hot seat controls both seats.
The match menu includes New match, hot seat, bot pause/resume, and Next.

The adapter stores nine source lists in `src/practice-decks.ts`. All nine have
executable main decks and are offered for practice, including the exact
Kilimanjaro list with its two Endless Cycle cards. Practice and casual engine
creation permit invalid constructed lists. Format admission checks deck
construction separately. See the
[card support notes](alpha-clash-bot-lab.md#season-3-card-support-12-october-2026)
and [import notes](alpha-clash-bot-lab.md#season-3-import-11-october-2026) for the
construction policy and source limits. It stores and audits the
sideboards but excludes them from practice matches. The browser and bot-lab
import these definitions through `@tcg/alpha-clash-server-adapter/practice`.
The existing generated `starter-titan` and `starter-warden` links still work.

Canonical launch example:

```text
/alpha-clash/simulator/play/practice?playerDeck=clarity-hyper-aggro&opponentDeck=absence-makati&strategy=meta-v1&seed=42&mode=bot
```

Existing `deckA` and `deckB` parameters, including their `@seed` suffix,
are accepted. The `seed` parameter controls the native opening shuffle.
Invalid decks or strategies show a setup error instead of falling back.

`ALPHA_CLASH_RECOMMENDED_PRACTICE_STRATEGY` is `meta-v1`, the retained lab
baseline. `meta-v2` and `meta-v3` did not pass the saved promotion checks.
The shared heuristic checks each proposal on an isolated state copy, then
the adapter dispatches it through the native command boundary. Setup and
ordered choices reuse the native practice policy. Bot-lab uses the same
decision-seat resolver as the adapter, including opening declarations.

The recommended bot uses oracle information and can inspect hidden cards.
The setup page states this. Its use here is local practice; the hosted
`default` strategy still uses the existing basic policy. Lab strategies
remain ineligible for production promotion. See
[the lab report](alpha-clash-bot-lab.md) for engine limits and saved results.

## Expert opponent

Choose **Expert (full information)** or use `strategy=expert-oracle` in the
practice URL. It uses the same native turn planner as the bot lab, including
opposing hands, hidden card identities, deck order, and deterministic random
state. The bot searches legal command sequences before selecting an action.
The recommended selection remains `meta-v1`. See the
[Expert design and comparison](alpha-clash-bot-lab.md#expert-oracle-12-october-2026).

## Validation scope

See [the interaction audit](alpha-clash-practice-friction.md) for the complete
browser match, measured click counts, and proposed input reductions.

Focused checks cover exact lab deck identity, constructed legality, artwork,
seeded opening hands, rejected launch inputs, native opening actions, a full
recommended-heuristic match, and deterministic bot-lab replay. Browser checks
cover setup, match launch, native actions, player-visible logs, hot seat, and
bot pacing. These checks do not prove auth, hosted matches, persistence, or
deployment. No platform changes are part of this work.

### Checks, 11 October 2026

- Adapter: 29 focused tests passed; package type check and changed-source check passed.
- Simulator: 11 focused setup, match, log, and artwork tests passed; one server-render test passed; changed-source check passed.
- Bot-lab: 27 focused adapter, registry, and revision tests passed; changed-source check passed.
- Browser: selected-deck launch, resource deployment, automatic bot turn, public logs, pause/Next, New match, and Player 2 opening control passed. The setup fits a 390px viewport with no horizontal overflow.

An additional opening fixture test fails because its layout assertion expects
8 hand placements but receives 16. The same failure was reproduced with the
unchanged HEAD adapter in an isolated temporary copy. Opening layout sources
were not changed by this work.
