# Deck QA executable-promotion roadmap

The class-organized acceptance suites in `packages/engine/src/acceptance/deck-qa` (`wizard-play-lines.test.ts`, `brute-play-lines.test.ts`, and the sibling `*-play-lines.test.ts` files) contain executable full-turn scenarios. The former `it.todo` inventory has been resolved: distinct rules interactions were promoted to tests, while redundant or rules-invalid placeholders were removed. New scenarios must import the named real cards, start exactly two players with the documented hand and arsenal, use public moves and decisions, and assert only public zones, life, combat, resources, action points, visibility, and end-phase results.

## Promotion contract

1. Arrange through `FabTestEngine.start` with the documented cards, legal opposing response, explicit deck order, and a seed where randomness matters.
2. Use `Hero.must.pitch/play/playAttack/playFromArsenal/playReaction/defend/activate`, public priority passes, and `endTurn`.
3. Use the public `chooseBoolean`, `chooseOptions`, `chooseTargets`, or `game.answerDecision` path for real player choices. Do not mutate fixtures after start or reach into procedures to answer a card choice.
4. Disable automatic pitch/priority when the test proves payment or a defend/reaction window. Drain every decision and stack layer, then complete end phase.
5. Assert the player-visible outcome and paired false-condition/rejection case before marking the scenario green.

## First executable tranche

Promote one vertical test from each mechanics family before scaling the corpus:

- `DO-H1`: Dorinthea hit, optional re-attack, second-hit Dawnblade counter.
- `ZY-02`: Phantasm closes combat before damage against a 6+ non-Illusionist defender.
- `AU-H1`: Aurora Flow creation, off-card activation cost, Embodiment go-again consumption.
- `RH-H1`: Rhinar action-phase random-discard condition and its paired 6+/sub-6 branches.
- `BR-H1`: Briar's errata-aligned blocked/hit Embodiment boundary.
- `OS-D3`, `BL-D3`, `FI-D1`, and `KA-D3`: one real defensive/equipment chain for each remaining suite.

These establish the exact AAA grammar for combat, decisions, damage prevention, equipment lifecycle, and end-turn cleanup. The rest should then be promoted by shared capability cluster rather than by card name alone.

## Remaining implementation gates

| Gate                                       | Blocks                                                          | Owning area                                                                                                                               |
| ------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Dynamic Amp amount                         | No engine gate: public proof in `src/rules/oscilio-amp.test.ts` | Volzar, the Lightning Rod evaluates X at resolution and consumes Amp on the next arcane packet; remaining deck cases still need promotion |
| Mixed 2-red/2-yellow graveyard banish cost | `KA-H2`                                                         | Activation cost parsing and requirements                                                                                                  |
| Dynamic any-number Copper payment          | `KA-E4`                                                         | Blood on Her Hands needs typed repeatable modal declarations bound to the number of Copper paid                                           |

## Promotion risks to reproduce, not yet defects

- Aura copy/re-entry identity and enter-event boundaries (`ZY-06`, `ZY-H1`, `ZY-H2`, `ZY-C2`).
- Multi-Ward ordering and packet-by-packet re-evaluation (`ZY-D2`): Ward is mandatory under CR 8.3.20, so this is executable coverage rather than an implementation gate.
- Blaze's dynamic energy/X eligibility and next-arcane modifier composition.
- Card-specific arcane-damage riders, chain-link thresholds, counter cleanup, delayed draws, and equipment durability.
- Catalog-only equipment lines: run the real public scenario before categorising them as missing behavior.

## Determinism and public choices

Ordered fixture decks, seated equipment/arena/graveyard cards, counters, resources, life, start-game selections, and a seeded match are already supported. Explicit boolean, option, target, payment, and ordering decisions are also public. Exhaustive die-roll/random-discard assertions may need a dedicated forced-outcome fixture seam; until then use named seeds and assert the observed player-visible outcome, not private PRNG state.
