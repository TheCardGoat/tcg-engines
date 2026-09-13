import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { spiritOfChristmasBlue } from "./spirit-of-christmas.ts";

describe("Spirit of Christmas (LGS355) AAA", () => {
  it("happy: each 1v1 hero creates Agility, Might, Vigor, and Gold", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [spiritOfChristmasBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(spiritOfChristmasBlue);
    game.helpers.resolveUntilIdle();

    expect(Dash.zone("arena")).toEqual(
      expect.arrayContaining(["token:agility", "token:might", "token:vigor", "token:gold"]),
    );
    expect(Bravo.zone("arena")).toEqual(
      expect.arrayContaining(["token:agility", "token:might", "token:vigor", "token:gold"]),
    );
    expectFabCard(Dash, spiritOfChristmasBlue).toBeIn("graveyard");
  });

  it("boundary: it cannot be played without an action point", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [spiritOfChristmasBlue], actionPoints: 0, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(dash).play(spiritOfChristmasBlue)).toThrow();
    expectFabCard(game.as(dash), spiritOfChristmasBlue).toBeIn("hand");
  });

  it("timing: go again refunds the Action AP", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [spiritOfChristmasBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(spiritOfChristmasBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
