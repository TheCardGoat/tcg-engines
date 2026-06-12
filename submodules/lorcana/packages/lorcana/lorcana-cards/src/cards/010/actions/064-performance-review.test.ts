import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  bagheeraCautiousExplorer,
  bigNoseLovesickPoet,
  chefLouisInOverHisHead,
  scroogeMcduckCavernProspector,
} from "../characters";
import { performanceReview } from "./064-performance-review";

describe("Performance Review", () => {
  it("draws cards equal to chosen ready character's lore value (lore 1)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [performanceReview],
      inkwell: performanceReview.cost,
      play: [bigNoseLovesickPoet], // Has 1 lore
      deck: 5,
    });

    const playResult = testEngine.asPlayerOne().playCard(performanceReview, {
      targets: [bigNoseLovesickPoet],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(bigNoseLovesickPoet)).toBe(true);
    // Started with 1 card in hand (performanceReview), played it, then drew 1 card
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });

  it("draws cards equal to chosen ready character's lore value (lore 2)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [performanceReview],
      inkwell: performanceReview.cost,
      play: [scroogeMcduckCavernProspector], // Has 2 lore
      deck: 5,
    });

    const playResult = testEngine.asPlayerOne().playCard(performanceReview, {
      targets: [scroogeMcduckCavernProspector],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(scroogeMcduckCavernProspector)).toBe(true);
    // Started with 1 card in hand (performanceReview), played it, then drew 2 cards
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(2);
  });

  it("draws cards equal to chosen ready character's lore value (lore 3)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [performanceReview],
      inkwell: performanceReview.cost,
      play: [chefLouisInOverHisHead], // Has 3 lore
      deck: 5,
    });

    const playResult = testEngine.asPlayerOne().playCard(performanceReview, {
      targets: [chefLouisInOverHisHead],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(chefLouisInOverHisHead)).toBe(true);
    // Started with 1 card in hand (performanceReview), played it, then drew 3 cards
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(3);
  });

  it("can only target ready characters (exerted character should not be valid target)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [performanceReview],
      inkwell: performanceReview.cost,
      play: [bagheeraCautiousExplorer], // Has 1 lore
      deck: 5,
    });

    // Exert the character before playing the card
    testEngine.asServer().manualExertCard(bagheeraCautiousExplorer);

    expect(testEngine.asPlayerOne().isExerted(bagheeraCautiousExplorer)).toBe(true);

    // Targeting an exerted character should fail since only ready characters are valid
    const playResult = testEngine.asPlayerOne().playCard(performanceReview, {
      targets: [bagheeraCautiousExplorer],
    });

    expect(playResult).not.toBeSuccessfulCommand();
  });
});
