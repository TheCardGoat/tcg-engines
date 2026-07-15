import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { princeNaveenUkulelePlayer } from "./003-prince-naveen-ukulele-player";
import { peteGamesReferee } from "./195-pete-games-referee";

const cheapSong = createMockSong({
  id: "naveen-test-cheap-song",
  name: "Cheap Song",
  cost: 4,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const expensiveSong = createMockSong({
  id: "naveen-test-expensive-song",
  name: "Expensive Song",
  cost: 7,
  text: "Gain 3 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 3,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

describe("Prince Naveen - Ukulele Player", () => {
  describe("IT'S BEAUTIFUL, NO? — When you play this character, you may play a song with cost 6 or less for free.", () => {
    it("triggers a bag effect when played and allows playing a song for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [princeNaveenUkulelePlayer, cheapSong],
        inkwell: princeNaveenUkulelePlayer.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(princeNaveenUkulelePlayer)).toBeSuccessfulCommand();

      // IT'S BEAUTIFUL, NO? should be in the bag as an optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      const cheapSongId = testEngine.findCardInstanceId(cheapSong, "hand", PLAYER_ONE);

      // Resolve with the cheap song (cost 4, within ≤6 limit)
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princeNaveenUkulelePlayer, { targets: [cheapSongId] }),
      ).toBeSuccessfulCommand();

      // Song was played for free and goes to discard
      expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not allow playing a song with cost greater than 6 for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [princeNaveenUkulelePlayer, expensiveSong],
        inkwell: princeNaveenUkulelePlayer.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(princeNaveenUkulelePlayer)).toBeSuccessfulCommand();

      const expensiveSongId = testEngine.findCardInstanceId(expensiveSong, "hand", PLAYER_ONE);

      const bagCount = testEngine.asPlayerOne().getBagCount();
      if (bagCount > 0) {
        const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
        const result = testEngine
          .asPlayerOne()
          .resolvePendingByCard(princeNaveenUkulelePlayer, { targets: [expensiveSongId] });
        // Either fails or auto-resolves with no valid target
        expect(testEngine.asPlayerOne().getCardZone(expensiveSong)).toBe("hand");
      } else {
        // Auto-resolved because no eligible songs in hand
        expect(testEngine.asPlayerOne().getCardZone(expensiveSong)).toBe("hand");
      }
    });

    it("can skip the optional ability (decline)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [princeNaveenUkulelePlayer, cheapSong],
        inkwell: princeNaveenUkulelePlayer.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(princeNaveenUkulelePlayer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(princeNaveenUkulelePlayer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Song stays in hand (ability was skipped)
      expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("hand");
    });
  });
});

describe("Prince Naveen - Ukulele Player (Regressions)", () => {
  it("can't play the song via the ability when Pete - Games Referee's play restriction is active", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [peteGamesReferee],
        inkwell: peteGamesReferee.cost,
        deck: 2,
      },
      {
        hand: [princeNaveenUkulelePlayer, cheapSong],
        inkwell: princeNaveenUkulelePlayer.cost,
        deck: 2,
      },
    );

    // Player one plays Pete to restrict player two from playing actions
    expect(testEngine.asPlayerOne().playCard(peteGamesReferee)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasPlayerRestriction(PLAYER_TWO, "cant-play-actions")).toBe(
      true,
    );

    // Pass to player two
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Player two plays Prince Naveen
    expect(testEngine.asPlayerTwo().playCard(princeNaveenUkulelePlayer)).toBeSuccessfulCommand();

    // The optional ability should still appear in the bag
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

    const cheapSongId = testEngine.findCardInstanceId(cheapSong, "hand", PLAYER_TWO);
    const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();

    // Resolve the bag effect — the cant-play-actions restriction should prevent playing the song
    testEngine
      .asPlayerTwo()
      .resolvePendingByCard(princeNaveenUkulelePlayer, { targets: [cheapSongId] });

    // Song stays in hand because cant-play-actions blocks it
    expect(testEngine.asPlayerTwo().getCardZone(cheapSong)).toBe("hand");
  });
});
