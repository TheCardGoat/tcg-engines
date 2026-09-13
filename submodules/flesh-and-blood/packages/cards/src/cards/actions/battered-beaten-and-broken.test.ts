import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { batteredBeatenAndBrokenYellow } from "./battered-beaten-and-broken.ts";

describe("Battered, Beaten, and Broken (SUP083) AAA", () => {
  it("happy: attacking a hero intimidates them (hand −1, face-down banished)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [batteredBeatenAndBrokenYellow], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(batteredBeatenAndBrokenYellow);

    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("banished");
    expectFabCard(Dash, brutalAssaultBlue).toBeFaceDown();
  });

  it("boundary: with fewer than 3 auras, this stays printed 1{p}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [batteredBeatenAndBrokenYellow], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    game.as(bravo).playAttack(batteredBeatenAndBrokenYellow);

    expectCombat(game).toHaveAttackPower(1);
    expect(game.as(dash).zone("banished")).toHaveLength(0);
  });

  it("timing: the intimidated card returns to hand at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [batteredBeatenAndBrokenYellow], resourcePoints: 0, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(batteredBeatenAndBrokenYellow);
    game.closeCombat({ optionals: "decline" });
    game.as(bravo).endTurn();
    game.untilIdle({ optionals: "decline" });

    expect(Dash.zone("banished")).toHaveLength(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });
});
