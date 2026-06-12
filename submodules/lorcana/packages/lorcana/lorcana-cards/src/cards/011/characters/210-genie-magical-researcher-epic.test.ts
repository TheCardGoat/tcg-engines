import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { genieMagicalResearcherEpic } from "./210-genie-magical-researcher-epic";

const underCard = createMockCharacter({
  id: "genie-magical-researcher-epic-under-card",
  name: "Under Card",
  cost: 1,
});

describe("Genie - Magical Researcher - Epic", () => {
  it("matches the base card's lore bonus from cards under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: genieMagicalResearcherEpic, cardsUnder: [underCard, underCard] }],
    });

    expect(testEngine.asPlayerOne().getCardLore(genieMagicalResearcherEpic)).toBe(
      genieMagicalResearcherEpic.lore + 2,
    );
  });
});
