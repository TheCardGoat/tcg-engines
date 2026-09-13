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
import { banneretOfSalvationYellow } from "./banneret-of-salvation.ts";

describe("Banneret of Salvation (DTD055) AAA", () => {
  it("happy: charging this then hitting this turn gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfSalvationYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: banneretOfSalvationYellow,
    });
    game.closeCombat();
    Boltyn.attackWith(snatchRed);
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfSalvationYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveLife(21);
  });

  it("boundary: charging a different card then hitting does not gain 1{h} from this", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, nimblismBlue, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        life: 20,
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
    expectFabPlayer(Boltyn).toHaveLife(20);
  });

  it("timing: playing this as an attack does not arm the Solflare life gain", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [banneretOfSalvationYellow, snatchRed],
        actionPoints: 2,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(banneretOfSalvationYellow);
    game.closeCombat();
    Boltyn.attackWith(snatchRed);
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfSalvationYellow).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveLife(20);
  });
});
