import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { azalea } from "../heroes/azalea.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { browbeatBlue } from "./browbeat.ts";

describe("Browbeat (OMN213) AAA", () => {
  it("happy: +1{p} for each card in hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [browbeatBlue, nimblismBlue, snatchRed], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(browbeatBlue);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("boundary: empty hand leaves printed 1{p}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [browbeatBlue], actionPoints: 1, deck: 6 },
      { hero: azalea, hand: [], deck: 6 },
    );
    game.as(dash).playAttack(browbeatBlue);
    expectCombat(game).toHaveAttackPower(1);
  });

  it("timing: the hand-count buff is only while this is attacking", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [browbeatBlue, nimblismBlue],
        arsenal: [snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);
    Dash.playAttack(browbeatBlue);
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat();
    expectFabCard(Dash, browbeatBlue).toBeIn("graveyard");
    Dash.playAttack(snatchRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(4);
  });
});
