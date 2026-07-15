import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kangaPeacefulGatherer } from "./138-kanga-peaceful-gatherer";

const deckCard = createMockCharacter({
  id: "kanga-peaceful-gatherer-deck-card",
  name: "Deck Card",
  cost: 1,
});

describe("Kanga - Peaceful Gatherer", () => {
  it("should be able to activate Boost 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [kangaPeacefulGatherer],
      deck: 5,
      inkwell: 10,
    });

    const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

    expect(
      testEngine.asPlayerOne().activateAbility(kangaPeacefulGatherer, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
    expect(deckAfter).toBe(deckBefore - 1);
  });

  it("should quest for base lore without cards under", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: kangaPeacefulGatherer, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(kangaPeacefulGatherer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(kangaPeacefulGatherer.lore);
  });

  it("EXTRA HELP - base lore when no card is under", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [kangaPeacefulGatherer],
    });

    expect(testEngine.asPlayerOne().getCardLore(kangaPeacefulGatherer)).toBe(
      kangaPeacefulGatherer.lore,
    );
  });

  it("EXTRA HELP - gets +1 lore while there is a card under this character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: kangaPeacefulGatherer, cardsUnder: [deckCard] }],
    });

    expect(testEngine.asPlayerOne().getCardLore(kangaPeacefulGatherer)).toBe(
      kangaPeacefulGatherer.lore + 1,
    );
  });
});
