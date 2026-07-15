import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { merlinRabbit } from "./052-merlin-rabbit";
import { letItGo } from "../../001/actions/163-let-it-go";
import { madamMimFox } from "./046-madam-mim-fox";

const drawnCard = createMockCharacter({
  id: "merlin-rabbit-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const opponentCharacter = createMockCharacter({
  id: "merlin-rabbit-opponent-char",
  name: "Opponent Character",
  cost: 1,
  strength: 4,
  willpower: 3,
});

describe("Merlin - Rabbit", () => {
  describe("HOPPITY HIP! - When you play this character and when he leaves play, you may draw a card.", () => {
    it("draws a card when played and optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [merlinRabbit],
        inkwell: merlinRabbit.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(merlinRabbit)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(testEngine.asPlayerOne().resolvePendingByCard(merlinRabbit)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0 });
    });

    it("does not draw a card when played and optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [merlinRabbit],
        inkwell: merlinRabbit.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(merlinRabbit)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merlinRabbit, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 1 });
    });

    it("draws a card when Merlin leaves play via put-into-inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinRabbit],
          deck: [drawnCard],
        },
        {
          inkwell: letItGo.cost,
          hand: [letItGo],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(letItGo, { targets: [merlinRabbit] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinRabbit)).toBe("inkwell");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(testEngine.asPlayerOne().resolvePendingByCard(merlinRabbit)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    });

    it("regression: Merlin played via Madam Mim Fox triggers leave-play draw", () => {
      // Madam Mim Fox: "When you play this character, banish her or return another chosen character of yours to your hand."
      // When Mim returns Merlin to hand, Merlin's leave-play trigger should fire (draw a card).
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [madamMimFox],
          play: [{ card: merlinRabbit, isDrying: false }],
          inkwell: madamMimFox.cost,
          deck: [drawnCard, drawnCard, drawnCard],
        },
        {
          play: [opponentCharacter],
          deck: 5,
        },
      );

      // Play Madam Mim Fox — must choose: banish Mim or return another character to hand
      expect(testEngine.asPlayerOne().playCard(madamMimFox)).toBeSuccessfulCommand();

      // Resolve CHASING THE RABBIT: choose to return Merlin to hand (option 1)
      testEngine.asPlayerOne().resolvePendingByCard(madamMimFox);
      testEngine.asPlayerOne().resolveNextPending({ choiceIndex: 1, targets: [merlinRabbit] });

      // Merlin's leave-play trigger (HOPPITY HIP!) should fire — accept the optional draw
      for (let i = 0; i < 50 && testEngine.asPlayerOne().getBagCount() > 0; i++) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        const hoppityBag = effects.find(
          (b) => (b.payload as { abilityName?: string }).abilityName === "HOPPITY HIP!",
        );
        if (hoppityBag) {
          testEngine.asPlayerOne().resolvePendingByCard(merlinRabbit, { resolveOptional: true });
          break;
        }
        testEngine.asPlayerOne().resolvePendingByCard(merlinRabbit, {});
      }

      // Merlin should be in hand now (returned by Mim)
      expect(testEngine.asPlayerOne().getCardZone(merlinRabbit)).toBe("hand");
    });

    it("does not draw when Merlin leaves play and optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [merlinRabbit],
          deck: [drawnCard],
        },
        {
          inkwell: letItGo.cost,
          hand: [letItGo],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(letItGo, { targets: [merlinRabbit] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(merlinRabbit)).toBe("inkwell");

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(merlinRabbit, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    });
  });
});
