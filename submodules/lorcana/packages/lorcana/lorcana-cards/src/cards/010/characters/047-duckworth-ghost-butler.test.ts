import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { smash, aladdinPrinceAli } from "../../001";
import { duckworthGhostButler } from "./047-duckworth-ghost-butler";
import { megaraSecretKeeper } from "./086-megara-secret-keeper";

describe("Duckworth - Ghost Butler", () => {
  it("has Rush ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [duckworthGhostButler],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(duckworthGhostButler, "Rush")).toBe(true);
  });

  describe("FINAL ACT — During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.", () => {
    it("triggers when Duckworth is banished during your turn and puts top card under a character with Boost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [duckworthGhostButler, megaraSecretKeeper],
          hand: [smash],
          inkwell: smash.cost,
          deck: [aladdinPrinceAli],
        },
        {
          deck: 2,
        },
      );

      const storedCardId = testEngine.findCardInstanceId(aladdinPrinceAli, "deck", "p1");

      expect(
        testEngine.asPlayerOne().playCard(smash, { targets: [duckworthGhostButler] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(duckworthGhostButler)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(duckworthGhostButler, {
          resolveOptional: true,
          targets: [megaraSecretKeeper],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(megaraSecretKeeper)).toEqual([storedCardId]);
    });

    it("does not trigger when Duckworth is banished during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [duckworthGhostButler, megaraSecretKeeper],
          deck: 2,
        },
        {
          hand: [smash],
          inkwell: smash.cost,
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerTwo().playCard(smash, { targets: [duckworthGhostButler] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(duckworthGhostButler)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("is optional — can decline to put card under", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [duckworthGhostButler, megaraSecretKeeper],
          hand: [smash],
          inkwell: smash.cost,
          deck: [aladdinPrinceAli],
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(smash, { targets: [duckworthGhostButler] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(duckworthGhostButler, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.getCardsUnder(megaraSecretKeeper)).toEqual([]);
    });
  });
});
