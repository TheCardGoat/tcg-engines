import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { natureSPathPilgrimageRed } from "./nature-s-path-pilgrimage.ts";

/**
 * Nature's Path Pilgrimage (TEA013) — Warrior Action, cost 1, 3{d}, go again.
 *
 * Printed: Your next weapon attack this turn gains +3{p} and "If this hits
 * and you have no cards in your arsenal, reveal the top card of your deck.
 * If it's an action card, put it face down into your arsenal."
 * Go again
 */

describe("Nature's Path Pilgrimage (TEA013) AAA", () => {
  it("happy: next weapon attack gains +3{p}; on hit with empty arsenal an action top goes face down to arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [natureSPathPilgrimageRed],
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(natureSPathPilgrimageRed);
    game.untilIdle();
    expectFabCard(Boltyn, natureSPathPilgrimageRed).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveAP(1);

    Boltyn.activateAttack(cintariSaber);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: snatchRed.canonicalId,
      optionalBoolean: false,
      ordering: "listed",
    });

    expectFabCard(Boltyn, snatchRed).toBeIn("arsenal").toBeFaceDown();
    expectFabPlayer(game.as(kano)).toHaveLife(10);
  });

  it("boundary: an occupied arsenal skips the reveal", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [natureSPathPilgrimageRed],
        weapon1: [cintariSaber],
        arsenal: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(natureSPathPilgrimageRed);
    game.untilIdle();
    Boltyn.activateAttack(cintariSaber);
    expectCombat(game).toHaveAttackPower(5);
    game.untilIdle({ optionals: "decline", ordering: "listed", entityTargets: "minimum" });

    expectFabCard(Boltyn, nimblismBlue).toBeIn("arsenal");
    expect(Boltyn.cardsIn("deck", snatchRed)).toHaveLength(1);
  });

  it("timing: a miss does not put the top card into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [natureSPathPilgrimageRed],
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: kano, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Kano = game.as(kano);

    Boltyn.play(natureSPathPilgrimageRed);
    game.untilIdle();
    Boltyn.activateAttack(cintariSaber);
    Kano.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Kano).toHaveLife(15);
    expect(Boltyn.cardsIn("deck", snatchRed)).toHaveLength(1);
    expect(Boltyn.zone("arsenal")).toHaveLength(0);
  });
});
