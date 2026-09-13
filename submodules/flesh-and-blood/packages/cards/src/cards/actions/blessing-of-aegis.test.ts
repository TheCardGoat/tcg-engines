import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { crossTheLineRed } from "./cross-the-line.ts";
import { nimblismBlue } from "./nimblism.ts";
import { blessingOfAegisYellow } from "./blessing-of-aegis.ts";

describe("Blessing of Aegis (OMN244) AAA", () => {
  it("happy: a card put into soul while this is in arena gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfAegisYellow, crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(blessingOfAegisYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Boltyn, blessingOfAegisYellow).toBeIn("arena");

    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveLife(21);
  });

  it("boundary: playing this does not gain life until a card is put into soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfAegisYellow],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(blessingOfAegisYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Boltyn, blessingOfAegisYellow).toBeIn("arena");
    expectFabPlayer(Boltyn).toHaveLife(20);
  });

  it("timing: at the start of your turn this goes to soul and that gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfAegisYellow],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(blessingOfAegisYellow);
    game.helpers.resolveUntilIdle();
    Boltyn.endTurn();
    game.helpers.resolveUntilIdle();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Boltyn, blessingOfAegisYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveLife(21);
  });
});
