import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { tianaCelebratingPrincess } from "./196-tiana-celebrating-princess";

describe("Tiana - Celebrating Princess", () => {
  it("has Resist +2", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tianaCelebratingPrincess],
    });

    const cardModel = testEngine.getCardModel(tianaCelebratingPrincess);
    expect(cardModel.hasResist).toBe(true);
    expect(cardModel.damageReduction).toBe(2);
  });

  describe("WHAT YOU GIVE IS WHAT YOU GET", () => {
    it("prevents opponents from playing actions when exerted with no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: [dragonFire],
        },
        {
          play: [{ card: tianaCelebratingPrincess, exerted: true }],
          deck: [tianaCelebratingPrincess],
        },
      );

      expect(testEngine.asPlayerOne().canPlayCard(dragonFire)).toBe(false);
      expect(testEngine.asPlayerOne().playCard(dragonFire).success).toBe(false);
    });

    it("does NOT prevent opponents from playing actions when exerted but has cards in hand", () => {
      // Note: canPlayCard is a client-side preflight that doesn't see opponent's hidden hand.
      // We verify using the server-authoritative playCard result instead.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: [dragonFire],
        },
        {
          hand: [tianaCelebratingPrincess],
          play: [{ card: tianaCelebratingPrincess, exerted: true }],
          deck: [tianaCelebratingPrincess],
        },
      );

      expect(testEngine.asPlayerOne().playCard(dragonFire).success).toBe(true);
    });

    it("does NOT prevent opponents from playing actions when NOT exerted and no cards in hand", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: [dragonFire],
        },
        {
          play: [tianaCelebratingPrincess],
          deck: [tianaCelebratingPrincess],
        },
      );

      expect(testEngine.asPlayerOne().canPlayCard(dragonFire)).toBe(true);
    });

    it("checks restriction only for the player whose turn it is (player one)", () => {
      // Player two has Tiana exerted with no cards in hand
      // But it's still player one's turn, so player one should be restricted
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: [dragonFire],
        },
        {
          play: [{ card: tianaCelebratingPrincess, exerted: true }],
          deck: [tianaCelebratingPrincess],
        },
      );

      // Player two has the restriction ability, player one tries to play action
      expect(testEngine.asPlayerOne().hasPlayerRestriction(PLAYER_TWO, "cant-play-actions")).toBe(
        false,
      );
      // But the static ability still blocks player one from playing actions
      expect(testEngine.asPlayerOne().canPlayCard(dragonFire)).toBe(false);
    });
  });
});
