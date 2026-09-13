import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tomeOfFyendalYellow } from "../actions/tome-of-fyendal.ts";
import { faceAdversity } from "./face-adversity.ts";

describe("Face Adversity (HVY198) AAA", () => {
  it("happy: after the attack controller draws this turn, this may defend", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tomeOfFyendalYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 8,
      },
      { hero: bravo, life: 20, head: [faceAdversity], hand: [], deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(faceAdversity);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, faceAdversity).toBeIn("graveyard");
  });

  it("boundary: no card drawn this turn — cannot defendWith", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, head: [faceAdversity], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    const rejected = Bravo.expectBlockRejected(faceAdversity);
    expect(rejected.accepted).toBe(false);
    expectFabCard(Bravo, faceAdversity).toBeIn("head");
  });

  it("timing: Blade Break destroys this after it does defend", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [tomeOfFyendalYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 8,
      },
      { hero: bravo, life: 20, head: [faceAdversity], hand: [], deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).play(tomeOfFyendalYellow);
    game.helpers.resolveUntilIdle();
    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(faceAdversity);
    expectFabCard(Bravo, faceAdversity).toBeIn("combatChain");
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, faceAdversity).toBeIn("graveyard");
    expectFabCard(Bravo, faceAdversity).toHaveKeyword("blade-break");
  });
});
