import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gold } from "../tokens/gold.ts";
import { puffin } from "../heroes/puffin.ts";
import { snatchRed } from "./snatch.ts";
import { mutinyOnTheBattalionBarqueBlue } from "./mutiny-on-the-battalion-barque.ts";

describe("Mutiny on the Battalion Barque (SEA176) AAA", () => {
  it("happy: steal a Gold they control and the next attack gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheBattalionBarqueBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [gold], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);
    const Dash = game.as(dash);

    Puffin.play(mutinyOnTheBattalionBarqueBlue);
    game.untilIdle();

    expect(Puffin.cardsIn("arena", gold)).toHaveLength(1);
    expect(Dash.cardsIn("arena", gold)).toHaveLength(0);

    Puffin.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: equal Gold does not steal and the next attack stays 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheBattalionBarqueBlue, snatchRed],
        arena: [gold],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [gold], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);
    const Dash = game.as(dash);

    Puffin.play(mutinyOnTheBattalionBarqueBlue);
    game.untilIdle();

    expect(Puffin.cardsIn("arena", gold)).toHaveLength(1);
    expect(Dash.cardsIn("arena", gold)).toHaveLength(1);

    Puffin.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: stealing Gold refunds go again so the follow-up attack is this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheBattalionBarqueBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [gold], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(mutinyOnTheBattalionBarqueBlue);
    game.untilIdle();
    expectFabPlayer(Puffin).toHaveAP(1);

    Puffin.playAttack(snatchRed);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(14);
  });
});
