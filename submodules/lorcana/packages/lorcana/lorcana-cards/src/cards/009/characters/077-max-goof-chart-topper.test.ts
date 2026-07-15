import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { maxGoofChartTopper } from "./077-max-goof-chart-topper";

const songCard = createMockSong({
  id: "max-goof-chart-topper-test-song",
  name: "Test Song",
  cost: 2,
  text: "Gain 1 lore. Draw a card.",
  abilities: [
    {
      type: "action" as const,
      id: "test-song-1",
      text: "Gain 1 lore. Draw a card.",
      effect: {
        type: "sequence" as const,
        steps: [
          { type: "gain-lore" as const, amount: 1 },
          { type: "draw" as const, amount: 1, target: "CONTROLLER" as const },
        ],
      },
    },
  ],
});

const expensiveSongCard = createMockSong({
  id: "max-goof-chart-topper-test-expensive-song",
  name: "Expensive Song",
  cost: 5,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action" as const,
      id: "expensive-song-1",
      text: "Gain 1 lore.",
      effect: {
        type: "gain-lore" as const,
        amount: 1,
      },
    },
  ],
});

const deckCard = createMockCharacter({
  id: "max-goof-chart-topper-test-deck-card",
  name: "Deck Card",
  cost: 1,
});

describe("Max Goof - Chart Topper", () => {
  describe("Shift 4 {I}", () => {
    it("has Shift keyword with cost 4", () => {
      const shiftAbility = maxGoofChartTopper.abilities?.find(
        (a) => "keyword" in a && a.keyword === "Shift",
      );
      expect(shiftAbility).toBeDefined();
      expect(shiftAbility && "cost" in shiftAbility ? shiftAbility.cost : undefined).toEqual({
        ink: 4,
      });
    });
  });

  describe("NUMBER ONE HIT", () => {
    it("plays a song with cost 4 or less from discard for free when questing, then puts it on the bottom of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maxGoofChartTopper, isDrying: false }],
          discard: [songCard],
          deck: [deckCard],
          inkwell: maxGoofChartTopper.cost,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(maxGoofChartTopper)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maxGoofChartTopper, { resolveOptional: true, targets: [songCard] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(songCard)).toBe("deck");

      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    });

    it("can decline the optional NUMBER ONE HIT ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maxGoofChartTopper, isDrying: false }],
          discard: [songCard],
          deck: [deckCard],
          inkwell: maxGoofChartTopper.cost,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(maxGoofChartTopper)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maxGoofChartTopper, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(songCard)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(1);
    });

    it("does not show the optional prompt when no eligible song is in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maxGoofChartTopper, isDrying: false }],
          discard: [expensiveSongCard],
          deck: [deckCard],
          inkwell: maxGoofChartTopper.cost,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(maxGoofChartTopper)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(expensiveSongCard)).toBe("discard");
    });

    it("regression: once the optional is accepted, playing the song is mandatory (not a second optional choice)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maxGoofChartTopper, isDrying: false }],
          discard: [songCard],
          deck: [deckCard],
          inkwell: maxGoofChartTopper.cost,
        },
        { deck: 2 },
      );

      expect(testEngine.asPlayerOne().quest(maxGoofChartTopper)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional and select the song — both must be provided together
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maxGoofChartTopper, { resolveOptional: true, targets: [songCard] }),
      ).toBeSuccessfulCommand();

      // The song should have been played (moved from discard to deck via replacement effect)
      expect(testEngine.asPlayerOne().getCardZone(songCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    });

    it("resolves the song effects before putting it on the bottom of the deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maxGoofChartTopper, isDrying: false }],
          discard: [songCard],
          deck: [deckCard],
          inkwell: maxGoofChartTopper.cost,
        },
        { deck: 2 },
      );

      const loreBefore = testEngine.asPlayerOne().getLore("player_one");

      expect(testEngine.asPlayerOne().quest(maxGoofChartTopper)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(maxGoofChartTopper, { resolveOptional: true, targets: [songCard] }),
      ).toBeSuccessfulCommand();

      const loreAfter = testEngine.asPlayerOne().getLore("player_one");

      expect(loreAfter).toBe(loreBefore + maxGoofChartTopper.lore + 1);
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerOne().getCardZone(songCard)).toBe("deck");
    });
  });
});
