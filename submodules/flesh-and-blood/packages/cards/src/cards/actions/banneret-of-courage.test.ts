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
import { banneretOfCourageYellow } from "./banneret-of-courage.ts";

describe("Banneret of Courage (DTD048) AAA", () => {
  it("happy: charging this to soul creates a Courage token", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfCourageYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: banneretOfCourageYellow,
    });
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfCourageYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
  });

  it("boundary: charging a different card does not create Courage from this", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
  });

  it("timing: playing this as an attack does not create Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [banneretOfCourageYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(banneretOfCourageYellow);
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfCourageYellow).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
