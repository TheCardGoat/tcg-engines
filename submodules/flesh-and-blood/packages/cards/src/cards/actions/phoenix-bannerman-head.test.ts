import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixFlameRed } from "./phoenix-flame.ts";
import { snatchRed } from "./snatch.ts";
import { phoenixBannermanHeadRed } from "./phoenix-bannerman-head.ts";

/**
 * Phoenix Bannerman: Head (PEN257) — Draconic Action, cost 0, legendary, go again.
 * Printed: Search your deck for a Phoenix Flame, reveal it, put it into your
 * hand, then shuffle. Create a Ponder token.
 */

describe("Phoenix Bannerman: Head (PEN257) AAA", () => {
  it("happy: searches Phoenix Flame into hand and creates a Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixBannermanHeadRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, phoenixFlameRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(phoenixBannermanHeadRed);
    game.passBoth();
    Fai.target(Fai.cardIn("deck", phoenixFlameRed));
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
    expectFabToken(game, "ponder").toHaveCount(1);
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: with no Phoenix Flame the search fails and still creates a Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixBannermanHeadRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(phoenixBannermanHeadRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabToken(game, "ponder").toHaveCount(1);
    expectFabPlayer(Fai).toHaveHandCount(0);
  });

  it("timing: go again refunds when the action layer resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [phoenixBannermanHeadRed],
        deck: 6,
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.play(phoenixBannermanHeadRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Fai).toHaveAP(1);
    expectFabCard(Fai, phoenixBannermanHeadRed).toBeIn("graveyard");
  });
});
