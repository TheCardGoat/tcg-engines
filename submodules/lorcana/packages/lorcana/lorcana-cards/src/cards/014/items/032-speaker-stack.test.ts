// Rules grounding: Speaker Stack (set14-032).
// PUMP IT UP — Your characters with Singer get +1 {S} and +1 {W}.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { ancestralGuitar } from "./031-ancestral-guitar";
import { speakerStack } from "./032-speaker-stack";

const singerCharacter = createMockCharacter({
  id: "speaker-stack-singer",
  name: "Singer Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  abilities: [
    {
      id: "speaker-stack-singer-ability",
      type: "keyword",
      keyword: "Singer",
      value: 3,
      text: "Singer 3",
    },
  ],
});

const plainCharacter = createMockCharacter({
  id: "speaker-stack-plain",
  name: "Plain Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

describe("Speaker Stack", () => {
  it("gives your characters with Singer +1 strength and +1 willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [speakerStack, singerCharacter, plainCharacter],
    });

    expect(testEngine.asPlayerOne().getCard(singerCharacter).strength).toBe(3);
    expect(testEngine.asPlayerOne().getCard(singerCharacter).willpower).toBe(4);
  });

  it("does not boost your characters without Singer", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [speakerStack, plainCharacter],
    });

    expect(testEngine.asPlayerOne().getCard(plainCharacter).strength).toBe(2);
    expect(testEngine.asPlayerOne().getCard(plainCharacter).willpower).toBe(2);
  });

  it("does not boost the opponent's Singer characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [speakerStack],
      },
      {
        play: [singerCharacter],
      },
    );

    expect(testEngine.asPlayerTwo().getCard(singerCharacter).strength).toBe(2);
    expect(testEngine.asPlayerTwo().getCard(singerCharacter).willpower).toBe(3);
  });
});

describe("Speaker Stack continuous effects", () => {
  it("applies immediately when player two pays to play it and only boosts that player's Singers", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [singerCharacter], deck: 6 },
      { hand: [speakerStack], play: [singerCharacter, plainCharacter], inkwell: 2, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(speakerStack)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    const singerId = engine.findCardInstanceId(singerCharacter, "play", PLAYER_TWO);
    expect(engine.asPlayerTwo().getCard(singerId).strength).toBe(3);
    expect(engine.asPlayerTwo().getCard(singerId).willpower).toBe(4);
    expect(engine.asPlayerOne().getCard(singerCharacter).strength).toBe(2);
    expect(engine.asPlayerOne().getCard(singerCharacter).willpower).toBe(3);
    expect(engine.asPlayerTwo().getCard(plainCharacter).strength).toBe(2);
    expect(engine.asPlayerTwo().getCard(plainCharacter).willpower).toBe(2);
    expect(engine.asPlayerTwo().getBagCount()).toBe(0);
    expect(engine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("banishes a damaged Singer when removing the Stack reduces willpower to its damage", () => {
    const banish = createMockAction({
      id: "speaker-stack-lethal-removal",
      name: "Remove Speaker",
      cost: 1,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_ITEM" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [speakerStack, { card: singerCharacter, damage: 3 }],
      hand: [banish],
      inkwell: 1,
      deck: 6,
    });
    expect(engine.asPlayerOne().getCard(singerCharacter).willpower).toBe(4);
    expect(engine.asPlayerOne().getCardZone(singerCharacter)).toBe("play");
    expect(
      engine.asPlayerOne().playCard(banish, { targets: [speakerStack] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(speakerStack)).toBe("discard");
    expect(engine.asPlayerOne().getCardZone(singerCharacter)).toBe("discard");
  });

  it("applies to newly gained Singer and removes the bonus when Singer expires", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [speakerStack, ancestralGuitar, plainCharacter], inkwell: 1, deck: 5 },
      { deck: 5 },
    );
    expect(
      engine.asPlayerOne().activateAbility(ancestralGuitar, {
        ability: "From the Heart",
        targets: [plainCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(plainCharacter).strength).toBe(3);
    expect(engine.asPlayerOne().getCard(plainCharacter).willpower).toBe(3);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(plainCharacter).strength).toBe(2);
    expect(engine.asPlayerOne().getCard(plainCharacter).willpower).toBe(2);
  });

  it("stacks each copy and removes its bonuses when the item is banished", () => {
    const secondStack = { ...speakerStack, id: "second-speaker-stack" };
    const banish = createMockAction({
      id: "speaker-stack-banish",
      name: "Remove Item",
      cost: 1,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_ITEM" } }],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [speakerStack, secondStack, singerCharacter],
      hand: [banish],
      inkwell: 1,
    });
    expect(engine.asPlayerOne().getCard(singerCharacter).strength).toBe(4);
    expect(engine.asPlayerOne().getCard(singerCharacter).willpower).toBe(5);
    expect(
      engine.asPlayerOne().playCard(banish, { targets: [speakerStack] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCard(singerCharacter).strength).toBe(3);
    expect(engine.asPlayerOne().getCard(singerCharacter).willpower).toBe(4);
  });
});

it("banishes Player Two's damaged character when temporary Singer and the Stack bonus expire", () => {
  const damage = createMockAction({
    id: "speaker-stack-expiry-damage",
    name: "Two Damage",
    cost: 0,
    abilities: [
      { type: "action", effect: { type: "deal-damage", amount: 2, target: "CHOSEN_CHARACTER" } },
    ],
  });
  const engine = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { play: [speakerStack, ancestralGuitar, plainCharacter], hand: [damage], inkwell: 1, deck: 6 },
  );
  expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    engine.asPlayerTwo().activateAbility(ancestralGuitar, {
      ability: "From the Heart",
      targets: [plainCharacter],
    }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCard(plainCharacter).willpower).toBe(3);
  expect(
    engine.asPlayerTwo().playCard(damage, { targets: [plainCharacter] }),
  ).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCardZone(plainCharacter)).toBe("play");
  expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(engine.asPlayerTwo().getCardZone(plainCharacter)).toBe("discard");
  expect(engine.asPlayerTwo().getCardZone(speakerStack)).toBe("play");
  expect(
    engine
      .asServer()
      .getMoveLogHistory()
      .flatMap((log) => log.public),
  ).toContainEqual({
    key: "lorcana.outcome.cardBanished",
    values: {
      playerId: PLAYER_TWO,
      cardId: engine.findCardInstanceId(plainCharacter, "discard", PLAYER_TWO),
    },
  });
});
