import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { herculesSpectralDemigod } from "@tcg/lorcana-cards/cards/011";

/**
 * Regression: Hercules - Spectral Demigod (set 11, #117), 1-cost.
 * - Boost 2 {I} puts a card under him.
 * - SUPERHUMAN STRENGTH: While there's a card under this character, he gets +3 {S}.
 *
 * Player bug claim: "gains +3 strength when boosted; does not take damage when challenging."
 * Validates that after a boost activation, Hercules' challenge math uses the +3 strength
 * from SUPERHUMAN STRENGTH and that the engine resolves the challenge without errors.
 */
describe("Hercules - Spectral Demigod: boost strength applies in challenge", () => {
  it("boosted Hercules deals 3 damage to a ready defender via challenge", () => {
    const defender = createMockCharacter({
      id: "hsd-defender",
      name: "Defender",
      cost: 2,
      strength: 1,
      willpower: 10,
    });

    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: herculesSpectralDemigod, isDrying: false }],
        inkwell: 5,
        deck: 5,
      },
      {
        play: [{ card: defender, exerted: true }],
        deck: 3,
      },
    );

    // Activate Boost 2 (pays 2 ink, puts top of deck under Hercules).
    expect(
      engine.asPlayerOne().activateAbility(herculesSpectralDemigod, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    // Strength goes from 0 to +3 via SUPERHUMAN STRENGTH.
    expect(engine.asPlayerOne().getCard(herculesSpectralDemigod).strength).toBe(3);

    // Challenge the exerted defender. Challenger deals 3, defender strikes back with 1.
    expect(
      engine.asPlayerOne().challenge(herculesSpectralDemigod, defender),
    ).toBeSuccessfulCommand();

    expect(engine.asPlayerTwo().getDamage(defender)).toBe(3);
    // Hercules willpower is 3; 1 damage counter leaves him alive in play.
    expect(engine.asPlayerOne().getCardZone(herculesSpectralDemigod)).toBe("play");
    expect(engine.asPlayerOne().getDamage(herculesSpectralDemigod)).toBe(1);
  });
});
