import { describe, expect, it } from "vitest";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { smashInstinctRed } from "./smash-instinct.ts";

describe("Smash Instinct (RNR012) AAA", () => {
  it("happy: attacking intimidates a card from the defending hand", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [smashInstinctRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(smashInstinctRed);

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("banished");
    expectFabCard(Dash, brutalAssaultBlue).toBeFaceDown();
  });

  it("boundary: an empty defending hand banishes nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [smashInstinctRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(bravo).playAttack(smashInstinctRed);

    expectFabPlayer(game.as(dash)).toHaveHandCount(0);
    expect(game.as(dash).zone("banished")).toHaveLength(0);
  });

  it("timing: the intimidated card returns to hand at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [smashInstinctRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(smashInstinctRed);
    game.closeCombat({ optionals: "decline" });
    game.as(bravo).endTurn();
    game.untilIdle({ optionals: "decline" });

    expect(Dash.zone("banished")).toHaveLength(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });
});
