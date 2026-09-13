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
import { handBehindThePenRed } from "./hand-behind-the-pen.ts";

describe("Hand Behind the Pen (ROS220) AAA", () => {
  it("happy: hitting banishes a non-attack action from their arsenal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [handBehindThePenRed], resourcePoints: 2, deck: 6 },
      { hero: bravo, hand: [], arsenal: [sloggismRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(handBehindThePenRed);
    expectCombat(game).toHaveAttackPower(6);
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabCard(Bravo, sloggismRed).toBeBanished();
  });

  it("boundary: an attack action in arsenal is not banished", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [handBehindThePenRed], resourcePoints: 2, deck: 6 },
      { hero: bravo, hand: [], arsenal: [snatchRed], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(handBehindThePenRed);
    game.advanceUntil({ stopAt: "idle", optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Bravo).toHaveLife(14);
    expectFabCard(Bravo, snatchRed).toBeIn("arsenal");
  });

  it("timing: a miss does not banish their arsenal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [handBehindThePenRed], resourcePoints: 2, deck: 6 },
      {
        hero: bravo,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue],
        arsenal: [sloggismRed],
        life: 20,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(handBehindThePenRed);
    Bravo.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, sloggismRed).toBeIn("arsenal");
  });
});
