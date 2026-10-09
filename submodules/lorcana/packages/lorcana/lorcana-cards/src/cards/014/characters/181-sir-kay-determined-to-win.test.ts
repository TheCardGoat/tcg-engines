import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { sirKayDeterminedToWin } from "./181-sir-kay-determined-to-win";
import { arthurNoviceBlacksmith } from "./185-arthur-novice-blacksmith";

describe("Sir Kay - Determined to Win", () => {
  it("gains Challenger +3 only while you have an ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sirKayDeterminedToWin],
      inkwell: sirKayDeterminedToWin.cost,
      inkDrops: 1,
    });

    expect(testEngine.asPlayerOne().playCard(sirKayDeterminedToWin)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: sirKayDeterminedToWin,
      keyword: "Challenger",
      value: 3,
    });
    expect(testEngine.asPlayerOne().getCardStrength(sirKayDeterminedToWin)).toBe(4);
  });

  it("has no Challenger bonus until an ink drop is gained", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sirKayDeterminedToWin, arthurNoviceBlacksmith],
      inkwell: sirKayDeterminedToWin.cost + arthurNoviceBlacksmith.cost + 1,
    });

    expect(testEngine.asPlayerOne().playCard(sirKayDeterminedToWin)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(sirKayDeterminedToWin)).toBe(4);

    // Arthur's CAREFUL CRAFTING grants the ink drop; the bonus appears.
    expect(testEngine.asPlayerOne().playCard(arthurNoviceBlacksmith)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(arthurNoviceBlacksmith, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: sirKayDeterminedToWin,
      keyword: "Challenger",
      value: 3,
    });

    // Challenger boosts strength only while challenging — outside a challenge
    // the printed strength is unchanged, so assert the granted keyword only.
    expect(testEngine.asPlayerOne().getCardStrength(sirKayDeterminedToWin)).toBe(4);
  });
  it.each([0, 1, 3])("deals conditional challenge damage with %s ink drops", (inkDrops: number) => {
    const defender = createMockCharacter({
      id: "sir-kay-durable-defender",
      name: "Durable Defender",
      cost: 3,
      strength: 1,
      willpower: 10,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirKayDeterminedToWin, isDrying: false }], inkDrops, deck: 3 },
      { play: [{ card: defender, exerted: true }], deck: 3 },
    );
    expect(game.asPlayerOne().challenge(sirKayDeterminedToWin, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(defender)).toBe(inkDrops === 0 ? 4 : 7);
    expect(game.asPlayerOne().getDamage(sirKayDeterminedToWin)).toBe(1);
    expect(game.asPlayerOne().getCardStrength(sirKayDeterminedToWin)).toBe(4);
  });

  it("opposing ink drops do not grant the bonus", () => {
    const defender = createMockCharacter({
      id: "sir-kay-enemy-drop-defender",
      name: "Enemy Drop Defender",
      cost: 3,
      strength: 1,
      willpower: 10,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirKayDeterminedToWin, isDrying: false }], deck: 3 },
      { play: [{ card: defender, exerted: true }], inkDrops: 2, deck: 3 },
    );
    expect(game.asPlayerOne().challenge(sirKayDeterminedToWin, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(defender)).toBe(4);
  });

  it("does not add Challenger strength when defending with an ink drop", () => {
    const attacker = createMockCharacter({
      id: "sir-kay-durable-attacker",
      name: "Durable Attacker",
      cost: 3,
      strength: 1,
      willpower: 10,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirKayDeterminedToWin, exerted: true }], inkDrops: 1, deck: 3 },
      { play: [{ card: attacker, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(attacker, sirKayDeterminedToWin)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(attacker)).toBe(4);
    expect(game.asPlayerOne().getDamage(sirKayDeterminedToWin)).toBe(1);
  });
  it.each([1, 2])("recalculates after spending one of %s ink drops", (inkDrops: number) => {
    const location = createMockLocation({
      id: "sir-kay-workshop",
      name: "Workshop",
      cost: 1,
      moveCost: 1,
    });
    const defender = createMockCharacter({
      id: "sir-kay-spent-drop-defender",
      name: "Spent Drop Defender",
      cost: 3,
      strength: 1,
      willpower: 10,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: sirKayDeterminedToWin, isDrying: false }, location], inkDrops, deck: 3 },
      { play: [{ card: defender, exerted: true }], deck: 3 },
    );
    expect(game.asPlayerOne().getKeywordValue(sirKayDeterminedToWin, "Challenger")).toBe(3);
    expect(
      game.asPlayerOne().moveCharacterToLocation(sirKayDeterminedToWin, location, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops("player_one")).toBe(inkDrops - 1);
    expect(game.asPlayerOne().challenge(sirKayDeterminedToWin, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(defender)).toBe(inkDrops === 1 ? 4 : 7);
  });

  it("player two gets the bonus from their own ink drop", () => {
    const defender = createMockCharacter({
      id: "sir-kay-player-two-defender",
      name: "Player Two Defender",
      cost: 3,
      strength: 1,
      willpower: 10,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: defender, exerted: true }], deck: 3 },
      { play: [{ card: sirKayDeterminedToWin, isDrying: false }], inkDrops: 1, deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(sirKayDeterminedToWin, defender)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(defender)).toBe(7);
  });

  it("normal paid play dries before questing for two lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sirKayDeterminedToWin],
      inkwell: 5,
      inkDrops: 1,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(sirKayDeterminedToWin)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk("player_one")).toBe(0);
    expect(game.getInkDrops("player_one")).toBe(1);
    expect(game.asPlayerOne().quest(sirKayDeterminedToWin)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(sirKayDeterminedToWin)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(2);
    expect(game.asPlayerOne().getCardStrength(sirKayDeterminedToWin)).toBe(4);
  });

  it("rejects unpaid play and inks as one ready ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sirKayDeterminedToWin],
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(sirKayDeterminedToWin)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(sirKayDeterminedToWin)).toBe("hand");
    expect(
      game.asPlayerOne().putIntoInkwell("player_one", sirKayDeterminedToWin),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk("player_one")).toBe(1);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });
});
