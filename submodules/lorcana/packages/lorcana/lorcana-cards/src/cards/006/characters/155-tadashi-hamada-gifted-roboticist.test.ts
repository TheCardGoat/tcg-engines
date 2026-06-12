import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { tadashiHamadaGiftedRoboticist } from "./155-tadashi-hamada-gifted-roboticist";
import { dragonFire } from "../../001/actions/130-dragon-fire";

const topDeckCard = createMockCharacter({
  id: "tadashi-gifted-top-deck",
  name: "Top Deck Card",
  cost: 2,
  strength: 1,
  willpower: 1,
});

describe("Tadashi Hamada - Gifted Roboticist", () => {
  describe("SOMEONE HAS TO HELP - During an opponent's turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.", () => {
    it("when banished during opponent's turn and optional is accepted: puts top deck card and Tadashi into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
        {
          play: [tadashiHamadaGiftedRoboticist],
          deck: [topDeckCard],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [tadashiHamadaGiftedRoboticist],
        }),
      ).toBeSuccessfulCommand();

      // Tadashi should be banished and trigger should fire
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      // Accept the optional: put top deck card into inkwell
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(tadashiHamadaGiftedRoboticist, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      // Top deck card should be in inkwell
      expect(testEngine.asPlayerTwo().getCardZone(topDeckCard)).toBe("inkwell");
      // Tadashi himself should be in inkwell (not discard)
      expect(testEngine.asPlayerTwo().getCardZone(tadashiHamadaGiftedRoboticist)).toBe("inkwell");
    });

    it("when banished during opponent's turn and optional is declined: only puts Tadashi into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
        {
          play: [tadashiHamadaGiftedRoboticist],
          deck: [topDeckCard],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [tadashiHamadaGiftedRoboticist],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      // Decline the optional
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(tadashiHamadaGiftedRoboticist, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Top deck card should remain in deck
      expect(testEngine.asPlayerTwo().getCardZone(topDeckCard)).toBe("deck");
      // Tadashi himself should be in inkwell (not discard)
      expect(testEngine.asPlayerTwo().getCardZone(tadashiHamadaGiftedRoboticist)).toBe("inkwell");
    });

    it("does NOT trigger when banished during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tadashiHamadaGiftedRoboticist],
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: [topDeckCard],
        },
        {
          deck: 2,
        },
      );

      // Player one banishes their own Tadashi
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [tadashiHamadaGiftedRoboticist],
        }),
      ).toBeSuccessfulCommand();

      // Should NOT trigger - it only fires during opponent's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // Tadashi should be in discard (normal banish, not inkwell)
      expect(testEngine.asPlayerOne().getCardZone(tadashiHamadaGiftedRoboticist)).toBe("discard");
    });

    it("banished during opponent's turn puts Tadashi facedown into inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
        },
        {
          play: [tadashiHamadaGiftedRoboticist],
          deck: 2,
        },
      );

      const tadashiId = testEngine.findCardInstanceId(
        tadashiHamadaGiftedRoboticist,
        "play",
        "player_two",
      );

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [tadashiHamadaGiftedRoboticist],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(tadashiHamadaGiftedRoboticist, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Tadashi should be in inkwell, facedown
      expect(testEngine.asPlayerTwo().getCardZone(tadashiHamadaGiftedRoboticist)).toBe("inkwell");
      const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
      expect(cardMeta[tadashiId]?.publicFaceState).toBe("faceDown");
    });
  });
});
