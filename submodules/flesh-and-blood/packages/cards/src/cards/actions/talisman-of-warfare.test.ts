import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { dustRunnerOutlawBlue } from "./dust-runner-outlaw.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { talismanOfWarfareYellow } from "./talisman-of-warfare.ts";

describe("Talisman of Warfare (EVR193) AAA", () => {
  it("happy: exactly 2 damage to an opposing hero destroys this and all arsenals", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfWarfareYellow],
        hand: [dustRunnerOutlawBlue],
        arsenal: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [heartOfFyendalBlue], deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(dustRunnerOutlawBlue);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabCard(Bravo, talismanOfWarfareYellow).toBeIn("graveyard");
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
    expectFabCard(game.as(dash), heartOfFyendalBlue).toBeIn("graveyard");
  });

  it("boundary: 4 damage does not fire", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfWarfareYellow],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [heartOfFyendalBlue], deck: 6 },
    );

    game.as(bravo).playAttack(snatchRed);
    game.closeCombat();

    expectFabCard(game.as(bravo), talismanOfWarfareYellow).toBeIn("arena");
    expectFabCard(game.as(dash), heartOfFyendalBlue).toBeIn("arsenal");
  });

  it("timing: a miss dealing 0 does not fire", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [talismanOfWarfareYellow],
        hand: [dustRunnerOutlawBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], arsenal: [heartOfFyendalBlue], deck: 6 },
    );

    game.as(bravo).playAttack(dustRunnerOutlawBlue);
    game.as(dash).defendWith(nimblismBlue);
    game.closeCombat();

    expectFabCard(game.as(bravo), talismanOfWarfareYellow).toBeIn("arena");
    expectFabCard(game.as(dash), heartOfFyendalBlue).toBeIn("arsenal");
  });
});
