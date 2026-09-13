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
import { banneretOfGallantryYellow } from "./banneret-of-gallantry.ts";

describe("Banneret of Gallantry (DTD049) AAA", () => {
  it("happy: charging this to soul creates a Quicken token", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfGallantryYellow],
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
      chargeCard: banneretOfGallantryYellow,
    });
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfGallantryYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("quicken", 1);
  });

  it("boundary: charging a different card does not create Quicken from this", () => {
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
    expectFabPlayer(Boltyn).toHaveTokenCount("quicken", 0);
  });

  it("timing: playing this as an attack does not create Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [banneretOfGallantryYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(banneretOfGallantryYellow);
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfGallantryYellow).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveTokenCount("quicken", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
