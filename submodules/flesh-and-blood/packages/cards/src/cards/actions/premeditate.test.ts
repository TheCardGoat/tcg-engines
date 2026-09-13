import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { premeditateRed } from "./premeditate.ts";

describe("Premeditate (OUT188) AAA", () => {
  it("happy: the next arsenal AAC gets +3{p} and a hit creates Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [premeditateRed],
        arsenal: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(premeditateRed);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(brutalAssaultBlue, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(game.as(bravo)).toHaveLife(13);
    expect(Dash.zone("arena")).toContain("token:ponder");
  });

  it("boundary: an AAC played from hand does not get the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [premeditateRed, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(premeditateRed);
    game.helpers.resolveUntilIdle();
    Dash.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds the Action AP spent to play Premeditate", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [premeditateRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(premeditateRed);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
