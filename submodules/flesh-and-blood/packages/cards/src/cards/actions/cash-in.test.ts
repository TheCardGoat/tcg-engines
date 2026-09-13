import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { cashInYellow } from "./cash-in.ts";

describe("Cash In (CRU188) AAA", () => {
  it("happy: paying 4{r} draws 2 cards", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cashInYellow], resourcePoints: 4, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(cashInYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveHandCount(2);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabCard(Dash, cashInYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: cannot play at 0{r} without a legal alternative cost", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cashInYellow], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.play(cashInYellow)).toThrow();
    expectFabCard(Dash, cashInYellow).toBeIn("hand");
  });

  it("timing: go again refunds the action point spent to play Cash In", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cashInYellow], resourcePoints: 4, actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(cashInYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveAP(1);
  });
});
