import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { ursulaWhisperOfVanessa } from "./059-ursula-whisper-of-vanessa";

const deckCard = createMockCharacter({
  id: "ursula-whisper-of-vanessa-deck-card",
  name: "Deck Card",
  cost: 1,
});

describe("Ursula - Whisper of Vanessa", () => {
  it("has Boost 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [ursulaWhisperOfVanessa],
    });

    expect(testEngine.getCardModel(ursulaWhisperOfVanessa).hasBoost()).toBe(true);
  });

  it("SLIPPERY SPELL - base stats when no card is under", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ursulaWhisperOfVanessa],
    });

    expect(testEngine.asPlayerOne().getCardLore(ursulaWhisperOfVanessa)).toBe(
      ursulaWhisperOfVanessa.lore,
    );
    expect(testEngine.asPlayerOne().hasKeyword(ursulaWhisperOfVanessa, "Evasive")).toBe(false);
  });

  it("SLIPPERY SPELL - gets +1 lore and gains Evasive while there is a card under this character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: ursulaWhisperOfVanessa, cardsUnder: [deckCard] }],
    });

    expect(testEngine.asPlayerOne().getCardLore(ursulaWhisperOfVanessa)).toBe(
      ursulaWhisperOfVanessa.lore + 1,
    );
    expect(testEngine.asPlayerOne().hasKeyword(ursulaWhisperOfVanessa, "Evasive")).toBe(true);
  });
});
