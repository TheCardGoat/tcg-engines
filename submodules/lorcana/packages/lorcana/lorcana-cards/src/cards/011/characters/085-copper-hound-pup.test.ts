import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { copperHoundPup } from "./085-copper-hound-pup";

const playerOneHandCard = createMockCharacter({
  id: "copper-hound-pup-player-one-hand-card",
  name: "Player One Hand Card",
  cost: 1,
});

const playerTwoHandCardOne = createMockCharacter({
  id: "copper-hound-pup-player-two-hand-card-one",
  name: "Player Two Hand Card One",
  cost: 1,
});

const playerTwoHandCardTwo = createMockCharacter({
  id: "copper-hound-pup-player-two-hand-card-two",
  name: "Player Two Hand Card Two",
  cost: 2,
});

describe("Copper - Hound Pup", () => {
  it("reveals the chosen opponent's hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [copperHoundPup],
        inkwell: copperHoundPup.cost,
      },
      {
        hand: [playerTwoHandCardOne, playerTwoHandCardTwo],
      },
    );

    const playerTwoHandCardOneId = testEngine.findCardInstanceId(
      playerTwoHandCardOne,
      "hand",
      PLAYER_TWO,
    );
    const playerTwoHandCardTwoId = testEngine.findCardInstanceId(
      playerTwoHandCardTwo,
      "hand",
      PLAYER_TWO,
    );

    expect(
      testEngine.asPlayerOne().playCardForPlayer(copperHoundPup, PLAYER_TWO),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(copperHoundPup, {
        targets: [PLAYER_TWO],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(copperHoundPup)).toBe("play");

    const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
    expect(cardMeta[playerTwoHandCardOneId]?.revealed).toBe(true);
    expect(cardMeta[playerTwoHandCardTwoId]?.revealed).toBe(true);
  });

  it("reveals your own hand when you choose yourself", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [copperHoundPup, playerOneHandCard],
        inkwell: copperHoundPup.cost,
      },
      {
        hand: [playerTwoHandCardOne],
      },
    );

    const playerOneHandCardId = testEngine.findCardInstanceId(
      playerOneHandCard,
      "hand",
      PLAYER_ONE,
    );

    expect(
      testEngine.asPlayerOne().playCardForPlayer(copperHoundPup, PLAYER_ONE),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(copperHoundPup, {
        targets: [PLAYER_ONE],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(copperHoundPup)).toBe("play");

    const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
    expect(cardMeta[playerOneHandCardId]?.revealed).toBe(true);
  });
});
