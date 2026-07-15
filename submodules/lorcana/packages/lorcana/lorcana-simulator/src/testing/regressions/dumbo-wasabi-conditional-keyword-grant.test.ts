import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dumboNinthWonderOfTheUniverse } from "@tcg/lorcana-cards/cards/009";
import { wasabiMethodicalEngineer } from "@tcg/lorcana-cards/cards/006";

/**
 * BUG-E: Dumbo + Wasabi conditional keyword grant timing.
 *
 * Wasabi's QUICK REFLEXES grants Evasive "during your turn" (conditional static).
 * Dumbo's MAKING HISTORY grants BREAKING RECORDS to "your other Evasive characters".
 *
 * The static effect registry must evaluate conditional keyword grants (gain-keyword)
 * BEFORE grant-abilities-while-here, so that Wasabi qualifies as Evasive when
 * Dumbo's target filter checks for "YOUR_OTHER_EVASIVE_CHARACTERS".
 */
describe("BUG-E: Dumbo MAKING HISTORY + Wasabi QUICK REFLEXES interaction", () => {
  it("Wasabi should have Evasive during controller's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dumboNinthWonderOfTheUniverse, wasabiMethodicalEngineer],
      inkwell: 4,
      deck: 5,
    });

    // During player one's turn, Wasabi should have Evasive from QUICK REFLEXES
    expect(engine.asPlayerOne().hasKeyword(wasabiMethodicalEngineer, "Evasive")).toBe(true);
  });

  it("Wasabi should receive BREAKING RECORDS from Dumbo during controller's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [dumboNinthWonderOfTheUniverse, wasabiMethodicalEngineer],
      inkwell: 4,
      deck: 5,
    });

    // During player one's turn, Wasabi has Evasive, so Dumbo's MAKING HISTORY
    // should grant the BREAKING RECORDS activated ability to Wasabi
    const wasabiCard = engine.asPlayerOne().getCard(wasabiMethodicalEngineer);
    const grantedAbilities = wasabiCard.grantedAbilityTextEntries ?? [];

    expect(grantedAbilities.some((entry) => entry.title === "BREAKING RECORDS")).toBe(true);
  });

  it("Wasabi should NOT receive BREAKING RECORDS during opponent's turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [dumboNinthWonderOfTheUniverse, wasabiMethodicalEngineer],
        inkwell: 4,
        deck: 5,
      },
      { deck: 5 },
    );

    // Pass the turn to player two
    engine.asPlayerOne().passTurn();

    // During opponent's turn, Wasabi should NOT have Evasive
    // (QUICK REFLEXES only active during your turn)
    expect(engine.asPlayerOne().hasKeyword(wasabiMethodicalEngineer, "Evasive")).toBe(false);

    // Without Evasive, Wasabi should NOT have the granted BREAKING RECORDS ability
    const wasabiCard = engine.asPlayerOne().getCard(wasabiMethodicalEngineer);
    const grantedAbilities = wasabiCard.grantedAbilityTextEntries ?? [];

    expect(grantedAbilities.some((entry) => entry.title === "BREAKING RECORDS")).toBe(false);
  });
});
