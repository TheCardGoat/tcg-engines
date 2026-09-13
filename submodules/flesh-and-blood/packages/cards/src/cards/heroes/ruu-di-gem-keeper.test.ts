import { describe, it } from "vitest";
import {
  expectFabPlayer,
  expectFabUnplayable,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { ruuDiGemKeeper } from "./ruu-di-gem-keeper.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Ruu'di, Gem Keeper (LSS001) — Hero - Merchant — 40hp.
 *
 * Printed: "You may only have PSA graded cards in your deck.
 * Once per Turn Action - {r}: Reveal the top card of your deck. If it's
 * graded Gem Mint 10, put it into your hand, otherwise each opponent may
 * draw a card. Go again"
 *
 * The non-Gem-Mint legs are proven here; the Gem Mint 10 leg is recorded as
 * family definition/no-gem-mint-10-card (no authored card carries the trait).
 */

const opponentHero = dash;

describe("ruu-di-gem-keeper (LSS001) AAA", () => {
  it("core mechanic: revealing a non-Gem-Mint top card lets the opponent draw, then go again", () => {
    const game = FabTestEngine.start(
      {
        hero: ruuDiGemKeeper,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Ruudi = game.as(ruuDiGemKeeper);
    const Opponent = game.as(opponentHero);

    Ruudi.activate(ruuDiGemKeeper);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    // {r} paid, go again refunds the AP, opponent accepted the draw.
    expectFabPlayer(Ruudi).toHaveResourceCount(0);
    expectFabPlayer(Ruudi).toHaveAP(1);
    expectFabPlayer(Opponent).toHaveHandCount(1);
  });

  it("boundary: declining the optional draw leaves the opponent's hand empty", () => {
    const game = FabTestEngine.start(
      {
        hero: ruuDiGemKeeper,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Ruudi = game.as(ruuDiGemKeeper);
    const Opponent = game.as(opponentHero);

    Ruudi.activate(ruuDiGemKeeper);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Opponent).toHaveHandCount(0);
    expectFabPlayer(Ruudi).toHaveAP(1);
  });

  it("boundary: once per turn — a second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: ruuDiGemKeeper,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 2,
      },
      { hero: opponentHero, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Ruudi = game.as(ruuDiGemKeeper);

    Ruudi.activate(ruuDiGemKeeper);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    Ruudi.expectActivationRejected(ruuDiGemKeeper);
  });

  it("boundary: the {r} cost cannot be paid with 0{r} and an empty hand", () => {
    const game = FabTestEngine.start(
      {
        hero: ruuDiGemKeeper,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        hand: [],
      },
      { hero: opponentHero, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Ruudi = game.as(ruuDiGemKeeper);

    expectFabUnplayable(
      () => Ruudi.activate(ruuDiGemKeeper),
      /payment cannot be paid|cannot be paid/i,
    );
  });
});
