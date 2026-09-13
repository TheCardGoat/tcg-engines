import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { blessingOfOccultRed } from "./blessing-of-occult.ts";

describe("blessingOfOccult family AAA", () => {
  it("happy: start of your turn destroys this then creates 3 Runechant tokens", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: viserai,
        arena: [blessingOfOccultRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Viserai, blessingOfOccultRed).toBeIn("graveyard");
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 3);
  });

  it("boundary: the opponent does not create Runechants", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: viserai,
        arena: [blessingOfOccultRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("runechant", 0);
    expectFabPlayer(game.as(viserai)).toHaveTokenCount("runechant", 3);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: viserai, arena: [blessingOfOccultRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(viserai).endTurn();
    game.untilIdle();
    expectFabCard(game.as(viserai), blessingOfOccultRed).toBeIn("arena");
    expectFabPlayer(game.as(viserai)).toHaveTokenCount("runechant", 0);
  });
});
