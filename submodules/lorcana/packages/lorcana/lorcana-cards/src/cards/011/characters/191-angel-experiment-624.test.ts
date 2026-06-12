import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { angelExperiment624 } from "./191-angel-experiment-624";
import { angelExperiment624Enchanted } from "./238-angel-experiment-624-enchanted";
import { princeJohnGreediestOfAll } from "../../002/characters/089-prince-john-greediest-of-all";

const handFodder = createMockCharacter({
  id: "angel-hand-fodder",
  name: "Hand Fodder",
  cost: 1,
});

const targetCharacter = createMockCharacter({
  id: "angel-target",
  name: "Target Character",
  strength: 2,
  willpower: 5,
  cost: 2,
});

const fragileTarget = createMockCharacter({
  id: "angel-fragile-target",
  name: "Fragile Target",
  strength: 1,
  willpower: 2,
  cost: 1,
});

describe("Angel - Experiment 624", () => {
  describe("UNTOUCHABLE - While you have no cards in your hand, this character gains Resist +2", () => {
    it("gains Resist +2 when controller has no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [angelExperiment624],
        hand: [],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(angelExperiment624, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(angelExperiment624, "Resist")).toBe(2);
    });

    it("does NOT have Resist +2 when controller has cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [angelExperiment624],
        hand: [handFodder],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().hasKeyword(angelExperiment624, "Resist")).toBe(false);
    });
  });

  describe("GOOD AIM - Once during your turn, you may choose and discard a card to deal 2 damage to chosen character", () => {
    it("deals 2 damage to chosen character when activated with discard cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [angelExperiment624],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      // Activate the ability: discard handFodder as cost, target the opponent character
      const p1 = testEngine.asPlayerOne();
      expect(
        p1.activateAbility(angelExperiment624, {
          costs: { discardCards: [handFodder] },
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");

      const sourceInstanceId = testEngine.findCardInstanceId(angelExperiment624, "play", "p1");
      const discardedInstanceId = testEngine.findCardInstanceId(handFodder, "discard", "p1");
      const abilityLog = testEngine
        .getServerEngine()
        .getRuntime()
        .getMoveLogHistory()
        .find(
          (log) =>
            log.moveType === "activateAbility" &&
            log.public.some(
              (message) =>
                message.key === "lorcana.ability.activated.named.discardCost" &&
                message.values.cardId === sourceInstanceId,
            ),
        );
      expect(abilityLog).toMatchObject({
        moveType: "activateAbility",
        public: expect.arrayContaining([
          expect.objectContaining({
            key: "lorcana.ability.activated.named.discardCost",
            values: expect.objectContaining({
              cardId: sourceInstanceId,
              discardCardIds: [discardedInstanceId],
            }),
          }),
        ]),
      });
    });

    it("requires discarding a card as cost", () => {
      // With no cards in hand, the ability cannot be activated
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [angelExperiment624],
          hand: [],
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(angelExperiment624, {
        costs: { discardCards: [] },
        targets: [targetCharacter],
      });
      expect(result.success).toBe(false);
    });

    it("requires explicit discard selection when one card is in hand (discardChosen)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [angelExperiment624],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      const result = testEngine.asPlayerOne().activateAbility(angelExperiment624, {
        targets: [targetCharacter],
      });
      expect(result.success).toBe(false);
    });

    it("cannot be activated twice in the same turn (once per turn)", () => {
      const handFodder2 = createMockCharacter({
        id: "angel-hand-fodder-2",
        name: "Hand Fodder 2",
        cost: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [angelExperiment624],
          hand: [handFodder, handFodder2],
          deck: 5,
        },
        {
          play: [targetCharacter],
          deck: 5,
        },
      );

      // First activation succeeds
      expect(
        testEngine.asPlayerOne().activateAbility(angelExperiment624, {
          costs: { discardCards: [handFodder] },
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Second activation in the same turn should fail
      const result = testEngine.asPlayerOne().activateAbility(angelExperiment624, {
        costs: { discardCards: [handFodder2] },
        targets: [targetCharacter],
      });
      expect(result.success).toBe(false);
    });
  });

  // Regression: Angel's GOOD AIM discard cost was not triggering Prince John - Greediest of All's
  // "I SENTENCE YOU" draw ability (fixed March 7)
  describe("regression: GOOD AIM discard triggers opponent's Prince John draw", () => {
    it("regression: activating GOOD AIM triggers Prince John - Greediest of All's I SENTENCE YOU", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [angelExperiment624],
          hand: [handFodder],
          deck: 5,
        },
        {
          play: [princeJohnGreediestOfAll, targetCharacter],
          deck: 5,
        },
      );

      const initialZones = testEngine.asPlayerTwo().getZonesCardCount("player_two");

      expect(
        testEngine.asPlayerOne().activateAbility(angelExperiment624, {
          costs: { discardCards: [handFodder] },
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Prince John's I SENTENCE YOU should trigger — opponent discarded a card
      expect(testEngine.asPlayerTwo().getBagCount()).toBeGreaterThan(0);

      // Accept the optional draw
      expect(
        testEngine
          .asPlayerTwo()
          .resolvePendingByCard(princeJohnGreediestOfAll, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Player two should have drawn a card
      const updatedZones = testEngine.asPlayerTwo().getZonesCardCount("player_two");
      expect(updatedZones.hand).toBe(initialZones.hand + 1);
    });
  });
});
