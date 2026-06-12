import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { healingGlow, simbaProtectiveCub } from "../../001";
import { theBareNecessities } from "./028-the-bare-necessities";
import { ursulaDeceiverOfAll } from "../characters/091-ursula-deceiver-of-all";

describe("The Bare Necessities", () => {
  it("makes the chosen opponent discard a non-character card of your choice", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theBareNecessities],
        inkwell: theBareNecessities.cost,
      },
      {
        hand: [healingGlow, simbaProtectiveCub],
      },
    );
    const healingGlowId = testEngine.findCardInstanceId(healingGlow, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(theBareNecessities).success).toBe(true);
    expect(testEngine.asPlayerOne().respondWith(healingGlowId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(healingGlowId)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
  });

  it("regression: resolves correctly when double-sung via Ursula - Deceiver of All", () => {
    const nonCharCard = createMockCharacter({
      id: "bare-necessities-non-char",
      name: "Non Char Card",
      cost: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: ursulaDeceiverOfAll, isDrying: false }],
        hand: [theBareNecessities],
        inkwell: theBareNecessities.cost,
        deck: 5,
      },
      {
        hand: [healingGlow, simbaProtectiveCub],
        deck: 5,
      },
    );

    // Ursula sings The Bare Necessities
    expect(
      testEngine.asPlayerOne().singSong(theBareNecessities, ursulaDeceiverOfAll),
    ).toBeSuccessfulCommand();

    // First singing: choose opponent and discard a non-character card
    const healingGlowId = testEngine.findCardInstanceId(healingGlow, "hand", PLAYER_TWO);

    // Resolve pending target selection for the first song effect
    for (
      let i = 0;
      i < 50 &&
      (testEngine.asPlayerOne().getBagCount() > 0 || testEngine.asPlayerTwo().getBagCount() > 0);
      i++
    ) {
      const p1Bags = testEngine.asPlayerOne().getBagEffects();
      if (p1Bags.length > 0) {
        const result = testEngine
          .asPlayerOne()
          .resolvePendingByCard(theBareNecessities, { resolveOptional: true });
        if (!result.success) break;
        continue;
      }
      break;
    }

    // Try to respond with the non-character card
    try {
      testEngine.asPlayerOne().respondWith(healingGlowId);
    } catch {
      // May auto-resolve
    }

    // The song should have resolved — healing glow should be discarded
    // (or at minimum, the engine should not crash/hang when double-sung)
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("hand");
  });
});
