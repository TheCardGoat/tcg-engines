# Hard OP TCG interactions — research note

Bounded sample of high-severity official interactions used to harden the engine.
Sources are official Bandai materials (Comprehensive Rules, set Q&A PDFs on
`en.onepiece-cardgame.com`, and official errata announcements). Community
content is not treated as authoritative.

**Status key:** `covered` = already proven by a command-driven engine test;
`new-test` = proven by `tests/rules/topics/hard-interactions.test.ts` in this
work; `gap` = documented only (not expressible or deferred).

| # | Family | Source type | Interaction (plain language) | Status |
|---|--------|-------------|------------------------------|--------|
| 1 | [Once Per Turn] decline | CR 8-1-2 / 10-2-13; OP12 Q&A (Koala may choose not to activate OPT) | Declining an optional [Once Per Turn] effect does **not** spend the once-per-turn budget; a later same-turn opportunity may still activate | **new-test** (`OPT decline then re-activate`) |
| 2 | [Once Per Turn] multi-instance | CR 10-2-13-2 | Separate physical cards each get their own once-per-turn activation | **covered** (`10-keywords.test.ts` Sunny-Kun pair) |
| 3 | Life [Trigger] before leader reaction | Official FAQ OP-13 (Portgas.D.Ace): Trigger processes first when taking damage | When damage reveals a Trigger Life card, the Trigger decision/process runs before “when you take damage” draw; Ace DON!! x1 is armed on the Leader | **new-test** (`hard: Life Trigger is offered before when-you-take-damage` — hand stays 0 while `lifeTrigger` pending; after skip, hand=2 = Trigger card + Ace draw) |
| 4 | Multi-Life / Double Attack Trigger order | CR 7-1-4 / 10-1-2; community restatement of official order (FIFO of revealed Life) | Double Attack deals two Life damage; each damage reveals and may offer Trigger before the next damage continues | **covered** (`07-battle` Double Attack; `08-effects` Ace waits for both damages) |
| 5 | Mid-Counter attacker removal | CR 7-1-3-3; OP05 Q&A (KO attacker mid-Counter) | If the attacking Character leaves the field during Counter, the battle ends without the Damage Step | **covered** + **new-test** (OP04-038 Counter rest→K.O. attacker; no Life damage) |
| 6 | [Unblockable] vs [Blocker] | CR 10-1-7 | Unblockable prevents the defending player from activating Blocker | **covered** (`10-keyword-effects` Terracotta/Chaka) |
| 7 | [Banish] vs Life [Trigger] | CR 10-1-3 | Banish trashes damaged Life without offering Trigger | **covered** (`10-keyword-effects` Banish + control) |
| 8 | OP-01 “up to” errata | Official Rules announcement [“Up to” Card Errata OP-01](https://en.onepiece-cardgame.com/rules/announcements/op01.php) (2022-11-11) | Many OP-01 effects that said “1” are “up to 1” (may choose 0); e.g. K.O./power-give targets | **new-test** (Caribou On K.O. choose 0; Otama On Play choose 0) |
| 9 | Power after Counter before K.O. | Official Q&A OP-05 (Character power becomes ≥5000 in Counter when it would be K.O.’d) | Live power after Counter Step is what decides K.O., not power at attack declaration alone | **gap** (needs a catalog Counter that raises defender power across the KO threshold with a tight fixture; not forced green here) |
| 10 | Empty deck mid-effect | CR 9-1-2 / 9-2-1-2 | Drawing the last deck card mid-effect ends the game immediately | **covered** (`09-rule-processing`, overview empty-deck matrix) |
| 11 | Simultaneous choices | CR 1-3-4 / 1-3-10 | Turn player resolves simultaneous choices first | **covered** (`01-game-overview` waste-of-life dual trash) |
| 12 | Prohibition vs required action | CR 1-3-3 | Cannot-rest / cannot-attack-Leader beat effects that require those actions | **covered** (`topics/prohibitions.test.ts`) |
| 13 | Event [Main] vs Life [Trigger] activation | CR 8 / 10-1-5; FAQ language | Activating an Event from hand (Main/Counter) is Event activation; activating a Trigger from Life is not playing the Event as a Main Event | **new-test** (Snake Shot Life Trigger K.O.s rested attacker with `activeDon:0` / no Event cost; card to trash) |
| 14 | Replacement “instead” decline | Official Q&A OP-05 Sabo-style replacements | Declining optional replacement (e.g. −power instead of K.O.) allows the original K.O. to proceed | **gap** (Sabo multi-character simultaneous replacement not forced in this sample) |

## Test mapping (this delivery)

| Criterion 3 family | Test id (in `hard-interactions.test.ts`) |
|--------------------|------------------------------------------|
| (a) OPT decline does not spend | `hard: OPT decline does not spend once-per-turn (Sunny-Kun)` |
| (a) multi-trigger OPT | `hard: OPT reactive decline leaves a later same-turn window (Usopp)` |
| (b) Trigger before damage reaction | `hard: Life Trigger is offered before when-you-take-damage leader reaction (Ace)` (+ Trigger≠Event cost: Snake Shot Life Trigger) |
| (c) mid-battle / Counter removal | `hard: Counter Event K.O. of attacker ends battle without Life damage` |
| (c) Unblockable control already in keywords; battle end is the mid-step proof | (see above + existing Unblockable suite) |
| (d) official errata/FAQ wording | `hard: OP-01 up-to errata — Caribou On K.O. may choose 0`; `hard: OP-01 up-to errata — Otama On Play may choose 0` |

## Links (official)

- Comprehensive Rules 1.2.0: https://en.onepiece-cardgame.com/pdf/rule_comprehensive.pdf?20260116
- Rules hub / errata index: https://en.onepiece-cardgame.com/rules/
- “Up to” Card Errata [OP-01]: https://en.onepiece-cardgame.com/rules/announcements/op01.php
- Q&A samples: https://en.onepiece-cardgame.com/pdf/qa_op05.pdf , https://en.onepiece-cardgame.com/pdf/qa_op12.pdf , https://en.onepiece-cardgame.com/pdf/qa_op13.pdf
