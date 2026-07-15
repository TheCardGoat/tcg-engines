import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { genieMagicalResearcher } from "./049-genie-magical-researcher";

const underCard = createMockCharacter({
  id: "genie-magical-researcher-under-card",
  name: "Under Card",
  cost: 1,
});

describe("Genie - Magical Researcher", () => {
  it("quests for base lore when there are no cards under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: genieMagicalResearcher, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().getCardLore(genieMagicalResearcher)).toBe(
      genieMagicalResearcher.lore,
    );
    expect(testEngine.asPlayerOne().quest(genieMagicalResearcher)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(genieMagicalResearcher.lore);
  });

  it("gets +1 lore for each card under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: genieMagicalResearcher, isDrying: false, cardsUnder: [underCard, underCard] }],
    });

    expect(testEngine.asPlayerOne().getCardLore(genieMagicalResearcher)).toBe(
      genieMagicalResearcher.lore + 2,
    );
    expect(testEngine.asPlayerOne().quest(genieMagicalResearcher)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(genieMagicalResearcher.lore + 2);
  });
});
