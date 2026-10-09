import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "../../001/characters/069-aladdin-prince-ali";
import { improvise } from "../../002/actions/099-improvise";
import { distract } from "../../003/actions/159-distract";
import { shereKhanRuthlessEntrepreneur } from "./083-shere-khan-ruthless-entrepreneur";

const smallOpponent = createMockCharacter({
  id: "shere-khan-ruthless-small",
  name: "Small Henchman",
  cost: 2,
  strength: 3,
  willpower: 4,
});

const bigOpponent = createMockCharacter({
  id: "shere-khan-ruthless-big",
  name: "Big Brute",
  cost: 5,
  strength: 5,
  willpower: 6,
});

describe("Shere Khan - Ruthless Entrepreneur", () => {
  it("Quietly Released puts a chosen opposing character with 3 {S} or less on the bottom of their player's deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shereKhanRuthlessEntrepreneur],
        inkwell: shereKhanRuthlessEntrepreneur.cost,
        deck: [],
      },
      {
        play: [{ card: smallOpponent, isDrying: false }],
        deck: [],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(shereKhanRuthlessEntrepreneur),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(shereKhanRuthlessEntrepreneur, {
        targets: [smallOpponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(smallOpponent)).toBe("deck");
    const opponentDeck = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(opponentDeck).toHaveLength(1);
    expect(testEngine.getCardDefinitionId(opponentDeck[0]!)).toBe(smallOpponent.id);
  });

  it("Quietly Released cannot choose an opposing character with more than 3 {S}", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shereKhanRuthlessEntrepreneur],
        inkwell: shereKhanRuthlessEntrepreneur.cost,
        deck: [],
      },
      {
        play: [{ card: bigOpponent, isDrying: false }],
        deck: [],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(shereKhanRuthlessEntrepreneur),
    ).toBeSuccessfulCommand();

    const result = testEngine.asPlayerOne().resolvePendingByCard(shereKhanRuthlessEntrepreneur, {
      targets: [bigOpponent],
    });

    expect(result).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(bigOpponent)).toBe("play");
  });
});

it("puts the target below an existing deck without changing the controller deck", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanRuthlessEntrepreneur], inkwell: 7, deck: 6 },
    { play: [smallOpponent], deck: 6 },
  );
  const before = game.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  const ownDeck = game.getCardInstanceIdsInZone("deck", "player_one");
  const target = game.findCardInstanceId(smallOpponent, "play", PLAYER_TWO);
  expect(game.asPlayerOne().playCard(shereKhanRuthlessEntrepreneur)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(shereKhanRuthlessEntrepreneur, { targets: [target] }),
  ).toBeSuccessfulCommand();
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual([target, ...before]);
  expect(game.getCardInstanceIdsInZone("deck", "player_one")).toEqual(ownDeck);
  expect(game.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toEqual([]);
});
it("rejects own characters, Ward and two legal targets without moving anything", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanRuthlessEntrepreneur], inkwell: 7, play: [smallOpponent], deck: 6 },
    {
      play: [
        smallOpponent,
        aladdinPrinceAli,
        createMockCharacter({ id: "second-small", name: "Second Small", cost: 1, strength: 2 }),
      ],
      deck: 6,
    },
  );
  const own = game.findCardInstanceId(smallOpponent, "play", "player_one");
  const targets = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  expect(game.asPlayerOne().playCard(shereKhanRuthlessEntrepreneur)).toBeSuccessfulCommand();
  for (const selected of [[own], [targets[1]!], [targets[0]!, targets[2]!]]) {
    expect(
      game.asPlayerOne().resolvePendingByCard(shereKhanRuthlessEntrepreneur, { targets: selected }),
    ).not.toBeSuccessfulCommand();
  }
  expect(game.getCardInstanceIdsInZone("play", PLAYER_TWO)).toEqual(targets);
  expect(game.asPlayerOne().getCardZone(own)).toBe("play");
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(shereKhanRuthlessEntrepreneur, { targets: [targets[0]!] }),
  ).toBeSuccessfulCommand();
});
it("uses current strength after a reduction from five to three", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanRuthlessEntrepreneur, distract], inkwell: 9, deck: 6 },
    { play: [bigOpponent], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(distract, { targets: [bigOpponent] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(shereKhanRuthlessEntrepreneur)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(shereKhanRuthlessEntrepreneur, { targets: [bigOpponent] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(bigOpponent)).toBe("deck");
});
it("rejects a printed three-strength target increased to four", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanRuthlessEntrepreneur, improvise], inkwell: 8, deck: 6 },
    {
      play: [
        smallOpponent,
        createMockCharacter({ id: "legal-low", name: "Low Strength", cost: 1, strength: 1 }),
      ],
      deck: 6,
    },
  );
  expect(
    game.asPlayerOne().playCard(improvise, { targets: [smallOpponent] }),
  ).toBeSuccessfulCommand();
  expect(game.asServer().getCard(smallOpponent).strength).toBe(4);
  expect(game.asPlayerOne().playCard(shereKhanRuthlessEntrepreneur)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(shereKhanRuthlessEntrepreneur, { targets: [smallOpponent] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(smallOpponent)).toBe("play");
});
it("finishes automatically with no legal opponent target", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [shereKhanRuthlessEntrepreneur], inkwell: 7, deck: 6 },
    { play: [bigOpponent, aladdinPrinceAli], deck: 6 },
  );
  const opposingDeck = game.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  expect(game.asPlayerOne().playCard(shereKhanRuthlessEntrepreneur)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(opposingDeck);
  expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(bigOpponent)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(aladdinPrinceAli)).toBe("play");
});
it("questing gains one lore without putting another character on the bottom", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: shereKhanRuthlessEntrepreneur, isDrying: false }], deck: 6 },
    { play: [smallOpponent], deck: 6 },
  );
  expect(game.asPlayerOne().quest(shereKhanRuthlessEntrepreneur)).toBeSuccessfulCommand();
  expect(game.getLore("player_one")).toBe(1);
  expect(game.asPlayerTwo().getCardZone(smallOpponent)).toBe("play");
  expect(game.asPlayerOne().quest(shereKhanRuthlessEntrepreneur)).not.toBeSuccessfulCommand();
});

it("player two puts the opposing character below player one's existing deck", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [smallOpponent, bigOpponent, aladdinPrinceAli], deck: 6 },
    { hand: [shereKhanRuthlessEntrepreneur], inkwell: 7, play: [smallOpponent], deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const target = game.findCardInstanceId(smallOpponent, "play", "player_one")!;
  const own = game.findCardInstanceId(smallOpponent, "play", PLAYER_TWO)!;
  const opposingDeck = game.getCardInstanceIdsInZone("deck", "player_one");
  const controllerDeck = game.getCardInstanceIdsInZone("deck", PLAYER_TWO);
  expect(game.asPlayerTwo().playCard(shereKhanRuthlessEntrepreneur)).toBeSuccessfulCommand();
  for (const invalid of [own, bigOpponent, aladdinPrinceAli]) {
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(shereKhanRuthlessEntrepreneur, { targets: [invalid] }),
    ).not.toBeSuccessfulCommand();
  }
  expect(
    game.asPlayerTwo().resolvePendingByCard(shereKhanRuthlessEntrepreneur, { targets: [target] }),
  ).toBeSuccessfulCommand();
  expect(game.getCardInstanceIdsInZone("deck", "player_one")).toEqual([target, ...opposingDeck]);
  expect(game.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(controllerDeck);
  expect(game.getCardInstanceIdsInZone("discard", "player_one")).toEqual([]);
  expect(game.asPlayerTwo().getCardZone(own)).toBe("play");
});
