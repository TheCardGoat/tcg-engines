import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectWait,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { outForBloodRed } from "./out-for-blood.ts";
import { unifiedDecreeYellow } from "./unified-decree.ts";

/**
 * Unified Decree (CRU083) — Warrior Attack Reaction.
 * Printed: "Target weapon attack gains +3{p}.
 * Reprise - If the defending hero has defended with a card from their hand
 * this chain link, look at the top card of your deck. If it's an attack
 * reaction card, you may banish it. If you do, you may play it this combat
 * chain."
 *
 * Module fixed (FIX-5, plan §5): the a2 binding-matches filter was authored
 * `subtypes: ["Reaction"]`, but "Attack Reaction" is a card TYPE (CR 1.3.2c),
 * never a subtype — the filter could never match, so the banish optional was
 * never offered even with an attack reaction on deck top and Reprise met
 * (ARC119/W2-FIX2 defect class). The filter is reshaped to
 * `types: ["Attack Reaction"]` and the full printed chain is proven below:
 * banish optional → play-this-combat-chain optional → the banished reaction
 * is actually played from banish on a later link of the same combat chain.
 */

describe("Unified Decree (CRU083) AAA", () => {
  it("happy: the targeted weapon attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [unifiedDecreeYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.advanceCombatTo("reaction");

    Kassai.must.playReaction(unifiedDecreeYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();
  });

  it("happy: Reprise met + attack reaction on deck top - banish it and play it from banish this combat chain", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        weapon2: [cintariSaber],
        hand: [unifiedDecreeYellow],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
        deckTop: [outForBloodRed],
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    // Link 1: dash defends from hand (Reprise), and the looked deck top is an
    // attack reaction, so the printed banish optional must surface.
    Kassai.activate(cintariSaber, { index: 0 });
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(unifiedDecreeYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5); // a1 still boosts the saber
    Kassai.expectDecision("boolean"); // the banish optional is offered
    Kassai.accept();
    Kassai.expectDecision("boolean"); // …then the play-this-combat-chain optional
    Kassai.accept();
    expect(Kassai.zone("banished")).toContain(outForBloodRed.canonicalId);
    expect(Kassai.cardsIn("deck", outForBloodRed)).toHaveLength(0);

    // Link 2: a second saber attack — the granted permission plays the
    // banished attack reaction from banish during the reaction step.
    game.advanceCombatTo("resolution");
    Kassai.activate(cintariSaber, { index: 1 });
    game.advanceCombatTo("defend");
    Dash.defendWith();
    game.advanceCombatTo("reaction");
    Kassai.play(outForBloodRed, { from: "banished" });
    game.passBoth();

    // Out for Blood's own a1 boosts the second weapon attack: 2 + 3 = 5.
    expectCombat(game).toHaveAttackPower(5);
    expect(Kassai.zone("banished")).not.toContain(outForBloodRed.canonicalId);

    game.helpers.resolveRestOfCombat();
    // Link 1: 5 - 2 (Nimblism) = 3; link 2: 5 unblocked.
    expectFabPlayer(Dash).toHaveLife(12);
    expectFabCard(Kassai, outForBloodRed).toBeIn("graveyard");
  });

  it("boundary: Reprise not met (no defense from hand) - no look, no banish, deck top untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [unifiedDecreeYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
        deckTop: [outForBloodRed],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.advanceCombatTo("reaction");

    Kassai.must.playReaction(unifiedDecreeYellow);
    game.passBoth();

    // a1 lands independently of Reprise…
    expectCombat(game).toHaveAttackPower(5);
    // …but the unmet Reprise condition gates the whole a2 sequence: no
    // optional decision pends and the attack reaction stays on the deck.
    expectWait(game).notToHaveDecision();
    expect(Kassai.zone("banished")).toHaveLength(0);
    expect(Kassai.cardsIn("deck", outForBloodRed)).toHaveLength(1);
    game.helpers.resolveRestOfCombat();
  });

  it("boundary: Reprise met but the deck top is not an attack reaction - no banish offered", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [unifiedDecreeYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
        deckTop: [snatchRed],
      },
      { hero: dash, life: 20, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    // Reprise is met (Nimblism from hand), but the looked card is an attack
    // ACTION, not an attack reaction: the types filter must not over-match.
    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");

    Kassai.must.playReaction(unifiedDecreeYellow);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectWait(game).notToHaveDecision();
    expect(Kassai.zone("banished")).toHaveLength(0);
    expect(Kassai.cardsIn("deck", snatchRed)).toHaveLength(1);
    game.helpers.resolveRestOfCombat();
  });

  it("boundary: no weapon attack on the chain — the reaction is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [snatchRed, unifiedDecreeYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    // An action-attack chain link carries no Weapon object to target.
    Kassai.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith();
    game.advanceCombatTo("reaction");

    expect(() => Kassai.must.playReaction(unifiedDecreeYellow)).toThrow();
  });
});
