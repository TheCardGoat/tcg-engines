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
import { mutinyOnTheSwiftwaterBlue } from "./mutiny-on-the-swiftwater.ts";

describe("Mutiny on the Swiftwater (SEA178) AAA", () => {
  it("happy: steal a Gold they control and the next attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheSwiftwaterBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [gold], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(mutinyOnTheSwiftwaterBlue);
    game.untilIdle();
    expect(Puffin.cardsIn("arena", gold)).toHaveLength(1);

    Puffin.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(Puffin).toHaveAP(1);
  });

  it("boundary: equal Gold does not steal and the next attack has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheSwiftwaterBlue, snatchRed],
        arena: [gold],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [gold], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(mutinyOnTheSwiftwaterBlue);
    game.untilIdle();

    Puffin.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(Puffin).toHaveAP(0);
  });

  it("timing: with no Gold on either side the steal is skipped", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheSwiftwaterBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(mutinyOnTheSwiftwaterBlue);
    game.untilIdle();
    expect(Puffin.cardsIn("arena", gold)).toHaveLength(0);

    Puffin.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("go-again");
  });
});
