import { describe, expect, it } from "bun:test";
import type { LocationCard } from "@tcg/lorcana-types";

import { createCardI18n } from "./card-i18n";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "./testing";

const challengerAttacker = createMockCharacter({
  id: "preview-challenger-attacker",
  name: "Preview Challenger",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  abilities: [
    {
      id: "preview-challenger-attacker-keyword",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
  ],
});

const resistingDefender = createMockCharacter({
  id: "preview-resisting-defender",
  name: "Preview Defender",
  cost: 2,
  strength: 3,
  willpower: 5,
  lore: 1,
  abilities: [
    {
      id: "preview-resisting-defender-keyword",
      keyword: "Resist",
      text: "Resist +1",
      type: "keyword",
      value: 1,
    },
  ],
});

function createMockLocation(params: {
  id: string;
  name: string;
  cost: number;
  willpower: number;
  moveCost?: number;
  lore?: number;
}): LocationCard {
  return {
    id: params.id,
    canonicalId: `ci_${params.id}`,
    cardType: "location",
    name: params.name,
    cost: params.cost,
    moveCost: params.moveCost ?? 1,
    willpower: params.willpower,
    lore: params.lore ?? 0,
    inkType: ["amber"],
    inkable: true,
    set: "TST",
    rarity: "common",
    cardNumber: 667,
    abilities: [],
    i18n: createCardI18n(params.name),
  };
}

describe("LorcanaEngineBase.previewChallenge", () => {
  it("returns the basic combat preview for character challenges", () => {
    const attacker = createMockCharacter({
      id: "preview-basic-attacker",
      name: "Basic Attacker",
      cost: 2,
      strength: 4,
      willpower: 5,
      lore: 1,
    });
    const defender = createMockCharacter({
      id: "preview-basic-defender",
      name: "Basic Defender",
      cost: 2,
      strength: 2,
      willpower: 6,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker],
        deck: 1,
      },
      {
        play: [{ card: defender, exerted: true }],
        deck: 1,
      },
    );

    const preview = testEngine.asPlayerOne().previewChallenge(attacker, defender);

    expect(preview).toEqual({
      attackerId: expect.any(String),
      defenderId: expect.any(String),
      defenderKind: "character",
      attackerCurrentDamage: 0,
      defenderCurrentDamage: 0,
      attackerNextDamage: 2,
      defenderNextDamage: 4,
      attackerWillpower: 5,
      defenderWillpower: 6,
      attackerDamageDealt: 4,
      defenderDamageDealt: 2,
      attackerWouldBeBanished: false,
      defenderWouldBeBanished: false,
      attackerDamageIsReduced: false,
      defenderDamageIsReduced: false,
    });
  });

  it("accounts for Challenger and Resist in the preview", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [challengerAttacker],
        deck: 1,
      },
      {
        play: [{ card: resistingDefender, exerted: true }],
        deck: 1,
      },
    );

    const preview = testEngine
      .asPlayerOne()
      .previewChallenge(challengerAttacker, resistingDefender);

    expect(preview?.attackerDamageDealt).toBe(3);
    expect(preview?.defenderDamageDealt).toBe(3);
    expect(preview?.defenderNextDamage).toBe(3);
    expect(preview?.attackerNextDamage).toBe(3);
  });

  it("includes existing damage when projecting lethal outcomes", () => {
    const attacker = createMockCharacter({
      id: "preview-damaged-attacker",
      name: "Damaged Attacker",
      cost: 2,
      strength: 3,
      willpower: 4,
      lore: 1,
    });
    const defender = createMockCharacter({
      id: "preview-damaged-defender",
      name: "Damaged Defender",
      cost: 2,
      strength: 2,
      willpower: 5,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: attacker, damage: 2 }],
        deck: 1,
      },
      {
        play: [{ card: defender, exerted: true, damage: 3 }],
        deck: 1,
      },
    );

    const preview = testEngine.asPlayerOne().previewChallenge(attacker, defender);

    expect(preview?.attackerCurrentDamage).toBe(2);
    expect(preview?.defenderCurrentDamage).toBe(3);
    expect(preview?.attackerNextDamage).toBe(4);
    expect(preview?.defenderNextDamage).toBe(6);
    expect(preview?.attackerWouldBeBanished).toBe(true);
    expect(preview?.defenderWouldBeBanished).toBe(true);
  });

  it("treats location defenders as taking damage without striking back", () => {
    const attacker = createMockCharacter({
      id: "preview-location-attacker",
      name: "Location Attacker",
      cost: 2,
      strength: 4,
      willpower: 4,
      lore: 1,
    });
    const location = createMockLocation({
      id: "preview-location-defender",
      name: "Preview Castle",
      cost: 2,
      willpower: 5,
      moveCost: 2,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker],
        deck: 1,
      },
      {
        play: [location],
        deck: 1,
      },
    );

    const preview = testEngine.asPlayerOne().previewChallenge(attacker, location);

    expect(preview?.defenderKind).toBe("location");
    expect(preview?.attackerDamageDealt).toBe(4);
    expect(preview?.defenderDamageDealt).toBe(0);
    expect(preview?.attackerNextDamage).toBe(0);
    expect(preview?.defenderNextDamage).toBe(4);
    expect(preview?.attackerWouldBeBanished).toBe(false);
  });

  it("clamps zero or reduced challenge damage to zero", () => {
    const attacker = createMockCharacter({
      id: "preview-zero-damage-attacker",
      name: "Zero Damage Attacker",
      cost: 2,
      strength: 1,
      willpower: 4,
      lore: 1,
    });
    const defender = createMockCharacter({
      id: "preview-zero-damage-defender",
      name: "Zero Damage Defender",
      cost: 2,
      strength: 1,
      willpower: 5,
      lore: 1,
      abilities: [
        {
          id: "preview-zero-damage-defender-keyword",
          keyword: "Resist",
          text: "Resist +3",
          type: "keyword",
          value: 3,
        },
      ],
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker],
        deck: 1,
      },
      {
        play: [{ card: defender, exerted: true }],
        deck: 1,
      },
    );

    const preview = testEngine.asPlayerOne().previewChallenge(attacker, defender);

    expect(preview?.attackerDamageDealt).toBe(0);
    expect(preview?.defenderNextDamage).toBe(0);
    expect(preview?.defenderWouldBeBanished).toBe(false);
  });

  it("returns null for illegal challenges", () => {
    const attacker = createMockCharacter({
      id: "preview-illegal-attacker",
      name: "Illegal Attacker",
      cost: 2,
      strength: 4,
      willpower: 4,
      lore: 1,
    });
    const readyDefender = createMockCharacter({
      id: "preview-illegal-defender",
      name: "Ready Defender",
      cost: 2,
      strength: 2,
      willpower: 2,
      lore: 1,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker],
        deck: 1,
      },
      {
        play: [readyDefender],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().previewChallenge(attacker, readyDefender)).toBeNull();
  });
});
