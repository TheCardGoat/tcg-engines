import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { annaMagicalMission } from "./072-anna-magical-mission";

const elsaMock = createMockCharacter({
  id: "elsa-mock",
  name: "Elsa",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const notElsaMock = createMockCharacter({
  id: "not-elsa-mock",
  name: "Olaf",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Anna - Magical Mission", () => {
  it("COORDINATED PLAN - draws a card when questing with Elsa in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [annaMagicalMission, elsaMock],
      deck: 5,
    });

    const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

    // Quest with Anna - she has Support + COORDINATED PLAN triggered abilities
    expect(testEngine.asPlayerOne().quest(annaMagicalMission)).toBeSuccessfulCommand();

    // Resolve Support (needs a target character) and COORDINATED PLAN (optional draw, no target)
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const bagEffect of bagEffects) {
      const isSupport = bagEffect.id.includes("support");
      testEngine.asPlayerOne().resolveBag(bagEffect.id, {
        resolveOptional: true,
        targets: isSupport ? [elsaMock] : [],
      });
    }

    const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
    expect(handAfter).toBe(handBefore + 1);
  });

  it("COORDINATED PLAN - does NOT draw a card when no Elsa in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [annaMagicalMission, notElsaMock],
      deck: 5,
    });

    const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

    expect(testEngine.asPlayerOne().quest(annaMagicalMission)).toBeSuccessfulCommand();

    // Support bag effect might still fire, resolve it
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const bagEffect of bagEffects) {
      testEngine.asPlayerOne().resolveBag(bagEffect.id, {
        resolveOptional: true,
        targets: [notElsaMock],
      });
    }

    const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
    // Should NOT have drawn - no Elsa in play
    expect(handAfter).toBe(handBefore);
  });
});
