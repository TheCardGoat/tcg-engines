import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { gravekeepingRed } from "./gravekeeping.ts";

describe("Gravekeeping family AAA", () => {
  it("happy: an attack may banish a card from the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [gravekeepingRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, graveyard: [nimblismBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(gravekeepingRed, { optionals: "accept" });
    game.closeCombat();
    expectFabCard(game.as(bravo), nimblismBlue).toBeBanished();
  });
  it("boundary: an empty graveyard leaves the attack playable", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [gravekeepingRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, graveyard: [], deck: 6 },
    );
    game.as(dash).playAttack(gravekeepingRed);
    game.closeCombat({ optionals: "decline" });
    expectFabCard(game.as(dash), gravekeepingRed).toBeIn("graveyard");
  });
  it("timing: declining the optional leaves the graveyard card", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [gravekeepingRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: bravo, graveyard: [nimblismBlue], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(gravekeepingRed, { optionals: "decline" });
    game.closeCombat();
    expectFabCard(game.as(bravo), nimblismBlue).toBeIn("graveyard");
  });
});
