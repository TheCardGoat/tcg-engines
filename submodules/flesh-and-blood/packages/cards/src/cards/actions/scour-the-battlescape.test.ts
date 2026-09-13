import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { scourTheBattlescapeRed } from "./scour-the-battlescape.ts";

describe("Scour the Battlescape (WTR194) AAA", () => {
  it("happy: putting a card on the bottom draws 1 and attacks for 3", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [scourTheBattlescapeRed, nimblismBlue],
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(scourTheBattlescapeRed);
    game.passBoth();
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expect(Bravo.zone("deck")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("hand")).toContain(snatchRed.canonicalId);
  });

  it("boundary: declining the bottom does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [scourTheBattlescapeRed, nimblismBlue],
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(scourTheBattlescapeRed);
    game.passBoth();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("timing: played from arsenal, it gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue],
        arsenal: [scourTheBattlescapeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(scourTheBattlescapeRed, { from: "arsenal" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expect(Bravo.zone("arsenal")).toHaveLength(0);
    expectFabCard(Bravo, scourTheBattlescapeRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(1);
  });
});
