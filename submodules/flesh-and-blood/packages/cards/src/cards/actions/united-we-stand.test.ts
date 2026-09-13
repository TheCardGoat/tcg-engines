import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { unitedWeStandYellow } from "./united-we-stand.ts";

/**
 * United We Stand (DTD079) — Light Action Attack.
 * Printed Unity: When this defends together with a card from hand, if Boltyn
 * is in your party, create a Courage token under his control. Then repeat for
 * Bravo/Seismic Surge, Briar/Embodiment of Earth, Dorinthea/Courage, Lexi/
 * Embodiment of Lightning, Oldhim/Spellbane Aegis, Prism/Spectral Shield, and
 * Shiyana/Eloquence.
 */

describe("United We Stand (DTD079) AAA", () => {
  it("happy: Unity with Boltyn in party creates Courage when defending together from hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        hand: [unitedWeStandYellow, nimblismBlue],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith(unitedWeStandYellow, nimblismBlue);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
  });

  it("boundary: defending alone does not fire Unity", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        hand: [unitedWeStandYellow],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);

    game.as(dash).playAttack(snatchRed);
    Boltyn.defendWith(unitedWeStandYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
  });
});
