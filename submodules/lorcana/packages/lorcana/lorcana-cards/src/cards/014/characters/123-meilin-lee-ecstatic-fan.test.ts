// CR 2.2.0: 6.1.13.1–2 (during/once), 6.2 (triggers), 7.1.6 (new card after leaving play), 8.11.1–2 (Singer), 8.12.1–2 (Sing Together).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { meilinLeeEcstaticFan as meilin } from "./123-meilin-lee-ecstatic-fan";
const song = (cost: number, id = `ecstatic-song-${cost}`) =>
  createMockSong({
    id,
    name: id,
    cost,
    text: "Gain 2 lore.",
    abilities: [{ type: "action", effect: { type: "gain-lore", amount: 2, target: "CONTROLLER" } }],
  });
const free = song(0),
  one = song(1),
  five = song(5),
  six = song(6);
const second = song(0, "second-free-song");
const plain = createMockAction({ id: "ecstatic-plain", name: "Plain Action", cost: 0 });
const bounce = createMockAction({
  id: "ecstatic-bounce",
  name: "Bounce",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
});
const filler = createMockCharacter({ id: "ecstatic-filler", name: "Filler", cost: 1 });

describe("Meilin Lee - Ecstatic Fan", () => {
  it.each([1, 2, 3, 4, 5])(
    "Singer 5 sings cost %s at zero ink and gains exactly one drop",
    (cost: number) => {
      const chosen = song(cost);
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [meilin],
        hand: [chosen],
      });
      expect(game.asPlayerOne().singSong(chosen, meilin)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().isExerted(meilin)).toBe(true);
      expect(game.asPlayerOne().getCardZone(chosen)).toBe("discard");
      expect(game.getLore(PLAYER_ONE)).toBe(2);
      expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
      expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    },
  );
  it("cost six cannot be sung despite six bank ink; five keeps all bank ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilin],
      hand: [six, five],
      inkwell: 6,
    });
    expect(game.asPlayerOne().singSong(six, meilin)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(six)).toBe("hand");
    expect(game.asPlayerOne().isExerted(meilin)).toBe(false);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().singSong(five, meilin)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(6);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it.each([{ isDrying: true }, { exerted: true }])(
    "unavailable singer %j still triggers from a paid song",
    (state: { isDrying?: boolean; exerted?: boolean }) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: meilin, ...state }],
        hand: [five, one],
        inkwell: 1,
      });
      expect(game.asPlayerOne().singSong(five, meilin)).not.toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().playCard(one)).toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
      expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    },
  );
  it("cannot sing with an opposing Meilin", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [five] },
      { play: [meilin] },
    );
    expect(
      game.asPlayerOne().singSong(five, game.findCardInstanceId(meilin, "play", PLAYER_TWO)),
    ).not.toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  });
  it("several own songs resolve but only the first grants one drop", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilin],
      hand: [free, second],
    });
    expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().playCard(second)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getLore(PLAYER_ONE)).toBe(4);
  });
  it("a paid song, then a sung song, share the once limit", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilin],
      hand: [one, five],
      inkwell: 1,
    });
    expect(game.asPlayerOne().playCard(one)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().singSong(five, meilin)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getLore(PLAYER_ONE)).toBe(4);
  });
  it("spending the first drop on another song does not replenish it that turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilin],
      hand: [free, one],
    });
    expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(one, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.getLore(PLAYER_ONE)).toBe(4);
  });
  it("a held drop is optional payment and rejected payment does not consume the trigger", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilin],
      hand: [one],
      inkDrops: 1,
    });
    expect(game.asPlayerOne().playCard(one, { cost: "standard" })).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(one)).toBe("hand");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().playCard(one, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getLore(PLAYER_ONE)).toBe(2);
  });
  it("plain actions and characters do not trigger or consume the song allowance", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilin],
      hand: [plain, filler, free],
      inkwell: 1,
    });
    expect(game.asPlayerOne().playCard(plain)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(game.asPlayerOne().playCard(filler)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it("opposing songs do not grant drops or consume the next own turn allowance", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [meilin], hand: [free], deck: 6 },
      { hand: [second], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(second)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it("resets once allowance on each own turn while existing drops persist", () => {
    const third = song(0, "third-free-song");
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [meilin], hand: [free, second, third], deck: 6 },
      { deck: 6 },
    );
    for (const card of [free, second, third]) {
      expect(game.asPlayerOne().playCard(card)).toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_ONE)).toBe([free, second, third].indexOf(card) + 1);
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    }
  });
  it("each copy triggers independently for its controller", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [meilin, meilin], hand: [free, second], deck: 6 },
      { play: [meilin], hand: [one], inkwell: 1, deck: 6 },
    );
    expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
    for (const id of game.getCardInstanceIdsInZone("play", PLAYER_ONE))
      if (
        game
          .asPlayerOne()
          .getBagEffects()
          .some((e) => e.sourceId === id)
      )
        expect(game.asPlayerOne().resolvePendingByCard(id, {})).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerOne().playCard(second)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(one)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  });
  it("a new copy played after the first song has its own unused allowance", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilin],
      hand: [free, meilin, second],
      inkwell: 3,
    });
    const fresh = game.findCardInstanceId(meilin, "hand", PLAYER_ONE);
    expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().playCard(fresh)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(second)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  });
  it("the same card returned to hand and replayed has a fresh allowance", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [meilin],
      hand: [free, bounce, second],
      inkwell: 3,
    });
    expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().playCard(bounce, { targets: [meilin] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(meilin)).toBe("hand");
    expect(game.asPlayerOne().playCard(meilin)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(second)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  });
  it("Meilin outside play does not trigger", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [meilin, free],
      discard: [meilin],
      deck: [meilin],
      inkwell: [meilin],
    });
    expect(game.asPlayerOne().playCard(free)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });
  it("paying three creates a drying character that still observes paid songs", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [meilin, one, five],
      inkwell: 4,
    });
    expect(game.asPlayerOne().playCard(meilin)).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().singSong(five, meilin)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(meilin)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().playCard(one)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  });
  it("player two shares paid and sung allowance and refreshes next turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [meilin], inkDrops: 3, inkwell: 2, deck: 6 },
      { play: [meilin], hand: [one, five, second], inkwell: 1, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(one)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(
      game.asPlayerTwo().singSong(five, game.findCardInstanceId(meilin, "play", PLAYER_TWO)),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(second)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.getLore(PLAYER_TWO)).toBe(6);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  });
  it("two ink cannot play Meilin; she is inkable", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [meilin], inkwell: 2 });
    expect(game.asPlayerOne().playCard(meilin)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(meilin)).toBe("hand");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().putIntoInkwell(PLAYER_ONE, meilin)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(meilin)).toBe("inkwell");
  });
  it("player two counts Singer five for an exact-eight duet and shares the song allowance", () => {
    const duet = createMockSong({
      id: "ecstatic-duet",
      name: "Duet",
      cost: 8,
      text: "Sing Together 8. Gain 2 lore.",
      abilities: [
        { type: "keyword", keyword: "SingTogether", value: 8 },
        { type: "action", effect: { type: "gain-lore", amount: 2, target: "CONTROLLER" } },
      ],
    });
    const three = createMockCharacter({ id: "ecstatic-three", name: "Three", cost: 3 });
    const two = createMockCharacter({ id: "ecstatic-two", name: "Two", cost: 2 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [meilin], inkwell: 2, inkDrops: 3, deck: 6 },
      { play: [meilin, three, two], hand: [duet, free], inkwell: 8, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const ownMeilin = game.findCardInstanceId(meilin, "play", PLAYER_TWO);
    const insufficient = game.asPlayerTwo().playSongTogether(duet, [ownMeilin, two]);
    expect(insufficient).not.toBeSuccessfulCommand();
    if (insufficient.success) throw new Error("Seven singing cost must not pay for eight");
    expect(insufficient.errorCode).toBe("INSUFFICIENT_SING_TOGETHER_TOTAL");
    expect(game.asPlayerTwo().getCardZone(duet)).toBe("hand");
    expect(game.asPlayerTwo().isExerted(ownMeilin)).toBe(false);
    expect(game.asPlayerTwo().isExerted(two)).toBe(false);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(8);
    expect(game.asPlayerTwo().playSongTogether(duet, [ownMeilin, three])).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(duet)).toBe("discard");
    expect(game.asPlayerTwo().isExerted(ownMeilin)).toBe(true);
    expect(game.asPlayerTwo().isExerted(three)).toBe(true);
    expect(game.asPlayerTwo().isExerted(two)).toBe(false);
    expect(game.asServer().getAvailableInk(PLAYER_TWO)).toBe(8);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getLore(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().playCard(free)).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getLore(PLAYER_TWO)).toBe(4);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
    expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  });
});
