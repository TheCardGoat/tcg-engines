import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { littleJohnImpermanentOutlaw } from "../../010/characters/092-little-john-impermanent-outlaw";
import { rooLittleHelper } from "./137-roo-little-helper";
import { goofyKnightForADay } from "../../002/characters/180-goofy-knight-for-a-day";

describe("Roo - Little Helper", () => {
  it("is playable and enters play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rooLittleHelper],
      inkwell: rooLittleHelper.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(rooLittleHelper)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("play");
  });

  describe("HOPPING IN", () => {
    it("puts this character under a character with Boost when activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [rooLittleHelper, littleJohnImpermanentOutlaw],
      });

      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(0);
      expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("play");

      expect(
        testEngine.asPlayerOne().activateAbility(rooLittleHelper, { ability: "HOPPING IN" }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [littleJohnImpermanentOutlaw] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("limbo");
      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);
    });

    it("requires exerting Roo to activate the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [rooLittleHelper, littleJohnImpermanentOutlaw],
      });

      expect(testEngine.asPlayerOne().isExerted(rooLittleHelper)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(rooLittleHelper, { ability: "HOPPING IN" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(rooLittleHelper)).toBe(true);

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [littleJohnImpermanentOutlaw] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("limbo");
    });

    it("cannot activate if Roo is already exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: rooLittleHelper, exerted: true }, littleJohnImpermanentOutlaw],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(rooLittleHelper, { ability: "HOPPING IN" }),
      ).not.toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("play");
      expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(0);
    });

    it("creates a pending resolution and skips when resolved if there are no characters with Boost in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [rooLittleHelper, goofyKnightForADay],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(rooLittleHelper, { ability: "HOPPING IN" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(rooLittleHelper)).toBe(true);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      expect(testEngine.asPlayerOne().resolveNextPending()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("play");
    });

    it("creates a pending resolution and skips when resolved if only an opponent has a character with Boost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [rooLittleHelper] },
        { play: [littleJohnImpermanentOutlaw] },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(rooLittleHelper, { ability: "HOPPING IN" }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(rooLittleHelper)).toBe(true);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);

      expect(testEngine.asPlayerOne().resolveNextPending()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("play");
    });
  });

  it("regression: cards stacked under Roo should follow when Roo is moved under another character", () => {
    // Bug: Cards stacked under a character were not following when that character
    // was moved under another character via HOPPING IN.
    // When Roo (who has cards under him) uses HOPPING IN to go under a Boost character,
    // those cards should also move under the new character.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: rooLittleHelper, isDrying: false }, littleJohnImpermanentOutlaw],
      deck: 5,
    });

    expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(0);

    expect(
      testEngine.asPlayerOne().activateAbility(rooLittleHelper, { ability: "HOPPING IN" }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [littleJohnImpermanentOutlaw] }),
    ).toBeSuccessfulCommand();

    // Roo should be under Little John now
    expect(testEngine.asPlayerOne().getCardZone(rooLittleHelper)).toBe("limbo");
    expect(testEngine.getCardsUnder(littleJohnImpermanentOutlaw)).toHaveLength(1);
  });
});
