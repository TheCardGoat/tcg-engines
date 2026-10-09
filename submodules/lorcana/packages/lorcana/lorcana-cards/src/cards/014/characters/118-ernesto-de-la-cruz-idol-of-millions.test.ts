// CR 2.2.0: 6.4.1 (continuous static ability), 5.4.4.2 and 8.11.1–8.11.2 (Singer).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { ernestoDeLaCruzIdolOfMillions as ernesto } from "./118-ernesto-de-la-cruz-idol-of-millions";
const song = (cost: number) =>
  createMockSong({
    id: `idol-song-${cost}`,
    name: `Song ${cost}`,
    cost,
    text: "Gain 2 lore.",
    abilities: [{ type: "action", effect: { type: "gain-lore", amount: 2, target: "CONTROLLER" } }],
  });
const five = song(5);
const six = song(6);
const plain = createMockAction({ id: "idol-plain", name: "Plain", cost: 0 });
const recover = createMockAction({
  id: "idol-recover",
  name: "Recover",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: { type: "return-from-discard", cardType: "action", target: "CONTROLLER" },
    },
  ],
});
describe("Ernesto de la Cruz - Idol of Millions", () => {
  it.each([1, 2, 3, 4, 5])(
    "Singer 5 sings cost %s at zero ink without counting own discarded song",
    (cost: number) => {
      const chosen = song(cost);
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [ernesto],
        hand: [chosen],
      });
      expect(game.asPlayerOne().singSong(chosen, ernesto)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(chosen)).toBe("discard");
      expect(game.asPlayerOne().isExerted(ernesto)).toBe(true);
      expect(game.getLore(PLAYER_ONE)).toBe(2);
      expect(game.asPlayerOne().getCardLore(ernesto)).toBe(1);
    },
  );
  it("rejects cost six despite six ink then sings five without spending ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [ernesto],
      hand: [five, six],
      inkwell: 6,
    });
    expect(game.asPlayerOne().singSong(six, ernesto)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(six)).toBe("hand");
    expect(game.asPlayerOne().isExerted(ernesto)).toBe(false);
    expect(game.asPlayerOne().singSong(five, ernesto)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(6);
  });
  it.each([{ isDrying: true }, { exerted: true }])(
    "rejects unavailable singer %j",
    (state: { isDrying?: boolean; exerted?: boolean }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: ernesto, ...state }],
        hand: [five],
      });
      expect(game.asPlayerOne().singSong(five, ernesto)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(five)).toBe("hand");
      expect(game.getLore(PLAYER_ONE)).toBe(0);
    },
  );
  it("cannot use opposing Ernesto", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [five] },
      { play: [ernesto] },
    );
    const enemy = game.findCardInstanceId(ernesto, "play", PLAYER_TWO);
    expect(game.asPlayerOne().singSong(five, enemy)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(enemy)).toBe(false);
  });
  it.each([{ discard: [] }, { discard: [plain] }])(
    "quests base one lore without opposing discarded songs %j",
    ({ discard }: { discard: readonly (typeof plain)[] }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [ernesto] },
        { discard: [...discard] },
      );
      expect(game.asPlayerOne().getCardLore(ernesto)).toBe(1);
      expect(game.asPlayerOne().quest(ernesto)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(1);
    },
  );
  it("several opposing songs grant only one additional lore", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ernesto] },
      { discard: [five, six] },
    );
    expect(game.asPlayerOne().getCardLore(ernesto)).toBe(2);
    expect(game.asPlayerOne().quest(ernesto)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
  it("opposing songs in hand or deck do not count", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ernesto] },
      { hand: [five], deck: [six] },
    );
    expect(game.asPlayerOne().quest(ernesto)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
  });
  it("an opposing song entering discard updates lore immediately without a trigger", () => {
    const free = song(0);
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ernesto], deck: 6 },
      { hand: [free], deck: 6 },
    );
    expect(game.asPlayerOne().getCardLore(ernesto)).toBe(1);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(free)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(ernesto)).toBe(2);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(ernesto)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
  it("removing one of two songs preserves the bonus; removing the last ends it", () => {
    const second = createMockAction({
      id: "idol-second-recover",
      name: "Second Recover",
      cost: 0,
      abilities: recover.abilities,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ernesto], deck: 6 },
      { discard: [five, six], hand: [recover, second], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(recover, { targets: [five] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(ernesto)).toBe(2);
    expect(game.asPlayerTwo().playCard(second, { targets: [six] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardLore(ernesto)).toBe(1);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(ernesto)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(1);
  });
  it("each own copy gets its bonus without boosting an opposing copy", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ernesto, ernesto] },
      { play: [ernesto], discard: [five] },
    );
    for (const id of game.getCardInstanceIdsInZone("play", PLAYER_ONE))
      expect(game.asPlayerOne().quest(id)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(4);
    expect(
      game.asPlayerTwo().getCardLore(game.findCardInstanceId(ernesto, "play", PLAYER_TWO)),
    ).toBe(1);
  });
  it("player-two copies count opposing songs once and keep the bonus across turns", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [ernesto], discard: [five, six], deck: 6, lore: 4 },
      { play: [ernesto, ernesto], discard: [plain], deck: 6, lore: 7 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const copies = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
    const enemy = game.findCardInstanceId(ernesto, "play", PLAYER_ONE);
    expect(game.asPlayerOne().getCardLore(enemy)).toBe(1);
    for (const id of copies) {
      expect(game.asPlayerTwo().getCardLore(id)).toBe(2);
      expect(game.asPlayerTwo().quest(id)).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().quest(id)).not.toBeSuccessfulCommand();
    }
    expect(game.getLore(PLAYER_TWO)).toBe(11);
    expect(game.getLore(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardLore(copies[0]!)).toBe(2);
    expect(game.asPlayerTwo().quest(copies[0]!)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(13);
    expect(game.getLore(PLAYER_ONE)).toBe(4);
  });
  it("printed cost three creates a drying Singer and cannot be inked", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ernesto, five],
      inkwell: 3,
    });
    expect(game.asPlayerOne().putIntoInkwell(PLAYER_ONE, ernesto)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(ernesto)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().singSong(five, ernesto)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(ernesto)).not.toBeSuccessfulCommand();
  });
});
