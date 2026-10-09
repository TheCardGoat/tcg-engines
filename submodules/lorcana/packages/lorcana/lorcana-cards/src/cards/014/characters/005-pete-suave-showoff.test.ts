// CR 2.2.0: 8.3.2-8.3.3 and 3.2.1. Ready Bodyguards cannot be challenged; the keyword remains when readied.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { peteSuaveShowoff } from "./005-pete-suave-showoff";

const attacker = createMockCharacter({
  id: "pete-attacker",
  name: "Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

const otherDefender = createMockCharacter({
  id: "pete-other-defender",
  name: "Other Defender",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Pete - Suave Showoff", () => {
  it.each([true, false])(
    "Bodyguard can enter exerted or ready (%s)",
    (enterPlayExerted: boolean) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [peteSuaveShowoff],
        inkwell: peteSuaveShowoff.cost,
        deck: 6,
      });
      expect(
        game.asPlayerOne().playCard(peteSuaveShowoff, { enterPlayExerted }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().isExerted(peteSuaveShowoff)).toBe(enterPlayExerted);
      expect(game.asPlayerOne().getCardZone(peteSuaveShowoff)).toBe("play");
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().getBagCount()).toBe(0);
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    },
  );

  it("a ready Bodyguard does not stop a challenge against an exerted ally", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: attacker, isDrying: false }],
      },
      { play: [peteSuaveShowoff, { card: otherDefender, exerted: true }] },
    );
    expect(game.asPlayerOne().challenge(attacker, otherDefender)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(otherDefender)).toBe("discard");
    expect(game.asPlayerTwo().getDamage(peteSuaveShowoff)).toBe(0);
    expect(game.asPlayerOne().getDamage(attacker)).toBe(1);
  });
  it("has Bodyguard and forces opponents to challenge him first", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: peteSuaveShowoff, exerted: true },
          { card: otherDefender, exerted: true },
        ],
        deck: 6,
      },
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 6,
      },
    );

    expect(testEngine.hasKeyword(peteSuaveShowoff, "Bodyguard")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // With an exerted Bodyguard on the board, the non-Bodyguard defender is illegal.
    expect(testEngine.asPlayerTwo().challenge(attacker, otherDefender)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(otherDefender)).toBe("play");
    expect(testEngine.asPlayerTwo().isExerted(attacker)).toBe(false);
    expect(testEngine.asPlayerOne().getDamage(peteSuaveShowoff)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(otherDefender)).toBe(0);
    expect(testEngine.asPlayerTwo().challenge(attacker, peteSuaveShowoff)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(peteSuaveShowoff)).toBe(5);
    expect(testEngine.asPlayerTwo().getDamage(attacker)).toBe(1);
  });

  it("can be challenged while exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: peteSuaveShowoff, exerted: true }],
        deck: 6,
      },
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().challenge(attacker, peteSuaveShowoff)).toBeSuccessfulCommand();
  });

  it("releases the protected ally when the exerted Bodyguard is banished", () => {
    const secondAttacker = { ...attacker, id: "pete-second-attacker" };
    const thirdAttacker = { ...attacker, id: "pete-third-attacker" };
    const readyPete = { ...peteSuaveShowoff, id: "pete-ready-copy" };
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker, secondAttacker, thirdAttacker].map((card) => ({ card, isDrying: false })),
        deck: 6,
      },
      {
        play: [
          { card: peteSuaveShowoff, exerted: true },
          readyPete,
          { card: otherDefender, exerted: true },
        ],
        deck: 6,
      },
    );
    expect(game.asPlayerOne().challenge(attacker, peteSuaveShowoff)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(peteSuaveShowoff)).toBe(5);
    expect(game.asPlayerOne().challenge(secondAttacker, otherDefender).success).toBe(false);
    expect(game.asPlayerOne().isExerted(secondAttacker)).toBe(false);
    expect(game.asPlayerOne().challenge(secondAttacker, peteSuaveShowoff)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(peteSuaveShowoff)).toBe("discard");
    expect(game.asPlayerOne().challenge(thirdAttacker, otherDefender)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(otherDefender)).toBe("discard");
    expect(game.asPlayerTwo().getCardZone(readyPete)).toBe("play");
    expect(game.asPlayerTwo().isExerted(readyPete)).toBe(false);
    expect(game.asPlayerTwo().getDamage(readyPete)).toBe(0);
  });
});

it("two exact Player Two Bodyguards protect the ally until both are banished", () => {
  const strong = createMockCharacter({
    id: "pete-six-attacker",
    name: "Strong Attacker",
    cost: 3,
    strength: 6,
    willpower: 5,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [strong, strong, strong], deck: 6 },
    {
      play: [
        { card: peteSuaveShowoff, exerted: true },
        { card: peteSuaveShowoff, exerted: true },
        { card: otherDefender, exerted: true },
      ],
      deck: 6,
    },
  );
  const attackers = game.getCardInstanceIdsInZone("play", PLAYER_ONE);
  const guards = game
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === peteSuaveShowoff.id);
  expect(game.asPlayerOne().challenge(attackers[0], otherDefender)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(attackers[0])).toBe(false);
  expect(game.asPlayerTwo().getDamage(otherDefender)).toBe(0);
  expect(game.asPlayerOne().challenge(attackers[0], guards[0])).toBeSuccessfulCommand();
  expect(game.asServer().getCard(guards[0]).zone).toBe("discard");
  expect(game.asServer().getCard(guards[1]).zone).toBe("play");
  expect(game.asPlayerOne().challenge(attackers[1], otherDefender)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(attackers[1])).toBe(false);
  expect(game.asPlayerTwo().getDamage(guards[1])).toBe(0);
  expect(game.asPlayerOne().challenge(attackers[1], guards[1])).toBeSuccessfulCommand();
  expect(game.asServer().getCard(guards[1]).zone).toBe("discard");
  expect(game.asPlayerOne().challenge(attackers[2], otherDefender)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(otherDefender)).toBe("discard");
});

it("natural readying removes the challenge limiter and exerting Pete restores it", () => {
  const strong = createMockCharacter({
    id: "pete-ready-cycle-attacker",
    name: "Cycle Attacker",
    cost: 3,
    strength: 6,
    willpower: 5,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [strong], deck: 6 },
    {
      play: [
        { card: peteSuaveShowoff, exerted: true },
        { card: otherDefender, exerted: true },
        otherDefender,
      ],
      deck: 6,
    },
  );
  const allies = game
    .getCardInstanceIdsInZone("play", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === otherDefender.id);
  expect(game.asPlayerOne().challenge(strong, allies[0])).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(peteSuaveShowoff)).toBe(false);
  expect(game.asPlayerTwo().quest(allies[0])).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(strong, allies[0])).toBeSuccessfulCommand();
  expect(game.asServer().getCard(allies[0]).zone).toBe("discard");
  expect(game.asPlayerTwo().getDamage(peteSuaveShowoff)).toBe(0);
  expect(game.asPlayerTwo().hasKeyword(peteSuaveShowoff, "Bodyguard")).toBe(true);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(peteSuaveShowoff)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(allies[1])).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(strong, allies[1])).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(strong)).toBe(false);
  expect(game.asPlayerTwo().getDamage(allies[1])).toBe(0);
  expect(game.asPlayerOne().challenge(strong, peteSuaveShowoff)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(peteSuaveShowoff)).toBe("discard");
});
