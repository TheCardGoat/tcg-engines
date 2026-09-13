# Tournament deck release QA plans

These are test **plans**, not evidence that the listed cards currently work. They turn every fixture in [`../deck-text-fixtures.ts`](../../deck-text-fixtures.ts) into release-facing AAA acceptance work. There are 22 lists and 15 hero documents; Vynnset and Oscilio each have two list-specific sections in one hero document.

Executable cases live under [`src/acceptance/deck-qa`](../../../acceptance/deck-qa), grouped by class (`wizard-play-lines.test.ts`, `brute-play-lines.test.ts`, and so on). Each file keeps that class's promoted play lines and remaining `it.todo` contracts together.

## Common AAA contract

Every named scenario uses `FabTestEngine.start` with exactly two players. Arrange four named cards in the acting hero's hand and exactly one named card in that hero's arsenal. The opponent has a deterministic hand/deck large enough to defend, pay prevention, and draw. Act only through the public fluent driver: pitch, play, defend, react, pass priority, and end turn. Resolve every decision/stack item, then run the end phase. Assert player-visible zones, life/damage, combat-chain result, action/resource cleanup, pitch cycling, arsenal result, and draw-to-intellect. This exercises normal action play and end-phase lifecycle (CR 4.3, 4.4), card play (CR 5.1), combat (CR 7), and go again (CR 8.3.5).

A defensive scenario begins with the same four-card hand and one-card arsenal before the opponent's attack. It drives declaration in the Defend Step, reactions only in the Reaction Step, damage, chain-link resolution/close, and then the hero's next complete turn. Declaring a card is not playing it (CR 7.3.2); defense reactions must be played and resolve as defending cards (CR 7.4.2); `defend alone` and `defend together` are event-shape assertions, not final card-count shortcuts (CR 7.0.5e).

`CARD-SWEEP` in each document is deliberately data-driven: iterate every unique arena card and every unique `(name, pitch colour)` printing named by that fixture. For each legal card, arrange it in one of the five slots, pay with fixture-legal pitch cards, use it from its legal zone/window, resolve to quiescence, and finish the turn. Assert catalog resolution, legal command exposure, payment, destination, and no stranded priority/decision. A sweep is a configuration gate; it is not a substitute for the interaction cases below it.

`HERO-SWEEP` proves every clause of the hero card, including false-condition and once-per-turn boundaries. `ARENA-SWEEP` equips every legal fixture loadout and proves each weapon/equipment ability, defend trigger, prevention keyword, counter, destroy/banish cost, and end-phase cleanup. Mutually exclusive equipment is tested in separate loadouts. A keyword-only card such as Nullrune equipment still needs a real arcane-damage prevention case.

## Static analysis snapshot

The 2026-08-11 fixture inventory contains 408 unique card names. Every name resolves to a local card module after treating `Consign to Cosmos||Shock` as the fixture's exact split-card spelling. Twenty-six cards have empty localized display text while retaining authored structured behavior: Gold-Baited Hook, Cheating Scoundrel, Avast Ye!, Loot the Hold, Shadow Puppetry, Oaken Old, Tear Asunder, Cleave, Breaking Point, Burning Blade Dance, Display Loyalty, Hot on Their Heels, Legacy of Ikaru, Nourishing Emptiness, Unsheathed, Blood Follows Blade, Jagged Edge, Steelblade Supremacy, Warrior's Valor, Teklo Leveler, Terminator Tank, War Machine, Mauvrion Skies, Machinations of Dominion, and Tempestuous Kiss. Their acceptance cases must assert both the executable outcome and the player-visible card text; authored structure alone is not release proof.

## Status language

`Planned` means no conclusion about implementation has been made. `Blocked` means the scenario cannot yet be expressed through the public driver and must first gain an owning engine capability. Do not convert a blocked scenario to white-box state mutation just to make a test green.

## Required release gate per fixture

1. Fixture parsing resolves hero, every arena card, and every pitch-coloured main-deck printing.
2. `CARD-SWEEP` is green for every legal card/window in the list.
3. `HERO-SWEEP` and `ARENA-SWEEP` are green, including at least one real defensive chain link and one arcane-prevention loadout where the fixture supplies it.
4. Every hero-specific case below is green, or is an explicitly triaged `it.todo` with its missing public capability and owning module.
5. A failing card is classified as catalog/display resolution, legality/prompt, payment/pitch, effect, combat, trigger/replacement, equipment lifecycle, or turn-cleanup before repair.
