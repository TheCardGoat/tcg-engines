import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { ruuDiGemKeeper } from "../heroes/ruu-di-gem-keeper.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed, snatchYellow } from "../actions/snatch.ts";
import { throttleRed } from "../actions/throttle.ts";
import { diamondHands } from "./diamond-hands.ts";

/**
 * Diamond Hands (LSS008) — Merchant Arms d1, Ruu'di Specialization, Blade
 * Break. Printed: "At the beginning of your end phase, if you have 4 or more
 * cards in hand, create a Diamond token."
 */

describe("Diamond Hands (LSS008) AAA", () => {
  it("happy: ending the turn with 4 cards in hand creates a Diamond token", () => {
    const game = FabTestEngine.start(
      {
        hero: ruuDiGemKeeper,
        arms: [diamondHands],
        hand: [nimblismBlue, snatchRed, throttleRed, snatchYellow],
        resourcePoints: 0,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const RuuDi = game.as(ruuDiGemKeeper);

    RuuDi.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(RuuDi, diamondHands).toBeIn("arms");
    expectFabToken(game, "diamond").toHaveCount(1);
  });

  it("boundary: three cards in hand create no Diamond token", () => {
    const game = FabTestEngine.start(
      {
        hero: ruuDiGemKeeper,
        arms: [diamondHands],
        hand: [nimblismBlue, snatchRed, throttleRed],
        resourcePoints: 0,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const RuuDi = game.as(ruuDiGemKeeper);

    RuuDi.endTurn();
    game.untilIdle({ ordering: "listed" });

    expectFabCard(RuuDi, diamondHands).toBeIn("arms");
    expectFabToken(game, "diamond").toHaveCount(0);
  });
});
