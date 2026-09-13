import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { seismicSurge } from "../tokens/seismic-surge.ts";
import { basaltBoots } from "./basalt-boots.ts";

describe("Basalt Boots (PEN019) AAA", () => {
  it("happy: +1{d} while you control a Seismic Surge", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        legs: [basaltBoots],
        arena: [seismicSurge],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, basaltBoots).toHaveDefense(2);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(basaltBoots);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, basaltBoots).toBeIn("legs");
    expectFabCard(Bravo, basaltBoots).toHaveDefenseCounters(-1);
  });

  it("boundary: no Seismic Surge means printed d1 and Temper destroys it", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, legs: [basaltBoots], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, basaltBoots).toHaveDefense(1);
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(basaltBoots);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, basaltBoots).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(17);
  });
});
