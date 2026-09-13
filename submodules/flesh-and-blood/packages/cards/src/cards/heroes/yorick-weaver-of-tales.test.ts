import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { yorickWeaverOfTales } from "./yorick-weaver-of-tales.ts";
import { snatchRed } from "../actions/snatch.ts";

/**
 * Yorick, Weaver of Tales (LSS004) — Bard Hero — Young.
 *
 * Printed: "At the start of the game, all heroes shuffle their starting decks
 * together. All heroes share the same deck and graveyard this game."
 *
 * The shared-library rule is observed through both heroes' zone views: they
 * must always agree, including after cards move.
 */

const opponentHero = dash;

describe("yorick-weaver-of-tales (LSS004) AAA", () => {
  it("core mechanic: both heroes see the same shuffled-together deck", () => {
    const game = FabTestEngine.start(
      { hero: yorickWeaverOfTales, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Yorick = game.as(yorickWeaverOfTales);
    const Opponent = game.as(opponentHero);

    // Both views point at the same combined library (6 + 6 minus starting
    // hands, identical content and order).
    expect(Yorick.zone("deck")).toEqual(Opponent.zone("deck"));
    expect(Yorick.zone("deck").length).toBeGreaterThan(0);
  });

  it("core mechanic: a card played by one hero lands in the shared graveyard", () => {
    const game = FabTestEngine.start(
      { hero: yorickWeaverOfTales, hand: [snatchRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    const Yorick = game.as(yorickWeaverOfTales);
    const Opponent = game.as(opponentHero);

    Yorick.playAttack(snatchRed);
    game.closeCombat({ optionals: "decline" });

    // snatch resolved into the shared graveyard — visible to both heroes.
    expect(Yorick.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(Opponent.zone("graveyard")).toContain(snatchRed.canonicalId);
    expectFabPlayer(Opponent).toHaveLife(16); // 20 − 4 unblocked
  });

  it("core mechanic: a card drawn by one hero is gone from the shared deck for both", () => {
    const game = FabTestEngine.start(
      { hero: yorickWeaverOfTales, hand: [], deck: 6, actionPoints: 1 },
      { hero: opponentHero, hand: [], deck: 6 },
    );
    const Yorick = game.as(yorickWeaverOfTales);
    const Opponent = game.as(opponentHero);
    const sharedSize = Yorick.zone("deck").length;

    // Yorick plays an action: end of turn draws from the shared deck.
    Yorick.endTurn();

    expect(Yorick.zone("deck").length).toBeLessThan(sharedSize);
    expect(Opponent.zone("deck")).toEqual(Yorick.zone("deck"));
  });
});
