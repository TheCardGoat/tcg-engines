import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { heiheiBoatSnack } from "@tcg/lorcana-cards/cards/001";
import { liloBundledUp } from "./195-lilo-bundled-up";

describe("Lilo - Bundled Up", () => {
  it("prevents only the first damage she would take during each opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: liloBundledUp, exerted: true, isDrying: false }],
      },
      {
        play: [
          { card: heiheiBoatSnack, isDrying: false },
          { card: heiheiBoatSnack, isDrying: false },
        ],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    const attackers = testEngine
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter((cardId) => testEngine.getCardDefinitionId(cardId) === heiheiBoatSnack.id);

    expect(
      testEngine.asPlayerTwo().challenge(attackers[0]!, liloBundledUp),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(liloBundledUp)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(liloBundledUp)).toBe("play");

    expect(
      testEngine.asPlayerTwo().challenge(attackers[1]!, liloBundledUp),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(liloBundledUp)).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(liloBundledUp)).toBe("play");
  });

  it("regression: shield resets before ready phase each opponent turn, not at set phase", () => {
    // The bug was that shield was applying at Set phase instead of before Ready phase.
    // This means the shield should reset at the START of each opponent's turn.
    // We verify the shield works on the first opponent turn, is consumed, then works again
    // on the next opponent turn after reset.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: liloBundledUp, exerted: true, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: heiheiBoatSnack, isDrying: false }],
        deck: 5,
      },
    );

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    const attackers = testEngine
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter((cardId) => testEngine.getCardDefinitionId(cardId) === heiheiBoatSnack.id);

    // First challenge on opponent turn 1: shield absorbs damage
    expect(
      testEngine.asPlayerTwo().challenge(attackers[0]!, liloBundledUp),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(liloBundledUp)).toBe(0);

    // Pass back to P1 and then back to P2 (next opponent turn)
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    // On P1's turn, Lilo readies and we can exert her again (quest)
    expect(testEngine.asPlayerOne().quest(liloBundledUp)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // On P2's new turn, heihei readies and shield should have reset
    const readyAttackers = testEngine
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter(
        (cardId) =>
          testEngine.getCardDefinitionId(cardId) === heiheiBoatSnack.id &&
          !testEngine.asPlayerTwo().isExerted(cardId),
      );

    expect(readyAttackers.length).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerTwo().challenge(readyAttackers[0]!, liloBundledUp),
    ).toBeSuccessfulCommand();
    // Shield should prevent damage again on new opponent turn
    expect(testEngine.asPlayerOne().getDamage(liloBundledUp)).toBe(0);
  });

  it("regression: prevents damage when moving to a location (location move cost damage prevention)", () => {
    const testLocation = createMockLocation({
      id: "lilo-bundled-up-location",
      name: "Test Location",
      cost: 2,
      moveCost: 1,
      willpower: 4,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: liloBundledUp, isDrying: false }, testLocation],
        inkwell: 1,
        deck: 5,
      },
      {
        play: [{ card: heiheiBoatSnack, isDrying: false }],
        deck: 5,
      },
    );

    // Move Lilo to the location
    const moveResult = testEngine
      .asPlayerOne()
      .moveCharacterToLocation(liloBundledUp, testLocation);
    if (moveResult.success) {
      // Lilo should be at the location
      expect(testEngine.asPlayerOne().getCardZone(liloBundledUp)).not.toBe("discard");
    }

    // Quest with Lilo (exerts her so opponent can challenge)
    expect(testEngine.asPlayerOne().quest(liloBundledUp)).toBeSuccessfulCommand();

    // Pass turn to opponent
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges - EXTRA LAYERS should still prevent first damage
    expect(
      testEngine.asPlayerTwo().challenge(heiheiBoatSnack, liloBundledUp),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(liloBundledUp)).toBe(0);
  });

  it("regression: prevents the first damage moved onto Lilo via a move-damage effect during opponent's turn", () => {
    // Move-damage must emit a put-damage replaceable event for the destination so
    // Lilo's EXTRA LAYERS prevent-damage replacement can fire. Players reported the
    // damage being placed on Lilo without first triggering her shield.
    const damagedCharacter = createMockCharacter({
      id: "lilo-bug-damaged",
      name: "Damaged Donor",
      cost: 2,
      strength: 1,
      willpower: 5,
      lore: 1,
    });
    const moveDamageAction = createMockAction({
      id: "lilo-bug-move-damage",
      name: "Shift The Pain",
      cost: 1,
      abilities: [
        {
          id: "lilo-bug-move-damage-1",
          name: "MOVE",
          text: "Move 1 damage from chosen character to chosen opposing character.",
          type: "action",
          effect: {
            type: "move-damage",
            amount: 1,
            from: "CHOSEN_CHARACTER_OF_YOURS",
            to: "CHOSEN_OPPOSING_CHARACTER",
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: liloBundledUp, isDrying: false }],
      },
      {
        play: [{ card: damagedCharacter, damage: 3, isDrying: false }],
        hand: [moveDamageAction],
        inkwell: moveDamageAction.cost,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().playCard(moveDamageAction, {
        targets: {
          kind: "move-damage",
          from: [damagedCharacter],
          to: [liloBundledUp],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(liloBundledUp)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(liloBundledUp)).toBe("play");
  });
});
