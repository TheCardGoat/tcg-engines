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
import { blessingOfBellonaYellow } from "./blessing-of-bellona.ts";

describe("Blessing of Bellona (PEN181) AAA", () => {
  it("happy: a card put into soul while this is in arena creates Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfBellonaYellow, crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(blessingOfBellonaYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Boltyn, blessingOfBellonaYellow).toBeIn("arena");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);

    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
  });

  it("boundary: playing this does not create Courage until a card is put into soul", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfBellonaYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(blessingOfBellonaYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Boltyn, blessingOfBellonaYellow).toBeIn("arena");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
  });

  it("timing: at the start of your turn this goes to soul and that creates Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [blessingOfBellonaYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.play(blessingOfBellonaYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Boltyn, blessingOfBellonaYellow).toBeIn("arena");

    Boltyn.endTurn();
    game.untilIdle({ ordering: "listed" });
    game.as(dash).endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Boltyn, blessingOfBellonaYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
  });
});
