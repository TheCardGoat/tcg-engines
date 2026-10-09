import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { clawhauserSafetyOfficer } from "./015-clawhauser-safety-officer";

const otherCharacter = createMockCharacter({
  id: "clawhauser-other",
  name: "Other Character",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Clawhauser - Safety Officer", () => {
  it("cannot be played as the first character of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [clawhauserSafetyOfficer],
      inkwell: clawhauserSafetyOfficer.cost,
      deck: 6,
    });

    const result = testEngine.asPlayerOne().playCard(clawhauserSafetyOfficer);
    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(testEngine.asPlayerOne().getCardZone(clawhauserSafetyOfficer)).toBe("hand");
  });

  it("does not count characters that started in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [clawhauserSafetyOfficer],
      inkwell: clawhauserSafetyOfficer.cost,
      play: [otherCharacter],
      deck: 6,
    });

    // Fixture characters were not *played* this turn — the restriction holds.
    const result = testEngine.asPlayerOne().playCard(clawhauserSafetyOfficer);
    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(testEngine.asPlayerOne().getCardZone(clawhauserSafetyOfficer)).toBe("hand");
  });

  it("can be played after playing another character this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [otherCharacter, clawhauserSafetyOfficer],
      inkwell: otherCharacter.cost + clawhauserSafetyOfficer.cost,
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(otherCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(clawhauserSafetyOfficer)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(clawhauserSafetyOfficer)).toBe("play");
  });

  it("remains illegal on a later turn when no character is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [clawhauserSafetyOfficer],
        inkwell: clawhauserSafetyOfficer.cost,
        deck: 6,
      },
      { deck: 6 },
    );

    // Turn 1: no other character played — illegal.
    expect(testEngine.asPlayerOne().playCard(clawhauserSafetyOfficer).success).toBe(false);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasGameEnded()).toBe(false);

    // Turn 2: still no other character played this turn — illegal again.
    expect(testEngine.asPlayerOne().playCard(clawhauserSafetyOfficer).success).toBe(false);
  });

  it("does not count a played action as another character", () => {
    const action = createMockAction({ id: "clawhauser-action", name: "Action", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [action, clawhauserSafetyOfficer],
      inkwell: 1 + clawhauserSafetyOfficer.cost,
      deck: 6,
    });
    expect(engine.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(clawhauserSafetyOfficer)).not.toBeSuccessfulCommand();
  });

  it("does not carry a character play from the previous turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [otherCharacter, clawhauserSafetyOfficer],
        inkwell: 1 + clawhauserSafetyOfficer.cost,
        deck: 6,
      },
      { deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(otherCharacter)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(clawhauserSafetyOfficer)).not.toBeSuccessfulCommand();
  });

  it.each([false, true])("Bodyguard entry can be exerted: %s", (enterPlayExerted: boolean) => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [otherCharacter, clawhauserSafetyOfficer],
      inkwell: 1 + clawhauserSafetyOfficer.cost,
      deck: 6,
    });
    expect(engine.asPlayerOne().playCard(otherCharacter)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().playCard(clawhauserSafetyOfficer, { enterPlayExerted }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(clawhauserSafetyOfficer)).toBe(enterPlayExerted);
  });
  it("allows Player Two only after their own character play", () => {
    const playerTwoCharacter = { ...otherCharacter, id: "clawhauser-player-two-character" };
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [otherCharacter], inkwell: 1, deck: 6 },
      { hand: [playerTwoCharacter, clawhauserSafetyOfficer], inkwell: 4, deck: 6 },
    );
    expect(game.asPlayerOne().playCard(otherCharacter)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(clawhauserSafetyOfficer).success).toBe(false);
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(4);
    expect(game.asPlayerTwo().getCardZone(clawhauserSafetyOfficer)).toBe("hand");
    expect(game.asPlayerTwo().playCard(playerTwoCharacter)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(clawhauserSafetyOfficer, { enterPlayExerted: true }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().isExerted(clawhauserSafetyOfficer)).toBe(true);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
  it.each([false, true])(
    "only an exerted Bodyguard protects an ally (%s)",
    (enterPlayExerted: boolean) => {
      const attacker = createMockCharacter({
        id: "clawhauser-attacker",
        name: "Attacker",
        cost: 1,
        strength: 5,
        willpower: 6,
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [otherCharacter, clawhauserSafetyOfficer], inkwell: 4, deck: 6 },
        { play: [{ card: attacker, isDrying: false }], deck: 6 },
      );
      expect(game.asPlayerOne().playCard(otherCharacter)).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().playCard(clawhauserSafetyOfficer, { enterPlayExerted }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerOne().quest(otherCharacter)).toBeSuccessfulCommand();
      if (enterPlayExerted) {
        // Quest now that the Bodyguard is dry, so both defenders are exerted.
        expect(game.asPlayerOne().quest(clawhauserSafetyOfficer)).toBeSuccessfulCommand();
      }
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      if (enterPlayExerted) {
        expect(game.asPlayerTwo().challenge(attacker, otherCharacter).success).toBe(false);
        expect(game.asPlayerTwo().isExerted(attacker)).toBe(false);
        expect(game.asPlayerOne().getDamage(otherCharacter)).toBe(0);
        expect(
          game.asPlayerTwo().challenge(attacker, clawhauserSafetyOfficer),
        ).toBeSuccessfulCommand();
        expect(game.asPlayerOne().getCardZone(clawhauserSafetyOfficer)).toBe("discard");
        expect(game.asPlayerTwo().getDamage(attacker)).toBe(3);
      } else {
        expect(game.asPlayerTwo().challenge(attacker, otherCharacter)).toBeSuccessfulCommand();
        expect(game.asPlayerOne().getCardZone(otherCharacter)).toBe("discard");
        expect(game.asPlayerOne().getDamage(clawhauserSafetyOfficer)).toBe(0);
        expect(game.asPlayerTwo().getDamage(attacker)).toBe(1);
      }
    },
  );
  // CR 8.3.2–8.3.3: exerted entry and challenge protection are independent.
  it("Player Two's fresh exerted copy protects immediately and ready copies do not", () => {
    const attacker = createMockCharacter({
      id: "clawhauser-p2-attacker",
      name: "Attacker",
      cost: 1,
      strength: 5,
      willpower: 6,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [attacker, attacker], deck: 6 },
      {
        hand: [
          otherCharacter,
          clawhauserSafetyOfficer,
          clawhauserSafetyOfficer,
          clawhauserSafetyOfficer,
        ],
        play: [{ card: otherCharacter, exerted: true }],
        inkwell: 7,
        deck: 6,
      },
    );
    const claws = game
      .getCardInstanceIdsInZone("hand", PLAYER_TWO)
      .filter(
        (id) => game.asServer().getCardDefinitionByInstanceId(id).id === clawhauserSafetyOfficer.id,
      );
    const ally = game.getCardInstanceIdsInZone("play", PLAYER_TWO)[0]!;
    const qualifyingCharacter = game
      .getCardInstanceIdsInZone("hand", PLAYER_TWO)
      .find((id) => game.asServer().getCardDefinitionByInstanceId(id).id === otherCharacter.id)!;
    const attackers = game.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(claws[0]!)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(qualifyingCharacter)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(ally)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(claws[0]!, { enterPlayExerted: false }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(claws[1]!, { enterPlayExerted: true }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().isExerted(claws[0]!)).toBe(false);
    expect(game.asPlayerTwo().isExerted(claws[1]!)).toBe(true);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().challenge(attackers[0]!, ally)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(attackers[0]!)).toBe(false);
    expect(game.asPlayerTwo().getDamage(ally)).toBe(0);
    expect(game.asPlayerOne().challenge(attackers[0]!, claws[1]!)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(claws[1]!)).toBe("discard");
    expect(game.asPlayerOne().getDamage(attackers[0]!)).toBe(3);
    expect(game.asPlayerOne().challenge(attackers[1]!, ally)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(ally)).toBe("discard");
    expect(game.asPlayerTwo().getDamage(claws[0]!)).toBe(0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(claws[2]!)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(claws[2]!)).toBe("hand");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(7);
  });
});
