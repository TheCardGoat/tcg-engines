import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
  createMockAction,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { singer } from "../../../helpers/abilities/singer";
import { powerlineMegastar } from "./017-powerline-megastar";

const backupSingerCard = createMockCharacter({
  id: "powerline-backup-singer-card",
  name: "Backup Singer Card",
  cost: 3,
  abilities: [singer(3)],
});

const secondBackupSingerCard = createMockCharacter({
  id: "powerline-backup-singer-card-2",
  name: "Second Backup Singer Card",
  cost: 3,
  abilities: [singer(3)],
});

const nonSingerCard = createMockCharacter({
  id: "powerline-non-singer-card",
  name: "Non Singer Card",
  cost: 3,
});

const otherSingerInPlay = createMockCharacter({
  id: "powerline-other-singer",
  name: "Other Singer",
  cost: 2,
  abilities: [singer(3)],
});

const plainCharacterInPlay = createMockCharacter({
  id: "powerline-plain-character",
  name: "Plain Character",
  cost: 2,
});

const cheapSong = createMockSong({
  id: "powerline-cheap-song",
  name: "Cheap Song",
  cost: 2,
  text: "A song.",
});

const secondCheapSong = createMockSong({
  id: "powerline-second-cheap-song",
  name: "Second Cheap Song",
  cost: 2,
  text: "A song.",
});

function loreOf(
  testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
): number {
  const id = testEngine.findCardInstanceId(powerlineMegastar, "play");
  return testEngine.asServer().getCard(id).lore ?? 0;
}

describe("Powerline - Megastar", () => {
  it("can sing a song (Singer 9)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapSong],
      play: [{ card: powerlineMegastar, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().singSong(cheapSong, powerlineMegastar)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(cheapSong)).toBe("discard");
  });

  it("returns a character card with Singer from discard to hand when you play a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapSong],
      inkwell: cheapSong.cost,
      play: [{ card: powerlineMegastar, isDrying: false }],
      discard: [backupSingerCard, nonSingerCard],
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(powerlineMegastar, {
        targets: [backupSingerCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(backupSingerCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(nonSingerCard)).toBe("discard");
  });

  it("triggers only once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapSong, secondCheapSong],
      inkwell: cheapSong.cost + secondCheapSong.cost,
      play: [{ card: powerlineMegastar, isDrying: false }],
      discard: [backupSingerCard, secondBackupSingerCard],
      deck: 6,
    });

    // First song this turn: trigger fires once and returns a backup singer.
    expect(testEngine.asPlayerOne().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(powerlineMegastar, {
        targets: [backupSingerCard],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(backupSingerCard)).toBe("hand");

    // Second song the same turn: no additional trigger.
    expect(testEngine.asPlayerOne().playCard(secondCheapSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(secondBackupSingerCard)).toBe("discard");
  });

  it("does not trigger when no Singer character is in the discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapSong],
      inkwell: cheapSong.cost,
      play: [{ card: powerlineMegastar, isDrying: false }],
      discard: [nonSingerCard],
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("gets +1 {L} for each other Singer character in play (PERFECT HARMONY)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [powerlineMegastar, otherSingerInPlay],
      deck: 6,
    });

    expect(loreOf(testEngine)).toBe((powerlineMegastar.lore ?? 0) + 1);
  });

  it("does not count non-Singer characters for PERFECT HARMONY", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [powerlineMegastar, plainCharacterInPlay],
      deck: 6,
    });

    expect(loreOf(testEngine)).toBe(powerlineMegastar.lore);
  });

  it("also triggers when a song is sung and rejects a non-Singer target", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [cheapSong],
      play: [powerlineMegastar],
      discard: [backupSingerCard, nonSingerCard],
      deck: 6,
    });
    expect(engine.asPlayerOne().singSong(cheapSong, powerlineMegastar)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(powerlineMegastar, { targets: [powerlineMegastar] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(powerlineMegastar, { targets: [nonSingerCard] }),
    ).not.toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(powerlineMegastar, { targets: [backupSingerCard] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(backupSingerCard)).toBe("hand");
  });

  it("can return another Singer on a later turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cheapSong, secondCheapSong],
        play: [powerlineMegastar],
        discard: [backupSingerCard, secondBackupSingerCard],
        inkwell: 4,
        deck: 6,
      },
      { deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(powerlineMegastar, { targets: [backupSingerCard] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(secondCheapSong)).toBeSuccessfulCommand();
    expect(
      engine
        .asPlayerOne()
        .resolvePendingByCard(powerlineMegastar, { targets: [secondBackupSingerCard] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(secondBackupSingerCard)).toBe("hand");
  });

  it("does not return a Singer when an opponent plays a song", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [powerlineMegastar], discard: [backupSingerCard], deck: 6 },
      { hand: [cheapSong], inkwell: 2, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getBagCount()).toBe(0);
    expect(engine.asPlayerOne().getCardZone(backupSingerCard)).toBe("discard");
  });

  it("quests with one extra lore per friendly Singer, excluding himself and opponents", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [powerlineMegastar, otherSingerInPlay, backupSingerCard, plainCharacterInPlay],
        deck: 6,
      },
      { play: [secondBackupSingerCard], deck: 6 },
    );
    expect(engine.asPlayerOne().quest(powerlineMegastar)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe((powerlineMegastar.lore ?? 0) + 2);
  });
  it.each([7, 8, 9])("Singer 9 sings a cost-%s song and resolves its effect", (cost: number) => {
    const song = createMockSong({
      id: "powerline-boundary-song-" + cost,
      name: "Boundary Song",
      text: "Gain 1 lore.",
      cost,
      abilities: [
        { type: "action", effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" } },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      play: [powerlineMegastar],
      inkwell: 2,
      deck: 6,
    });
    expect(game.asPlayerOne().singSong(song, powerlineMegastar)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().isExerted(powerlineMegastar)).toBe(true);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().getCardZone(song)).toBe("discard");
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });

  it("cannot sing a cost-10 song even with enough ink to pay normally", () => {
    const song = createMockSong({
      id: "powerline-cost-ten",
      name: "Cost Ten Song",
      text: "A song costing 10.",
      cost: 10,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [song],
      play: [powerlineMegastar],
      inkwell: 10,
      deck: 6,
    });
    expect(game.asPlayerOne().singSong(song, powerlineMegastar).success).toBe(false);
    expect(game.asPlayerOne().isExerted(powerlineMegastar)).toBe(false);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(10);
    expect(game.asPlayerOne().getCardZone(song)).toBe("hand");
  });

  it("Player Two returns only their own Singer card", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { discard: [backupSingerCard], deck: 6 },
      {
        hand: [cheapSong],
        play: [powerlineMegastar],
        discard: [secondBackupSingerCard],
        inkwell: 2,
        deck: 6,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(cheapSong)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(powerlineMegastar, { targets: [backupSingerCard] })
        .success,
    ).toBe(false);
    expect(game.asPlayerOne().getCardZone(backupSingerCard)).toBe("discard");
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(powerlineMegastar, { targets: [secondBackupSingerCard] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(secondBackupSingerCard)).toBe("hand");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it("updates Perfect Harmony immediately when a friendly Singer leaves play", () => {
    const banish = createMockAction({
      id: "powerline-banish",
      name: "Banish Singer",
      cost: 1,
      abilities: [
        {
          type: "action",
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        },
      ],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [banish],
        play: [powerlineMegastar, otherSingerInPlay, backupSingerCard, plainCharacterInPlay],
        inkwell: 1,
        deck: 6,
      },
      { play: [secondBackupSingerCard], deck: 6 },
    );
    expect(game.asPlayerOne().getCard(powerlineMegastar).lore).toBe(3);
    expect(
      game.asPlayerOne().playCard(banish, { targets: [otherSingerInPlay] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(otherSingerInPlay)).toBe("discard");
    expect(game.asPlayerOne().getCard(powerlineMegastar).lore).toBe(2);
    expect(game.asPlayerOne().quest(powerlineMegastar)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
  it("Player Two's recovery resets on their next turn and ignores a non-song action", () => {
    const action = createMockAction({ id: "powerline-nonsong", name: "Plain Action", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      {
        hand: [action, cheapSong, secondCheapSong],
        play: [powerlineMegastar],
        discard: [backupSingerCard, secondBackupSingerCard],
        inkwell: 3,
        deck: 6,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(action)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().singSong(cheapSong, powerlineMegastar)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(powerlineMegastar, { targets: [backupSingerCard] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(backupSingerCard)).toBe("hand");
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().singSong(secondCheapSong, powerlineMegastar)).toBeSuccessfulCommand();
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(powerlineMegastar, { targets: [secondBackupSingerCard] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(secondBackupSingerCard)).toBe("hand");
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
  });
});
