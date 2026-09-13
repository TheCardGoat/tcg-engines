import { describe, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { sloggismRed } from "./sloggism.ts";
import { smashUpRed } from "./smash-up.ts";

describe("Smash Up (ROS221) AAA", () => {
  it("happy: hitting banishes an attack action from their arsenal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [smashUpRed], resourcePoints: 1, deck: 6 },
      { hero: bravo, hand: [], arsenal: [snatchRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(smashUpRed);
    expectCombat(game).toHaveAttackPower(5);
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(15);
    expectFabCard(Bravo, snatchRed).toBeBanished();
  });

  it("boundary: a non-attack action in arsenal is not banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [smashUpRed], resourcePoints: 1, deck: 6 },
      { hero: bravo, hand: [], arsenal: [sloggismRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(smashUpRed);
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(15);
    expectFabCard(Bravo, sloggismRed).toBeIn("arsenal");
  });

  it("timing: a miss does not banish their arsenal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [smashUpRed], resourcePoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(smashUpRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, snatchRed).toBeIn("arsenal");
  });
});
