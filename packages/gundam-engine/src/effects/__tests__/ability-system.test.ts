/**
 * Gundam Ability System Tests
 *
 * Tests for ability registration, triggering, activation, and static abilities.
 */

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import type { CardId, PlayerId, ZoneId } from "@tcg/core";
import { createZoneId } from "@tcg/core";
import type { GundamGameState } from "../../types";
import {
  type ActivatedAbility,
  type CardAbility,
  type StaticAbility,
  type TriggerEvent,
  type TriggerType,
  type TriggeredAbility,
  canActivateAbility,
  clearAbilities,
  createActivatedAbility,
  createStaticAbility,
  createTriggeredAbility,
  executeTriggeredAbility,
  findMatchingAbilities,
  getAbilities,
  getActivatableAbilities,
  getStaticAbilities,
  registerAbilities,
} from "../ability-system";
import { damage, draw, modifyAP, rest, sequence } from "../effect-types";

describe("Ability Registry", () => {
  afterEach(() => {
    clearAbilities();
  });

  it("should register abilities for a card", () => {
    const cardId = "card1";
    const abilities: CardAbility[] = [
      createTriggeredAbility("ON_DEPLOY", draw(1)),
      createActivatedAbility({ payResources: 2 }, damage(2, "chosen-unit")),
    ];

    registerAbilities(cardId, abilities);

    const retrieved = getAbilities(cardId);
    expect(retrieved).toHaveLength(2);
    expect(retrieved[0].type).toBe("triggered");
    expect(retrieved[1].type).toBe("activated");
  });

  it("should return empty array for card with no abilities", () => {
    const retrieved = getAbilities("nonexistent");
    expect(retrieved).toEqual([]);
  });

  it("should clear all abilities", () => {
    registerAbilities("card1", [createTriggeredAbility("ON_DEPLOY", draw(1))]);
    registerAbilities("card2", [createTriggeredAbility("ON_ATTACK", damage(2, "chosen-unit"))]);

    clearAbilities();

    expect(getAbilities("card1")).toEqual([]);
    expect(getAbilities("card2")).toEqual([]);
  });
});

// Helper to create a Zone with proper structure
function createZone(
  owner: PlayerId,
  zoneName: string,
  cards: CardId[],
  visibility: "public" | "private" | "secret" = "public",
  ordered = false,
): GundamGameState["zones"][keyof GundamGameState["zones"]][PlayerId] {
  return {
    cards,
    config: {
      faceDown: visibility === "secret",
      id: createZoneId(`${zoneName}-${owner}`),
      maxSize: undefined,
      name: zoneName,
      ordered,
      owner,
      visibility,
    },
  };
}

describe("Triggered Abilities", () => {
  let mockState: GundamGameState;
  let player1: PlayerId;
  let card1: CardId;
  let card2: CardId;

  beforeEach(() => {
    player1 = "player1" as PlayerId;
    const player2 = "player2" as PlayerId;
    card1 = "card1" as CardId;
    card2 = "card2" as CardId;

    mockState = {
      currentPlayer: player1,
      gundam: {
        activeResources: { [player1]: 3, [player2]: 2 },
        attackedThisTurn: [],
        cardDamage: {},
        cardPositions: { [card1]: "active", [card2]: "active" },
        effectStack: { nextInstanceId: 0, stack: [] },
        hasPlayedResourceThisTurn: { [player1]: false, [player2]: false },
        revealedCards: [],
        temporaryModifiers: {},
      },
      phase: "main",
      players: [player1, player2],
      turn: 1,
      zones: {
        baseSection: {
          [player1]: createZone(player1, "baseSection", [], "public"),
          [player2]: createZone(player2, "baseSection", [], "public"),
        },
        battleArea: {
          [player1]: createZone(player1, "battleArea", [card1, card2], "public", true),
          [player2]: createZone(player2, "battleArea", [], "public", true),
        },
        deck: {
          [player1]: createZone(player1, "deck", [], "secret", true),
          [player2]: createZone(player2, "deck", [], "secret", true),
        },
        hand: {
          [player1]: createZone(player1, "hand", [], "private"),
          [player2]: createZone(player2, "hand", [], "private"),
        },
        limbo: {
          [player1]: createZone(player1, "limbo", [], "public"),
          [player2]: createZone(player2, "limbo", [], "public"),
        },
        removal: {
          [player1]: createZone(player1, "removal", [], "public"),
          [player2]: createZone(player2, "removal", [], "public"),
        },
        resourceArea: {
          [player1]: createZone(player1, "resourceArea", [], "public"),
          [player2]: createZone(player2, "resourceArea", [], "public"),
        },
        resourceDeck: {
          [player1]: createZone(player1, "resourceDeck", [], "secret", true),
          [player2]: createZone(player2, "resourceDeck", [], "secret", true),
        },
        shieldSection: {
          [player1]: createZone(player1, "shieldSection", [], "secret", true),
          [player2]: createZone(player2, "shieldSection", [], "secret", true),
        },
        trash: {
          [player1]: createZone(player1, "trash", [], "public", true),
          [player2]: createZone(player2, "trash", [], "public", true),
        },
      },
    };

    // Register abilities
    registerAbilities(card1, [
      createTriggeredAbility("ON_DEPLOY", draw(1), { name: "Draw on Deploy" }),
      createTriggeredAbility("ON_ATTACK", damage(2, "chosen-unit"), {
        name: "Damage on Attack",
      }),
    ]);

    registerAbilities(card2, [createTriggeredAbility("ON_DEPLOY", draw(2))]);
  });

  afterEach(() => {
    clearAbilities();
  });

  it("should find matching abilities for trigger event", () => {
    const event: TriggerEvent = {
      cardId: card1,
      player: player1,
      type: "ON_DEPLOY",
    };

    const matches = findMatchingAbilities(event, mockState);

    expect(matches).toHaveLength(2);
    expect(matches[0].cardId).toBe(card1);
    expect(matches[1].cardId).toBe(card2);
  });

  it("should find only ON_ATTACK abilities", () => {
    const event: TriggerEvent = {
      cardId: card1,
      player: player1,
      type: "ON_ATTACK",
    };

    const matches = findMatchingAbilities(event, mockState);

    expect(matches).toHaveLength(1);
    expect(matches[0].cardId).toBe(card1);
    expect((matches[0].ability as TriggeredAbility).trigger).toBe("ON_ATTACK");
  });

  it("should return empty for no matching abilities", () => {
    const event: TriggerEvent = {
      cardId: card1,
      player: player1,
      type: "ON_DESTROY",
    };

    const matches = findMatchingAbilities(event, mockState);

    expect(matches).toHaveLength(0);
  });

  it("should execute triggered ability", () => {
    const abilities = getAbilities(card1);
    const deployAbility = abilities.find((a) => (a as TriggeredAbility).trigger === "ON_DEPLOY");

    expect(deployAbility).toBeDefined();

    const result = executeTriggeredAbility(
      card1,
      deployAbility as TriggeredAbility,
      mockState,
      player1,
    );

    expect(result.success).toBe(true);
    expect(result.events).toHaveLength(1);
  });
});

describe("Activated Abilities", () => {
  let mockState: GundamGameState;
  let player1: PlayerId;
  let card1: CardId;

  beforeEach(() => {
    player1 = "player1" as PlayerId;
    const player2 = "player2" as PlayerId;
    card1 = "card1" as CardId;

    mockState = {
      currentPlayer: player1,
      gundam: {
        activeResources: { [player1]: 3, [player2]: 2 },
        attackedThisTurn: [],
        cardDamage: {},
        cardPositions: { [card1]: "active" },
        effectStack: { nextInstanceId: 0, stack: [] },
        hasPlayedResourceThisTurn: { [player1]: false, [player2]: false },
        revealedCards: [],
        temporaryModifiers: {},
      },
      phase: "main",
      players: [player1, player2],
      turn: 1,
      zones: {
        baseSection: {
          [player1]: createZone(player1, "baseSection", [], "public"),
          [player2]: createZone(player2, "baseSection", [], "public"),
        },
        battleArea: {
          [player1]: createZone(player1, "battleArea", [card1], "public", true),
          [player2]: createZone(player2, "battleArea", [], "public", true),
        },
        deck: {
          [player1]: createZone(player1, "deck", [], "secret", true),
          [player2]: createZone(player2, "deck", [], "secret", true),
        },
        hand: {
          [player1]: createZone(player1, "hand", [], "private"),
          [player2]: createZone(player2, "hand", [], "private"),
        },
        limbo: {
          [player1]: createZone(player1, "limbo", [], "public"),
          [player2]: createZone(player2, "limbo", [], "public"),
        },
        removal: {
          [player1]: createZone(player1, "removal", [], "public"),
          [player2]: createZone(player2, "removal", [], "public"),
        },
        resourceArea: {
          [player1]: createZone(player1, "resourceArea", [], "public"),
          [player2]: createZone(player2, "resourceArea", [], "public"),
        },
        resourceDeck: {
          [player1]: createZone(player1, "resourceDeck", [], "secret", true),
          [player2]: createZone(player2, "resourceDeck", [], "secret", true),
        },
        shieldSection: {
          [player1]: createZone(player1, "shieldSection", [], "secret", true),
          [player2]: createZone(player2, "shieldSection", [], "secret", true),
        },
        trash: {
          [player1]: createZone(player1, "trash", [], "public", true),
          [player2]: createZone(player2, "trash", [], "public", true),
        },
      },
    };

    // Register abilities
    registerAbilities(card1, [
      createActivatedAbility({ payResources: 2, rest: true }, damage(3, "chosen-unit"), {
        name: "Fire Beam",
      }),
    ]);
  });

  afterEach(() => {
    clearAbilities();
  });

  it("should check if ability can be activated", () => {
    const abilities = getAbilities(card1);
    const ability = abilities[0] as ActivatedAbility;

    expect(canActivateAbility(card1, ability, mockState, player1)).toBe(true);
  });

  it("should not activate if card is rested", () => {
    const restedState = {
      ...mockState,
      gundam: {
        ...mockState.gundam,
        cardPositions: { [card1]: "rested" },
      },
    } as unknown as GundamGameState;

    const abilities = getAbilities(card1);
    const ability = abilities[0] as ActivatedAbility;

    expect(canActivateAbility(card1, ability, restedState, player1)).toBe(false);
  });

  it("should not activate if not enough resources", () => {
    const poorState = {
      ...mockState,
      gundam: {
        ...mockState.gundam,
        activeResources: { [player1]: 1 },
      },
    };

    const abilities = getAbilities(card1);
    const ability = abilities[0] as ActivatedAbility;

    expect(canActivateAbility(card1, ability, poorState, player1)).toBe(false);
  });

  it("should get activatable abilities for player", () => {
    const activatable = getActivatableAbilities(mockState, player1);

    expect(activatable).toHaveLength(1);
    expect(activatable[0].cardId).toBe(card1);
    expect(activatable[0].ability.name).toBe("Fire Beam");
  });
});

describe("Static Abilities", () => {
  let mockState: GundamGameState;
  let player1: PlayerId;
  let card1: CardId;
  let card2: CardId;

  beforeEach(() => {
    player1 = "player1" as PlayerId;
    const player2 = "player2" as PlayerId;
    card1 = "card1" as CardId;
    card2 = "card2" as CardId;

    mockState = {
      currentPlayer: player1,
      gundam: {
        activeResources: { [player1]: 3, [player2]: 2 },
        attackedThisTurn: [],
        cardDamage: {},
        cardPositions: { [card1]: "active", [card2]: "active" },
        effectStack: { nextInstanceId: 0, stack: [] },
        hasPlayedResourceThisTurn: { [player1]: false, [player2]: false },
        revealedCards: [],
        temporaryModifiers: {},
      },
      phase: "main",
      players: [player1, player2],
      turn: 1,
      zones: {
        baseSection: {
          [player1]: createZone(player1, "baseSection", [], "public"),
          [player2]: createZone(player2, "baseSection", [], "public"),
        },
        battleArea: {
          [player1]: createZone(player1, "battleArea", [card1, card2], "public", true),
          [player2]: createZone(player2, "battleArea", [], "public", true),
        },
        deck: {
          [player1]: createZone(player1, "deck", [], "secret", true),
          [player2]: createZone(player2, "deck", [], "secret", true),
        },
        hand: {
          [player1]: createZone(player1, "hand", [], "private"),
          [player2]: createZone(player2, "hand", [], "private"),
        },
        limbo: {
          [player1]: createZone(player1, "limbo", [], "public"),
          [player2]: createZone(player2, "limbo", [], "public"),
        },
        removal: {
          [player1]: createZone(player1, "removal", [], "public"),
          [player2]: createZone(player2, "removal", [], "public"),
        },
        resourceArea: {
          [player1]: createZone(player1, "resourceArea", [], "public"),
          [player2]: createZone(player2, "resourceArea", [], "public"),
        },
        resourceDeck: {
          [player1]: createZone(player1, "resourceDeck", [], "secret", true),
          [player2]: createZone(player2, "resourceDeck", [], "secret", true),
        },
        shieldSection: {
          [player1]: createZone(player1, "shieldSection", [], "secret", true),
          [player2]: createZone(player2, "shieldSection", [], "secret", true),
        },
        trash: {
          [player1]: createZone(player1, "trash", [], "public", true),
          [player2]: createZone(player2, "trash", [], "public", true),
        },
      },
    };

    // Register static abilities
    registerAbilities(card1, [
      createStaticAbility(modifyAP(2, "this"), {
        appliesTo: "this",
        name: "Boost +2",
      }),
    ]);

    registerAbilities(card2, [
      createStaticAbility(modifyAP(1, "each-friendly-unit"), {
        appliesTo: "each-friendly-unit",
        name: "Allies +1",
      }),
    ]);
  });

  afterEach(() => {
    clearAbilities();
  });

  it("should get all static abilities", () => {
    const staticAbilities = getStaticAbilities(mockState);

    expect(staticAbilities).toHaveLength(2);
    expect(staticAbilities[0].cardId).toBe(card1);
    expect(staticAbilities[1].cardId).toBe(card2);
  });
});

describe("Ability Builders", () => {
  it("should create triggered ability", () => {
    const ability = createTriggeredAbility("ON_DEPLOY", draw(1), {
      description: "Draw a card when this unit deploys",
      name: "Draw on Deploy",
      oncePerTurn: false,
    });

    expect(ability.type).toBe("triggered");
    expect(ability.trigger).toBe("ON_DEPLOY");
    expect(ability.effect).toEqual({ amount: 1, type: "draw" });
    expect(ability.name).toBe("Draw on Deploy");
    expect(ability.description).toBe("Draw a card when this unit deploys");
    expect(ability.oncePerTurn).toBe(false);
  });

  it("should create triggered ability with trigger condition", () => {
    const condition = (state: GundamGameState, cardId: string) => state.turn >= 3;
    const ability = createTriggeredAbility("ON_DEPLOY", draw(2), {
      name: "Draw 2 on Deploy after turn 3",
      triggerCondition: condition,
    });

    expect(ability.type).toBe("triggered");
    expect(ability.triggerCondition).toBeDefined();
  });

  it("should create activated ability", () => {
    const ability = createActivatedAbility(
      { payResources: 2, rest: true },
      damage(3, "chosen-unit"),
      {
        description: "Pay 2 resources and rest: Deal 3 damage to target unit",
        name: "Fire Beam",
        oncePerTurn: true,
      },
    );

    expect(ability.type).toBe("activated");
    expect(ability.cost).toEqual({ payResources: 2, rest: true });
    expect(ability.effect).toEqual({
      amount: 3,
      target: "chosen-unit",
      type: "damage",
    });
    expect(ability.name).toBe("Fire Beam");
    expect(ability.oncePerTurn).toBe(true);
  });

  it("should create activated ability with activation condition", () => {
    const condition = (state: GundamGameState, cardId: string) =>
      state.gundam.activeResources[state.currentPlayer] >= 5;
    const ability = createActivatedAbility({ payResources: 3 }, damage(5, "chosen-unit"), {
      activationCondition: condition,
    });

    expect(ability.type).toBe("activated");
    expect(ability.activationCondition).toBeDefined();
  });

  it("should create static ability", () => {
    const ability = createStaticAbility(modifyAP(2, "each-friendly-unit"), {
      appliesTo: "each-friendly-unit",
      description: "Friendly units get +2 AP",
      name: "Commander's Boost",
    });

    expect(ability.type).toBe("static");
    expect(ability.effect).toEqual({
      amount: 2,
      target: "each-friendly-unit",
      type: "modify-ap",
    });
    expect(ability.name).toBe("Commander's Boost");
    expect(ability.appliesTo).toBe("each-friendly-unit");
  });

  it("should create static ability with condition", () => {
    const condition = (state: GundamGameState, cardId: string) => state.turn >= 5;
    const ability = createStaticAbility(modifyAP(3, "this"), {
      condition,
      name: "Late Game Boost",
    });

    expect(ability.type).toBe("static");
    expect(ability.condition).toBeDefined();
  });
});

describe("Trigger Types", () => {
  it("should support all trigger types", () => {
    const triggerTypes: TriggerType[] = [
      "ON_DEPLOY",
      "ON_ATTACK",
      "ON_DEFENSE",
      "ON_DESTROY",
      "ON_DAMAGE",
      "ON_DAMAGED",
      "ON_REST",
      "ON_STAND",
      "TURN_START",
      "TURN_END",
      "PHASE_START",
      "PHASE_END",
      "WHEN_ATTACK_DECLARED",
      "WHEN_BLOCK_DECLARED",
      "ON_PAIR",
      "ON_UNPAIR",
      "CUSTOM",
    ];

    triggerTypes.forEach((trigger) => {
      const ability = createTriggeredAbility(trigger, draw(1));
      expect(ability.trigger).toBe(trigger);
    });
  });
});
