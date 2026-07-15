import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { scroogeMcduckGhostlyEbenezer } from "./104-scrooge-mcduck-ghostly-ebenezer";

describe("Scrooge McDuck - Ghostly Ebenezer", () => {
  it("should be able to activate Boost 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [scroogeMcduckGhostlyEbenezer],
      deck: 5,
      inkwell: 10,
    });

    const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

    expect(
      testEngine.asPlayerOne().activateAbility(scroogeMcduckGhostlyEbenezer, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    const deckAfter = testEngine.asPlayerOne().getZonesCardCount().deck;
    expect(deckAfter).toBe(deckBefore - 1);
  });

  it("should have base 3/3 stats with no cards under", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [scroogeMcduckGhostlyEbenezer],
    });

    const scrooge = testEngine.asPlayerOne().getCard(scroogeMcduckGhostlyEbenezer);
    expect(scrooge.strength).toBe(3);
    expect(scrooge.willpower).toBe(3);
  });

  it("should get +1 strength and +1 willpower for each card under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [scroogeMcduckGhostlyEbenezer],
      deck: 5,
      inkwell: 10,
    });

    const scrooge = testEngine.asPlayerOne().getCard(scroogeMcduckGhostlyEbenezer);
    expect(scrooge.strength).toBe(3);
    expect(scrooge.willpower).toBe(3);

    testEngine.asPlayerOne().activateAbility(scroogeMcduckGhostlyEbenezer, { ability: "Boost" });

    const scroogeAfter = testEngine.asPlayerOne().getCard(scroogeMcduckGhostlyEbenezer);
    expect(scroogeAfter.strength).toBe(4);
    expect(scroogeAfter.willpower).toBe(4);
  });

  it("should get +2 strength and +2 willpower with 2 cards under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [scroogeMcduckGhostlyEbenezer],
      deck: 5,
      inkwell: 10,
    });

    testEngine.asPlayerOne().activateAbility(scroogeMcduckGhostlyEbenezer, { ability: "Boost" });
    testEngine.asPlayerOne().passTurn();
    testEngine.asPlayerTwo().passTurn();
    testEngine.asPlayerOne().activateAbility(scroogeMcduckGhostlyEbenezer, { ability: "Boost" });

    const scrooge = testEngine.asPlayerOne().getCard(scroogeMcduckGhostlyEbenezer);
    expect(scrooge.strength).toBe(5);
    expect(scrooge.willpower).toBe(5);
  });
});
