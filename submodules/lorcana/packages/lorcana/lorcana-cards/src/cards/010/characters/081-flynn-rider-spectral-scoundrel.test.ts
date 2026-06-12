import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { genieOnTheJob } from "../../001/characters/075-genie-on-the-job";
import { flynnRiderSpectralScoundrel } from "./081-flynn-rider-spectral-scoundrel";

describe("Flynn Rider - Spectral Scoundrel", () => {
  it("gains +2 strength and +1 lore after using Boost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flynnRiderSpectralScoundrel],
      deck: 2,
      inkwell: 2,
    });

    const flynnBefore = testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel);
    expect(flynnBefore.strength).toBe(flynnRiderSpectralScoundrel.strength);
    expect(flynnBefore.lore).toBe(flynnRiderSpectralScoundrel.lore);

    expect(
      testEngine.asPlayerOne().activateAbility(flynnRiderSpectralScoundrel, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    const flynnAfter = testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel);
    expect(testEngine.getCardsUnder(flynnRiderSpectralScoundrel)).toHaveLength(1);
    expect(flynnAfter.strength).toBe(flynnRiderSpectralScoundrel.strength + 2);
    expect(flynnAfter.lore).toBe(flynnRiderSpectralScoundrel.lore + 1);
  });

  it("loses the bonus stats after leaving play with the card under him", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [flynnRiderSpectralScoundrel],
      hand: [genieOnTheJob],
      deck: 2,
      inkwell: genieOnTheJob.cost + 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(flynnRiderSpectralScoundrel, { ability: "Boost" }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getCardsUnder(flynnRiderSpectralScoundrel)).toHaveLength(1);

    expect(testEngine.asPlayerOne().playCard(genieOnTheJob)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ targets: [flynnRiderSpectralScoundrel] }),
    ).toBeSuccessfulCommand();

    const flynnAfter = testEngine.asPlayerOne().getCard(flynnRiderSpectralScoundrel);
    expect(testEngine.asPlayerOne().getCardZone(flynnRiderSpectralScoundrel)).toBe("hand");
    expect(testEngine.getCardsUnder(flynnRiderSpectralScoundrel)).toHaveLength(0);
    expect(flynnAfter.strength).toBe(flynnRiderSpectralScoundrel.strength);
    expect(flynnAfter.lore).toBe(flynnRiderSpectralScoundrel.lore);
  });
});
