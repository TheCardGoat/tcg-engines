// CR 2.2.0: 5.4.4.2 and 8.11.1-8.11.2. Singer changes the alternate song cost, not ink cost.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { singer } from "../../../helpers/abilities/singer";
import { maxGoofMusicLover } from "./003-max-goof-music-lover";

const otherSinger = createMockCharacter({
  id: "max-goof-other-singer",
  name: "Other Singer",
  cost: 2,
  strength: 2,
  willpower: 2,
  abilities: [singer(2)],
});

const nonSinger = createMockCharacter({
  id: "max-goof-non-singer",
  name: "Non Singer",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const affordableSong = createMockSong({
  id: "max-goof-affordable-song",
  name: "Affordable Song",
  cost: 5,
  text: "A song costing 5.",
  abilities: [{ type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } }],
});

const tooExpensiveSong = createMockSong({
  id: "max-goof-expensive-song",
  name: "Expensive Song",
  cost: 6,
  text: "A song costing 6.",
  abilities: [{ type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } }],
});

function loreOf(
  testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
): number {
  const id = testEngine.findCardInstanceId(maxGoofMusicLover, "play");
  return testEngine.asServer().getCard(id).lore ?? 0;
}

describe("Max Goof - Music Lover", () => {
  describe("Best Night Ever - While you have another character with Singer in play, this character gets +1 {L}.", () => {
    it("gets +1 {L} while another character with Singer is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [maxGoofMusicLover, otherSinger],
        deck: 1,
      });

      expect(loreOf(testEngine)).toBe((maxGoofMusicLover.lore ?? 0) + 1);
    });

    it("does not get +1 {L} while only non-Singer characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [maxGoofMusicLover, nonSinger],
        deck: 1,
      });

      expect(loreOf(testEngine)).toBe(maxGoofMusicLover.lore);
    });

    it("does not get +1 {L} while alone", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [maxGoofMusicLover],
        deck: 1,
      });

      expect(loreOf(testEngine)).toBe(maxGoofMusicLover.lore);
    });

    it("loses the bonus when the other Singer leaves play", () => {
      const attacker = createMockCharacter({
        id: "max-singer-attacker",
        name: "Attacker",
        cost: 1,
        strength: 2,
        willpower: 4,
      });
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maxGoofMusicLover, { card: otherSinger, exerted: true }],
          deck: 2,
        },
        { play: [{ card: attacker, isDrying: false }], deck: 2 },
      );

      expect(loreOf(testEngine)).toBe((maxGoofMusicLover.lore ?? 0) + 1);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().challenge(attacker, otherSinger)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(otherSinger)).toBe("discard");
      expect(loreOf(testEngine)).toBe(maxGoofMusicLover.lore);
    });

    it("does not count an opposing Singer", () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: maxGoofMusicLover, isDrying: false }],
        },
        { play: [otherSinger] },
      );
      expect(game.asPlayerOne().quest(maxGoofMusicLover)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(1);
    });

    it("quests for one extra lore even with two other Singers", () => {
      const secondSinger = { ...otherSinger, id: "max-second-singer" };
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: maxGoofMusicLover, isDrying: false }, otherSinger, secondSinger],
      });
      expect(game.asPlayerOne().quest(maxGoofMusicLover)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(2);
    });
  });

  describe("Singer 5", () => {
    for (const cost of [1, 2, 3, 4, 5]) {
      it(`sings a cost-${cost} song and resolves its reward without spending ink`, () => {
        const song = { ...affordableSong, id: `max-song-${cost}`, cost };
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [song],
          play: [{ card: maxGoofMusicLover, isDrying: false }],
          inkwell: 5,
          deck: 6,
        });

        expect(testEngine.asPlayerOne().singSong(song, maxGoofMusicLover)).toBeSuccessfulCommand();
        expect(testEngine.asPlayerOne().isExerted(maxGoofMusicLover)).toBe(true);
        expect(testEngine.asPlayerOne().getCardZone(song)).toBe("discard");
        expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
        expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
        expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      });
    }

    it("cannot sing a song with cost 6", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [tooExpensiveSong],
        play: [{ card: maxGoofMusicLover, isDrying: false }],
        inkwell: 6,
        deck: 6,
      });

      expect(testEngine.asPlayerOne().singSong(tooExpensiveSong, maxGoofMusicLover).success).toBe(
        false,
      );
      expect(testEngine.asPlayerOne().isExerted(maxGoofMusicLover)).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(tooExpensiveSong)).toBe("hand");
      expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(6);
      expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    });
  });

  it("uses Player Two's other Singer for its quest bonus", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [otherSinger], deck: 6 },
      { play: [maxGoofMusicLover, otherSinger], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(maxGoofMusicLover)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(2);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  });
});

it("each Player Two Max counts the other copy without stacking extra Singers", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [otherSinger], deck: 6 },
    { play: [maxGoofMusicLover, maxGoofMusicLover, otherSinger], deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const copies = game
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === maxGoofMusicLover.id);
  expect(copies).toHaveLength(2);
  for (const copy of copies) {
    expect(game.asPlayerTwo().quest(copy)).toBeSuccessfulCommand();
  }
  expect(game.getLore(PLAYER_TWO)).toBe(4);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
});

for (const isDrying of [false, true]) {
  it(`counts another exerted Singer even when its drying state is ${isDrying}`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: maxGoofMusicLover, isDrying: false },
          { card: otherSinger, exerted: true, isDrying },
        ],
        deck: 6,
      },
      { deck: 6 },
    );
    expect(game.asPlayerOne().quest(maxGoofMusicLover)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().isExerted(otherSinger)).toBe(true);
  });
}

it("Player Two ignores own hand/discard Singers and the opposing Singer", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [otherSinger], deck: 6 },
    { play: [maxGoofMusicLover], hand: [otherSinger], discard: [otherSinger], deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(maxGoofMusicLover)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(1);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toHaveLength(1);
});

it("Player Two rejects cost six despite available ink and sings cost five without payment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { play: [maxGoofMusicLover], hand: [affordableSong, tooExpensiveSong], inkwell: 6, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const expensiveId = game.findCardInstanceId(tooExpensiveSong, "hand", PLAYER_TWO);
  const affordableId = game.findCardInstanceId(affordableSong, "hand", PLAYER_TWO);
  expect(game.asPlayerTwo().singSong(expensiveId, maxGoofMusicLover)).not.toBeSuccessfulCommand();
  expect(game.asServer().getCard(expensiveId).zone).toBe("hand");
  expect(game.asPlayerTwo().isExerted(maxGoofMusicLover)).toBe(false);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(6);
  expect(game.getLore(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().singSong(affordableId, maxGoofMusicLover)).toBeSuccessfulCommand();
  expect(game.asServer().getCard(affordableId).zone).toBe("discard");
  expect(game.asPlayerTwo().isExerted(maxGoofMusicLover)).toBe(true);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(6);
  expect(game.getLore(PLAYER_TWO)).toBe(1);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
});
