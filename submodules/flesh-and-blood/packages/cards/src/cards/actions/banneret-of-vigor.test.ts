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
import { snatchRed } from "./snatch.ts";
import { banneretOfVigorYellow } from "./banneret-of-vigor.ts";

describe("Banneret of Vigor (DTD056) AAA", () => {
  it("happy: charging this then hitting this turn gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfVigorYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: banneretOfVigorYellow,
    });
    game.closeCombat();
    Boltyn.attackWith(snatchRed);
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfVigorYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveAP(0);
    expectFabPlayer(Boltyn).toHaveResourceCount(1);
  });

  it("boundary: charging a different card then hitting does not gain {r} from this", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.closeCombat();
    Boltyn.attackWith(snatchRed);
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveResourceCount(0);
  });

  it("timing: playing this as an attack does not arm the Solflare {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [banneretOfVigorYellow, snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(banneretOfVigorYellow);
    game.closeCombat();
    Boltyn.attackWith(snatchRed);
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfVigorYellow).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveResourceCount(0);
  });
});
