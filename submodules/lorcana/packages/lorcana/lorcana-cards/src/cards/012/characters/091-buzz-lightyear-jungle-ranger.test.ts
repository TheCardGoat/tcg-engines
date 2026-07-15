import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { buzzLightyearJungleRanger } from "./091-buzz-lightyear-jungle-ranger";

const lowCostAction = createMockAction({
  id: "buzz-low-cost-action",
  name: "Low Cost Action",
  cost: 3,
});

const sevenCostAction = createMockAction({
  id: "buzz-seven-cost-action",
  name: "Seven Cost Action",
  cost: 7,
});

const eightCostAction = createMockAction({
  id: "buzz-eight-cost-action",
  name: "Eight Cost Action",
  cost: 8,
});

const allyCharacter = createMockCharacter({
  id: "buzz-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Buzz Lightyear - Jungle Ranger", () => {
  it("has Shift 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [buzzLightyearJungleRanger],
      deck: 5,
    });

    expect(testEngine.hasKeyword(buzzLightyearJungleRanger, "Shift")).toBe(true);
  });

  describe("TAKE CHARGE - When you play this character, you may return an action card with cost 7 or less from your discard to your hand.", () => {
    it("creates an optional bag effect when discard contains an action with cost <= 7", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [buzzLightyearJungleRanger],
        inkwell: buzzLightyearJungleRanger.cost,
        discard: [lowCostAction],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(buzzLightyearJungleRanger)).toBeSuccessfulCommand();
      expect(playerOne.getCardZone(buzzLightyearJungleRanger)).toBe("play");
      expect(playerOne.getBagCount()).toBeGreaterThan(0);
    });

    it("returns an action card with cost 7 from discard to hand when accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [buzzLightyearJungleRanger],
        inkwell: buzzLightyearJungleRanger.cost,
        discard: [sevenCostAction],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(buzzLightyearJungleRanger)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(buzzLightyearJungleRanger, {
          resolveOptional: true,
          targets: [sevenCostAction],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(sevenCostAction)).toBe("hand");
    });

    it("can decline the optional trigger and leave the action in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [buzzLightyearJungleRanger],
        inkwell: buzzLightyearJungleRanger.cost,
        discard: [lowCostAction],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(buzzLightyearJungleRanger)).toBeSuccessfulCommand();

      expect(
        playerOne.resolvePendingByCard(buzzLightyearJungleRanger, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(lowCostAction)).toBe("discard");
    });

    it("does not offer a cost-8 action as a valid target", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [buzzLightyearJungleRanger],
        inkwell: buzzLightyearJungleRanger.cost,
        discard: [eightCostAction],
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(buzzLightyearJungleRanger)).toBeSuccessfulCommand();

      // No bag effect — no eligible action (cost 8 > 7).
      expect(playerOne.getBagCount()).toBe(0);
      expect(playerOne.getCardZone(eightCostAction)).toBe("discard");
    });
  });

  describe("ADVANCED TRAINING - Whenever you play an action, chosen character gets +1 {L} this turn.", () => {
    it("grants +1 lore to chosen character when an action is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [buzzLightyearJungleRanger, allyCharacter],
        hand: [lowCostAction],
        inkwell: lowCostAction.cost,
        deck: 2,
      });

      const playerOne = testEngine.asPlayerOne();
      const initialLore = playerOne.getCardLore(allyCharacter);

      expect(playerOne.playCard(lowCostAction)).toBeSuccessfulCommand();
      expect(playerOne.getBagCount()).toBeGreaterThan(0);

      expect(
        playerOne.resolvePendingByCard(buzzLightyearJungleRanger, {
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardLore(allyCharacter)).toBe(initialLore + 1);
    });

    it("lore bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [buzzLightyearJungleRanger, allyCharacter],
          hand: [lowCostAction],
          inkwell: lowCostAction.cost,
          deck: 2,
        },
        {
          deck: 5,
        },
      );

      const playerOne = testEngine.asPlayerOne();
      const initialLore = playerOne.getCardLore(allyCharacter);

      expect(playerOne.playCard(lowCostAction)).toBeSuccessfulCommand();
      expect(
        playerOne.resolvePendingByCard(buzzLightyearJungleRanger, {
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardLore(allyCharacter)).toBe(initialLore + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardLore(allyCharacter)).toBe(initialLore);
    });
  });
});
