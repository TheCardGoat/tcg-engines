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
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { outedRed } from "./outed.ts";

describe("Outed (HNT235) AAA", () => {
  it("happy: leftover AP after close and +1{p} vs a marked defender", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [outedRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(outedRed);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(16);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: a marked hero cannot play this", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [outedRed],
        marked: true,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.playAttack(outedRed)).toThrow();
    expectFabCard(Dash, outedRed).toBeIn("hand");
    expect(game.combat()).toBeNull();
  });

  it("timing: go again does not leak to a second AAC", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [outedRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(outedRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
