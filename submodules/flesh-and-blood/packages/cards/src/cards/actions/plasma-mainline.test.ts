import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { snatchRed } from "./snatch.ts";
import { plasmaMainlineRed } from "./plasma-mainline.ts";

/**
 * Plasma Mainline (DYN093) — Mechanologist Item, cost 2.
 * Printed: Enters with 5 steam counters; destroy when it has none. When a
 * Mechanologist item with cost 2 or less enters under your control, you may
 * move a steam counter from this to that item.
 */

describe("Plasma Mainline (DYN093) AAA", () => {
  it("happy: this enters with 5 steam and may move one onto a cost-1 item", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [plasmaMainlineRed, hyperDriverRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(plasmaMainlineRed);
    game.untilIdle({ optionals: "decline" });
    expectFabCard(Teklo, plasmaMainlineRed).toBeIn("arena").toHaveCounters(5, "steam");
    Teklo.play(hyperDriverRed);
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Teklo, plasmaMainlineRed).toHaveCounters(4, "steam");
    expectFabCard(Teklo, hyperDriverRed).toHaveCounters(4, "steam");
  });

  it("boundary: declining the move leaves steam on this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [plasmaMainlineRed, hyperDriverRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(plasmaMainlineRed);
    game.untilIdle({ optionals: "decline" });
    Teklo.play(hyperDriverRed);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Teklo, plasmaMainlineRed).toHaveCounters(5, "steam");
    expectFabCard(Teklo, hyperDriverRed).toHaveCounters(3, "steam");
  });

  it("timing: playing a non-item does not move a steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [plasmaMainlineRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(plasmaMainlineRed);
    game.untilIdle({ optionals: "decline" });
    Teklo.playAttack(snatchRed);
    game.closeCombat();

    expectFabCard(Teklo, plasmaMainlineRed).toHaveCounters(5, "steam");
  });
});
