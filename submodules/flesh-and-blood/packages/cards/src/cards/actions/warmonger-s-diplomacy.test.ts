import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { warmongerSDiplomacyBlue } from "./warmonger-s-diplomacy.ts";

describe("Warmonger's Diplomacy (DTD230) AAA", () => {
  it("happy: default war stamps diplomacyChoice and allows attack actions next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [warmongerSDiplomacyBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(warmongerSDiplomacyBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "war" });
    expectFabCard(Bravo, warmongerSDiplomacyBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveDiplomacyChoice("war");
    expectFabPlayer(Dash).toHaveDiplomacyChoice("war");

    // until-end-of-next-turn covers the following turn (Dash's next turn).
    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Dash.attackWith(snatchRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: war forbids non-attack actions on the restricted turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [warmongerSDiplomacyBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(warmongerSDiplomacyBlue);
    game.helpers.resolveUntilIdle({ effectResolution: "war" });
    expectFabPlayer(Dash).toHaveDiplomacyChoice("war");

    Bravo.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(() => Dash.play(nimblismBlue)).toThrow();
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });
});
