import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { riftingRed } from "./rifting.ts";

describe("Rifting (ARC194) AAA", () => {
  it("happy: hit lets the next non-attack action play as an instant", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [riftingRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(riftingRed);
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "accept" });

    expectFabPlayer(Dash).toHaveLife(14);
    Bravo.play(nimblismBlue);
    game.untilIdle();

    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: a miss does not grant instant timing", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [riftingRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(riftingRed);
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    Bravo.pass();
    expect(() => Bravo.play(nimblismBlue)).toThrow();
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
  });

  it("timing: an attack action is not the granted instant", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [riftingRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(riftingRed);
    game.closeCombat({ optionals: "accept" });
    Bravo.pass();
    expect(() => Bravo.play(snatchRed)).toThrow();
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
  });
});
