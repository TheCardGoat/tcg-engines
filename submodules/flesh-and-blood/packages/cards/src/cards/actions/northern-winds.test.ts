import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oldhim } from "../heroes/oldhim.ts";
import { rottenOldBuckler } from "../equipment/rotten-old-buckler.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { northernWindsBlue } from "./northern-winds.ts";

describe("Northern Winds (DTD197) AAA", () => {
  it("happy: freezes up to 1 opposing equipment until the start of your next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [northernWindsBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        weapon2: [rottenOldBuckler],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(northernWindsBlue);
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(game.as(dash), rottenOldBuckler).toBeFrozen();
    expectFabCard(Oldhim, northernWindsBlue).toBeIn("graveyard");
  });

  it("boundary: declining freeze leaves the equipment unfrozen", () => {
    const game = FabTestEngine.start(
      {
        hero: oldhim,
        hand: [northernWindsBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        weapon2: [rottenOldBuckler],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    Oldhim.play(northernWindsBlue);
    game.untilIdle({ entityTargets: "pause" });
    Oldhim.target();
    game.untilIdle();

    expectFabCard(game.as(dash), rottenOldBuckler).toBeIn("weapon2");
  });

  it("timing: Unity defending together from hand creates a Spellbane Aegis token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oldhim,
        hand: [northernWindsBlue, nimblismBlue],
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Oldhim = game.as(oldhim);

    game.as(dash).playAttack(snatchRed);
    Oldhim.defendWith(northernWindsBlue, nimblismBlue);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(Oldhim).toHaveTokenCount("spellbane-aegis", 1);
  });
});
