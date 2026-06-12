import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { wreckitRalphHerosDuty } from "./027-wreck-it-ralph-heros-duty";

const banishAction = createMockAction({
  id: "wreck-it-ralph-heros-duty-banish-action-1",
  name: "Banish Action 1",
  cost: 2,
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
});

const banishAction2 = createMockAction({
  id: "wreck-it-ralph-heros-duty-banish-action-2",
  name: "Banish Action 2",
  cost: 2,
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
});

const allyCharacterA = createMockCharacter({
  id: "wreck-it-ralph-heros-duty-ally-a",
  name: "Ally A",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const allyCharacterB = createMockCharacter({
  id: "wreck-it-ralph-heros-duty-ally-b",
  name: "Ally B",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opponentCharacter = createMockCharacter({
  id: "wreck-it-ralph-heros-duty-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Wreck-It Ralph - Hero's Duty", () => {
  describe("OUTFLANK — During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.", () => {
    it("gains +1 lore when one of your other characters is banished on your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wreckitRalphHerosDuty, allyCharacterA],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getCard(wreckitRalphHerosDuty).lore).toBe(
        wreckitRalphHerosDuty.lore,
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [allyCharacterA] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(allyCharacterA)).toBe("discard");
      expect(testEngine.asPlayerOne().getCard(wreckitRalphHerosDuty).lore).toBe(
        wreckitRalphHerosDuty.lore + 1,
      );
    });

    it("gains +1 lore each time an ally is banished on the same turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wreckitRalphHerosDuty, allyCharacterA, allyCharacterB],
          hand: [banishAction, banishAction2],
          inkwell: banishAction.cost + banishAction2.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [allyCharacterA] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(wreckitRalphHerosDuty).lore).toBe(
        wreckitRalphHerosDuty.lore + 1,
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction2, { targets: [allyCharacterB] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCard(wreckitRalphHerosDuty).lore).toBe(
        wreckitRalphHerosDuty.lore + 2,
      );
    });

    it("does NOT trigger when one of your other characters is banished on the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wreckitRalphHerosDuty, allyCharacterA],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(banishAction, { targets: [allyCharacterA] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(allyCharacterA)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCard(wreckitRalphHerosDuty).lore).toBe(
        wreckitRalphHerosDuty.lore,
      );
    });

    it("the +1 lore bonus expires at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [wreckitRalphHerosDuty, allyCharacterA],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [allyCharacterA] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(wreckitRalphHerosDuty).lore).toBe(
        wreckitRalphHerosDuty.lore + 1,
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(wreckitRalphHerosDuty).lore).toBe(
        wreckitRalphHerosDuty.lore,
      );
    });
  });
});
