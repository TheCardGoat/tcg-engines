import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { ruuDiGemKeeper } from "../heroes/ruu-di-gem-keeper.ts";
import { pinkVisor } from "./pink-visor.ts";

/**
 * Pink Visor (LSS007) — Merchant Equipment - Head, Ruu'di Specialization (CR 8.3.7).
 * Printed: Once per Turn Action - {r}: The next card you reveal this turn has its grade increased by 1. Go again.
 */

describe("Pink Visor (LSS007) AAA", () => {
  it("happy: Ruu'di may seat this specialization in Head", () => {
    const game = FabTestEngine.start(
      {
        hero: ruuDiGemKeeper,
        head: [pinkVisor],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    expectFabCard(game.as(ruuDiGemKeeper), pinkVisor).toBeIn("head");
  });

  it("boundary: Dash activation is unmigrated, not a specialization reverse (pin engine/unmigrated-activated)", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [pinkVisor],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: ruuDiGemKeeper, hand: [], deck: 6 },
    );

    game.as(dash).expectActivationRejected(pinkVisor);
    expectFabCard(game.as(dash), pinkVisor).toBeIn("head");
  });

  it("timing: Ruu'di activation is also unmigrated (pin engine/unmigrated-activated)", () => {
    const game = FabTestEngine.start(
      {
        hero: ruuDiGemKeeper,
        head: [pinkVisor],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
    );

    game.as(ruuDiGemKeeper).expectActivationRejected(pinkVisor);
    expectFabCard(game.as(ruuDiGemKeeper), pinkVisor).toBeIn("head");
  });
});
