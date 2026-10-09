// CR 2.2.0: 6.4.1/6.4.2.3 continuous static abilities; 8.11.1 Singer.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  createMockSong,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { singer } from "../../../helpers/abilities/singer";
import { pjPeteDevotedFan } from "./012-pj-pete-devoted-fan";

const otherSinger = createMockCharacter({
  id: "pj-other-singer",
  name: "Other Singer",
  cost: 2,
  abilities: [singer(2)],
});

const nonSinger = createMockCharacter({
  id: "pj-non-singer",
  name: "Non Singer",
  cost: 2,
});

function loreOf(
  testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
): number {
  const id = testEngine.findCardInstanceId(pjPeteDevotedFan, "play");
  return testEngine.asServer().getCard(id).lore ?? 0;
}

describe("P.J. Pete - Devoted Fan", () => {
  it("gets +1 {L} while you have a character with Singer in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pjPeteDevotedFan, otherSinger],
      deck: 6,
    });

    expect(loreOf(testEngine)).toBe((pjPeteDevotedFan.lore ?? 0) + 1);
  });

  it("does not get +1 {L} with only non-Singer characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pjPeteDevotedFan, nonSinger],
      deck: 6,
    });

    expect(loreOf(testEngine)).toBe(pjPeteDevotedFan.lore);
  });

  it("does not get +1 {L} while alone", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pjPeteDevotedFan],
      deck: 6,
    });

    expect(loreOf(testEngine)).toBe(pjPeteDevotedFan.lore);
  });

  it.each([0, 1, 2])("quests for only one extra lore with %i friendly Singers", (count: number) => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pjPeteDevotedFan, ...Array.from({ length: count }, () => otherSinger)],
      deck: 3,
    });
    expect(engine.asPlayerOne().quest(pjPeteDevotedFan)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe((pjPeteDevotedFan.lore ?? 0) + (count > 0 ? 1 : 0));
  });

  it("does not count an opposing Singer", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [pjPeteDevotedFan], deck: 3 },
      { play: [otherSinger], deck: 3 },
    );
    expect(engine.asPlayerOne().quest(pjPeteDevotedFan)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(pjPeteDevotedFan.lore);
  });

  it("loses the bonus after the last friendly Singer is banished", () => {
    const attacker = createMockCharacter({
      id: "pj-attacker",
      name: "Attacker",
      cost: 1,
      strength: 5,
      willpower: 5,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [pjPeteDevotedFan, { card: otherSinger, exerted: true }], deck: 3 },
      { play: [attacker], deck: 3 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().challenge(attacker, otherSinger)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(otherSinger)).toBe("discard");
    expect(loreOf(engine)).toBe(pjPeteDevotedFan.lore);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().quest(pjPeteDevotedFan)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(pjPeteDevotedFan.lore);
  });

  it("uses only Player Two's friendly Singer for the quest bonus", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [otherSinger], deck: 6 },
      { play: [pjPeteDevotedFan, otherSinger], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(pjPeteDevotedFan)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe((pjPeteDevotedFan.lore ?? 0) + 1);
    expect(game.getLore(PLAYER_ONE)).toBe(0);
  });
});

it("Player Two exact copies keep one bonus until the last own Singer leaves, then quest for base lore", () => {
  const bounce = createMockAction({
    id: "pj-return",
    name: "Return Singer",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
  });
  const song = createMockSong({
    id: "pj-song",
    name: "Singer Song",
    cost: 2,
    text: "A song without additional effects.",
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [otherSinger, pjPeteDevotedFan], deck: 6 },
    {
      play: [pjPeteDevotedFan, pjPeteDevotedFan, otherSinger, otherSinger],
      hand: [bounce, bounce, song],
      deck: 6,
    },
  );
  const copies = game
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === pjPeteDevotedFan.id);
  const singers = game
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === otherSinger.id);
  const bounces = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === bounce.id);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().singSong(song, singers[0])).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(singers[0])).toBe(true);
  for (const copy of copies) expect(game.asServer().getCard(copy).lore).toBe(3);
  expect(game.asPlayerTwo().quest(copies[0])).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(3);
  expect(
    game.asPlayerTwo().playCard(bounces[0], { targets: [singers[0]] }),
  ).toBeSuccessfulCommand();
  for (const copy of copies) expect(game.asServer().getCard(copy).lore).toBe(3);
  expect(game.asPlayerTwo().quest(copies[1])).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(6);
  expect(
    game.asPlayerTwo().playCard(bounces[1], { targets: [singers[1]] }),
  ).toBeSuccessfulCommand();
  for (const copy of copies) expect(game.asServer().getCard(copy).lore).toBe(2);
  expect(game.getLore(PLAYER_TWO)).toBe(6);
  expect(game.asPlayerTwo().ink(singers[0])).toBeSuccessfulCommand();
  for (const copy of copies) expect(game.asServer().getCard(copy).lore).toBe(2);
  expect(
    game.asServer().getCard(game.findCardInstanceId(pjPeteDevotedFan, "play", PLAYER_ONE)).lore,
  ).toBe(3);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  for (const copy of copies) expect(game.asPlayerTwo().quest(copy)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(10);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
});

it("does not count own Singer cards outside play", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [pjPeteDevotedFan],
      hand: [otherSinger],
      discard: [otherSinger],
      inkwell: [otherSinger],
      deck: [otherSinger, otherSinger],
    },
    { deck: 6 },
  );
  expect(game.asPlayerOne().quest(pjPeteDevotedFan)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(loreOf(game)).toBe(2);
});

it("counts Singer granted to itself and loses the bonus when that keyword expires", () => {
  const grant = createMockAction({
    id: "pj-grant-singer",
    name: "Grant Singer",
    cost: 0,
    abilities: [
      {
        type: "action",
        effect: {
          type: "gain-keyword",
          keyword: "Singer",
          value: 2,
          target: "CHOSEN_CHARACTER",
          duration: "until-end-of-turn",
        },
      },
    ],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [pjPeteDevotedFan], hand: [grant], deck: 6 },
    { deck: 6 },
  );
  expect(
    game.asPlayerOne().playCard(grant, { targets: [pjPeteDevotedFan] }),
  ).toBeSuccessfulCommand();
  expect(loreOf(game)).toBe(3);
  expect(game.asPlayerOne().quest(pjPeteDevotedFan)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(loreOf(game)).toBe(2);
  expect(game.getLore(PLAYER_ONE)).toBe(3);
});
