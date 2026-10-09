import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { arthurNoviceBlacksmith } from "./185-arthur-novice-blacksmith";

describe("Arthur - Novice Blacksmith", () => {
  it("paying 1 {I} on play grants 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurNoviceBlacksmith],
      inkwell: arthurNoviceBlacksmith.cost + 1,
    });

    expect(testEngine.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(arthurNoviceBlacksmith)).toBe("play");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("declining grants no ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurNoviceBlacksmith],
      inkwell: arthurNoviceBlacksmith.cost + 1,
    });

    expect(testEngine.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
  it("finishes without a reward when no ink remains to pay", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurNoviceBlacksmith],
      inkwell: 2,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asPlayerOne().getCardZone(arthurNoviceBlacksmith)).toBe("play");
  });

  it("rejects unpaid play and normal inking grants no reward", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurNoviceBlacksmith],
      inkwell: 1,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(arthurNoviceBlacksmith)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(arthurNoviceBlacksmith)).toBe("hand");
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(
      game.asPlayerOne().putIntoInkwell(PLAYER_ONE, arthurNoviceBlacksmith),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("each played copy offers its own paid reward", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurNoviceBlacksmith, arthurNoviceBlacksmith],
      inkwell: 6,
      deck: 3,
    });
    for (let count = 1; count <= 2; count++) {
      const id = g.findCardInstanceId(arthurNoviceBlacksmith, "hand", "player_one");
      expect(g.asPlayerOne().playCard(id)).toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(id, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(g.getInkDrops("player_one")).toBe(count);
      expect(g.asServer().getAvailableInk("player_one")).toBe(6 - 3 * count);
      expect(g.asPlayerOne().getBagCount()).toBe(0);
    }
  });

  it("player two pays and receives only their own reward", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 3 },
      { hand: [arthurNoviceBlacksmith], inkwell: 3, deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, { resolveOptional: true }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_two")).toBe(1);
    expect(
      g.asPlayerTwo().resolvePendingByCard(arthurNoviceBlacksmith, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops("player_two")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.asServer().getAvailableInk("player_two")).toBe(0);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
  });

  it("dries before questing and questing does not trigger crafting", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [arthurNoviceBlacksmith], inkwell: 3, deck: 3 },
      { deck: 3 },
    );
    expect(g.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(arthurNoviceBlacksmith)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(1);
    expect(g.getInkDrops("player_one")).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
});
