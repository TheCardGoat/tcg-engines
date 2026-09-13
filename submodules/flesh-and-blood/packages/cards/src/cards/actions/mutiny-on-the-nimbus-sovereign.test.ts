import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gold } from "../tokens/gold.ts";
import { puffin } from "../heroes/puffin.ts";
import { snatchRed } from "./snatch.ts";
import { mutinyOnTheNimbusSovereignBlue } from "./mutiny-on-the-nimbus-sovereign.ts";

describe("Mutiny on the Nimbus Sovereign (SEA177) AAA", () => {
  it("happy: steal a Gold they control and the next attack gets overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheNimbusSovereignBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [gold], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(mutinyOnTheNimbusSovereignBlue);
    game.untilIdle();
    expect(Puffin.cardsIn("arena", gold)).toHaveLength(1);

    Puffin.playAttack(snatchRed);
    expectCombat(game).toHaveKeyword("overpower");
  });

  it("boundary: equal Gold does not steal and the next attack has no overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheNimbusSovereignBlue, snatchRed],
        arena: [gold],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [gold], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(mutinyOnTheNimbusSovereignBlue);
    game.untilIdle();

    Puffin.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("overpower");
  });

  it("timing: a miss on Gold (they have none) leaves the next attack without overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [mutinyOnTheNimbusSovereignBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(mutinyOnTheNimbusSovereignBlue);
    game.untilIdle();

    Puffin.playAttack(snatchRed);
    expectCombat(game).notToHaveKeyword("overpower");
  });
});
