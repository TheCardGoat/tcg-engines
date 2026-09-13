import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { escalateOrderRed } from "./escalate-order.ts";

/**
 * Escalate Order (SUP022) — When this attacks, if you control a Toughness token, create 3 more.
 */

describe("Escalate Order (SUP022) AAA", () => {
  it("happy: attacking while controlling Toughness creates 3 more", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [escalateOrderRed],
        arena: [fabToken("toughness")],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(escalateOrderRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 4);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("toughness", 0);
  });

  it("boundary: attacking with no Toughness creates none", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [escalateOrderRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(escalateOrderRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
  });

  it("timing: the extra tokens exist at on-attack", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [escalateOrderRed],
        arena: [fabToken("toughness")],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.playAttack(escalateOrderRed, { stopAt: "on-attack" });
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 4);
  });
});
