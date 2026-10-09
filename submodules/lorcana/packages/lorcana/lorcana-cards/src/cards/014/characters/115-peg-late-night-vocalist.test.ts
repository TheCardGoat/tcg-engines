// CR 2.2.0: 5.4.4.2 (song payment), 8.11.1–8.11.2 (Singer).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { pegLatenightVocalist as peg } from "./115-peg-late-night-vocalist";
const song = (cost: number) =>
  createMockSong({
    id: `peg-song-${cost}`,
    name: `Song ${cost}`,
    cost,
    text: "Gain 2 lore.",
    abilities: [{ type: "action", effect: { type: "gain-lore", amount: 2, target: "CONTROLLER" } }],
  });
const four = song(4);
const five = song(5);
describe("Peg - Late-Night Vocalist", () => {
  it.each([1, 2, 3, 4])("sings cost %s at zero ink and resolves the effect", (cost: number) => {
    const chosen = song(cost);
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ play: [peg], hand: [chosen] });
    expect(game.asPlayerOne().singSong(chosen, peg)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(chosen)).toBe("discard");
    expect(game.asPlayerOne().isExerted(peg)).toBe(true);
    expect(game.getLore(PLAYER_ONE)).toBe(2);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("rejects cost five with five ink and preserves the legal cost-four sing", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [peg],
      hand: [four, five],
      inkwell: 5,
    });
    expect(game.asPlayerOne().singSong(five, peg)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(five)).toBe("hand");
    expect(game.asPlayerOne().isExerted(peg)).toBe(false);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().singSong(four, peg)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(5);
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
  it.each([{ isDrying: true }, { exerted: true }])(
    "rejects an unavailable singer: %j",
    (state: { isDrying?: boolean; exerted?: boolean }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: peg, ...state }],
        hand: [four],
      });
      expect(game.asPlayerOne().singSong(four, peg)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(four)).toBe("hand");
      expect(game.getLore(PLAYER_ONE)).toBe(0);
    },
  );
  it("cannot use opposing Peg", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [four] }, { play: [peg] });
    const enemy = game.findCardInstanceId(peg, "play", PLAYER_TWO);
    expect(game.asPlayerOne().singSong(four, enemy)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(four)).toBe("hand");
    expect(game.asPlayerOne().isExerted(enemy)).toBe(false);
  });
  it("pays printed cost two and sings after drying", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [peg, four], inkwell: 2, deck: 6 },
      { deck: 6 },
    );
    expect(game.asPlayerOne().playCard(peg)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().singSong(four, peg)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().singSong(four, peg)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
  });
  it("cannot sing a second cost-four song while exerted", () => {
    const second = createMockSong({
      id: "peg-second-song",
      name: "Second Song",
      cost: 4,
      text: "Gain 2 lore.",
      abilities: four.abilities,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [peg],
      hand: [four, second],
    });
    expect(game.asPlayerOne().singSong(four, peg)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().singSong(second, peg)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(second)).toBe("hand");
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
  it("Singer does not change printed cost or quest lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ play: [peg] });
    expect(game.asPlayerOne().quest(peg)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
  });
});

it("player two sings with their own Peg without spending either player's ink or drops", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [peg], inkwell: 4, inkDrops: 3, lore: 6, deck: 6 },
    { play: [peg], hand: [four, five], inkwell: 5, inkDrops: 2, lore: 7, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const own = game.findCardInstanceId(peg, "play", PLAYER_TWO);
  const enemy = game.findCardInstanceId(peg, "play", PLAYER_ONE);
  expect(game.asPlayerTwo().singSong(four, enemy)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().singSong(five, own)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(own)).toBe(false);
  expect(game.asPlayerTwo().singSong(four, own)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(four)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(five)).toBe("hand");
  expect(game.asPlayerTwo().isExerted(own)).toBe(true);
  expect(game.asPlayerOne().isExerted(enemy)).toBe(false);
  expect(game.getLore(PLAYER_TWO)).toBe(9);
  expect(game.getLore(PLAYER_ONE)).toBe(6);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
});
