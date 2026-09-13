import { describe, expect, it } from "vitest";
import { expectFabCard, expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { packHuntRed } from "./pack-hunt.ts";

describe("Pack Hunt (RNR009) AAA", () => {
  it("happy: attacking intimidates (hand −1, face-down banished)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [packHuntRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(packHuntRed);

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("banished");
    expectFabCard(Dash, brutalAssaultBlue).toBeFaceDown();
  });

  it("boundary: empty defending hand still attacks and banishes nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [packHuntRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(packHuntRed);

    expectFabPlayer(game.as(dash)).toHaveHandCount(0);
    expect(game.as(dash).zone("banished")).toHaveLength(0);
  });

  it("timing: the intimidated card returns to hand at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [packHuntRed], resourcePoints: 2, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(packHuntRed);
    game.closeCombat({ optionals: "decline" });
    game.as(bravo).endTurn();
    game.untilIdle({ optionals: "decline" });

    expect(Dash.zone("banished")).toHaveLength(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });
});
