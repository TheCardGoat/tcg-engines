import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { showNoMercyRed } from "./show-no-mercy.ts";

describe("Show No Mercy (HVY013) AAA", () => {
  it("happy: attacking a hero intimidates them (hand −1, face-down banished)", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [showNoMercyRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue, brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(rhinar).playAttack(showNoMercyRed);

    expectFabPlayer(Dash).toHaveHandCount(1);
    expect(Dash.zone("banished")).toHaveLength(1);
    expectFabCard(Dash, Dash.cardsIn("banished", brutalAssaultBlue)[0]!).toBeFaceDown();
  });

  it("boundary: empty defending hand still attacks and this gets +3{p}", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [showNoMercyRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    game.as(rhinar).playAttack(showNoMercyRed);

    expectFabPlayer(game.as(dash)).toHaveHandCount(0);
    expect(game.as(dash).zone("banished")).toHaveLength(0);
    expectCombat(game).toHaveAttackPower(9);
  });

  it("timing: the intimidated card returns to hand at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [showNoMercyRed], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [brutalAssaultBlue], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    game.as(rhinar).playAttack(showNoMercyRed);
    expectFabPlayer(Dash).toHaveHandCount(0);
    game.closeCombat({ optionals: "decline" });
    game.as(rhinar).endTurn();
    game.untilIdle({ optionals: "decline" });

    expect(Dash.zone("banished")).toHaveLength(0);
    expectFabCard(Dash, brutalAssaultBlue).toBeIn("hand");
  });
});
