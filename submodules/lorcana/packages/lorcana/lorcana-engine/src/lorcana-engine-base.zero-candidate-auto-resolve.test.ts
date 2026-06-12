import { describe, expect, it } from "bun:test";
import type { ActionCard } from "@tcg/lorcana-types";
import { createCardI18n } from "./card-i18n";
import { LorcanaMultiplayerTestEngine, createMockAction, createMockCharacter } from "./testing";

// Mock: mandatory triggered ability. When played, deals 1 damage to an
// opponent-chosen opposing character (mirrors Dinky "GET HIM!").
const mandatoryOpponentBanishOnPlay = createMockCharacter({
  id: "mandatory-opponent-banish",
  name: "Mandatory Opponent Banisher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "mandatory-opponent-banish-1",
      name: "Mandatory Opponent Banisher",
      text: "When you play this character, each opponent chooses and banishes one of their characters.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "banish",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

// Mock action: mirrors Be King Undisputed ("Each opponent chooses and banishes
// one of their characters").
const mandatoryOpponentBanishAction: ActionCard = createMockAction({
  id: "mandatory-opponent-banish-action",
  name: "Mandatory Opponent Banish Action",
  cost: 3,
  text: "Each opponent chooses and banishes one of their characters.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        chosenBy: "opponent",
        target: {
          selector: "chosen",
          count: 1,
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});

// Mock: optional triggered ability that needs an opposing character to target.
// Mirrors Flit "LOOK OUT!" shape — an optional inner effect whose sole target
// has zero valid candidates when the opponent has no characters.
const optionalOpposingTargetOnPlay = createMockCharacter({
  id: "optional-opposing-target",
  name: "Optional Opposing Targeter",
  cost: 1,
  lore: 1,
  abilities: [
    {
      id: "optional-opposing-target-1",
      name: "Optional Opposing Targeter",
      text: "When you play this character, you may exert chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "exert",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
});

// Mock: optional move-damage requiring both a source and destination character.
// Mirrors Flit "LOOK OUT!" — when the opponent has no characters, the
// `to: CHOSEN_OPPOSING_CHARACTER` slot has zero candidates and the optional
// cannot be meaningfully accepted.
const optionalMoveDamageOnPlay = createMockCharacter({
  id: "optional-move-damage",
  name: "Optional Move Damage",
  cost: 1,
  lore: 1,
  abilities: [
    {
      id: "optional-move-damage-1",
      name: "Optional Move Damage",
      text: "When you play this character, you may move up to 1 damage from chosen character to chosen opposing character.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "move-damage",
          amount: { type: "up-to", value: 1 },
          from: "CHOSEN_CHARACTER",
          to: "CHOSEN_OPPOSING_CHARACTER",
        },
      },
    },
  ],
});

describe("zero-candidate auto-resolve (engine)", () => {
  it("mandatory triggered banish auto-resolves when opponent has no characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mandatoryOpponentBanishOnPlay],
        inkwell: mandatoryOpponentBanishOnPlay.cost,
        deck: 5,
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(mandatoryOpponentBanishOnPlay),
    ).toBeSuccessfulCommand();

    // Game should not be locked: no pending effect awaiting input on either side,
    // and no stuck bag item.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("mandatory action with opponent-chosen target auto-resolves when opponent has no characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mandatoryOpponentBanishAction],
        inkwell: mandatoryOpponentBanishAction.cost,
        deck: 5,
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(mandatoryOpponentBanishAction),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("auto-drains optional move-damage when the `to` slot has zero candidates", () => {
    // Controller has a damaged character (valid `from`) but the opponent has
    // nothing in play (no valid `to`). This matches the reported Flit scenario.
    const ownDamagedChar = createMockCharacter({
      id: "own-damaged-char",
      name: "Own Damaged Char",
      cost: 1,
      strength: 1,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [optionalMoveDamageOnPlay],
        inkwell: optionalMoveDamageOnPlay.cost,
        play: [{ card: ownDamagedChar, isDrying: false, damage: 1 }],
        deck: 5,
      },
      { deck: 5 },
    );

    expect(testEngine.asPlayerOne().playCard(optionalMoveDamageOnPlay)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("auto-drains optional move-damage when `from` slot has zero candidates", () => {
    // Mirrors Cheshire Cat: no damaged characters anywhere means the "from"
    // side of the move-damage cannot be filled.
    const ownUndamaged = createMockCharacter({
      id: "own-undamaged",
      name: "Own Undamaged",
      cost: 1,
      willpower: 3,
      lore: 1,
    });
    const oppUndamaged = createMockCharacter({
      id: "opp-undamaged",
      name: "Opp Undamaged",
      cost: 1,
      willpower: 3,
      lore: 1,
    });
    const optionalMoveDamageDamagedOnly = createMockCharacter({
      id: "optional-move-damage-damaged-only",
      name: "Cheshire-like",
      cost: 1,
      lore: 1,
      abilities: [
        {
          id: "optional-move-damage-damaged-only-1",
          name: "Cheshire-like",
          text: "When you play this character, you may move up to 1 damage counter from chosen damaged character to chosen opposing character.",
          type: "triggered",
          trigger: { event: "play", on: "SELF", timing: "when" },
          effect: {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "move-damage",
              amount: { type: "up-to", value: 1 },
              from: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [{ type: "damaged" }],
              },
              to: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
          },
        },
      ],
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [optionalMoveDamageDamagedOnly],
        inkwell: optionalMoveDamageDamagedOnly.cost,
        play: [{ card: ownUndamaged, isDrying: false }],
        deck: 5,
      },
      {
        play: [oppUndamaged],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(optionalMoveDamageDamagedOnly),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });

  it("auto-drains optional triggered effects when the inner target has zero candidates", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [optionalOpposingTargetOnPlay],
        inkwell: optionalOpposingTargetOnPlay.cost,
        deck: 5,
      },
      { deck: 5 },
    );

    expect(testEngine.asPlayerOne().playCard(optionalOpposingTargetOnPlay)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  });
});
