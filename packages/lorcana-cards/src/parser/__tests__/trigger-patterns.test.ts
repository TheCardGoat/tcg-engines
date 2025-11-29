/**
 * Tests for Expanded Trigger Patterns
 *
 * Tests the new trigger patterns added in Task Group 2.3
 */

import { describe, expect, it } from "bun:test";
import { parseTriggeredAbility } from "../parsers/triggered-parser";

describe("Trigger Pattern: Whenever you play a card", () => {
  it("should parse 'Whenever you play a card' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a card, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "card",
      });
      expect(ability.effect.type).toBe("draw");
    }
  });

  it("should parse named ability with 'play a card' trigger", () => {
    const result = parseTriggeredAbility(
      "YOUR REWARD AWAITS Whenever you play a card, draw a card.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("YOUR REWARD AWAITS");
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.name).toBe("YOUR REWARD AWAITS");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "card",
      });
    }
  });
});

describe("Trigger Pattern: Whenever an opponent plays X", () => {
  it("should parse 'Whenever an opponent plays a song' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever an opponent plays a song, you may draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        controller: "opponent",
        cardType: "song",
      });
      expect(ability.effect.type).toBe("optional");
    }
  });

  it("should parse 'Whenever an opponent plays a character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever an opponent plays a character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        controller: "opponent",
        cardType: "character",
      });
      expect(ability.effect.type).toBe("gain-lore");
    }
  });

  it("should parse named ability with opponent trigger", () => {
    const result = parseTriggeredAbility(
      "FINE PRINT Whenever an opponent plays a song, you may draw a card.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("FINE PRINT");
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "opponent",
        cardType: "song",
      });
    }
  });
});

describe("Trigger Pattern: Whenever you play a [Type] character", () => {
  it("should parse 'Whenever you play a Hero character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Hero character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
        classification: "Hero",
      });
      expect(ability.effect.type).toBe("gain-lore");
    }
  });

  it("should parse 'Whenever you play a Villain character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Villain character, gain 2 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
        classification: "Villain",
      });
    }
  });

  it("should parse 'Whenever you play a Princess character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Princess character, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
        classification: "Princess",
      });
    }
  });

  it("should parse named ability with Hero character trigger", () => {
    const result = parseTriggeredAbility(
      "SHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("SHAMELESS PROMOTER");
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.name).toBe("SHAMELESS PROMOTER");
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
        classification: "Hero",
      });
    }
  });

  it("should parse 'Whenever you play a King character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a King character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
        classification: "King",
      });
    }
  });

  it("should parse 'Whenever you play a Queen character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Queen character, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
        classification: "Queen",
      });
    }
  });

  it("should parse 'Whenever you play a Pirate character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Pirate character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
        classification: "Pirate",
      });
    }
  });
});

describe("Trigger Pattern: Whenever this character is challenged", () => {
  it("should parse 'Whenever this character is challenged' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever this character is challenged, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("challenged");
      expect(ability.trigger.on).toBe("SELF");
      expect(ability.effect.type).toBe("draw");
    }
  });

  it("should parse named ability with challenged trigger", () => {
    const result = parseTriggeredAbility(
      "TEA PARTY Whenever this character is challenged, you may draw a card.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("TEA PARTY");
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.event).toBe("challenged");
      expect(ability.effect.type).toBe("optional");
    }
  });
});

describe("Trigger Pattern: Whenever you play an action", () => {
  it("should parse 'Whenever you play an action' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play an action, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "action",
      });
      expect(ability.effect.type).toBe("gain-lore");
    }
  });

  it("should parse named ability with action trigger", () => {
    const result = parseTriggeredAbility(
      "ACTION MASTER Whenever you play an action, draw a card.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("ACTION MASTER");
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "action",
      });
    }
  });
});

describe("Trigger Pattern: Whenever you play an item", () => {
  it("should parse 'Whenever you play an item' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play an item, you may draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "item",
      });
      expect(ability.effect.type).toBe("optional");
    }
  });

  it("should parse named ability with item trigger", () => {
    const result = parseTriggeredAbility(
      "IT WORKS! Whenever you play an item, you may draw a card.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("IT WORKS!");
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "item",
      });
    }
  });
});

describe("Trigger Pattern: Whenever you play a song", () => {
  it("should parse 'Whenever you play a song' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a song, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "song",
      });
      expect(ability.effect.type).toBe("gain-lore");
    }
  });

  it("should parse named ability with song trigger", () => {
    const result = parseTriggeredAbility(
      "FAN FAVORITE Whenever you play a song, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("FAN FAVORITE");
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.name).toBe("FAN FAVORITE");
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "song",
      });
    }
  });

  it("should parse optional effect with song trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a song, you may draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        controller: "you",
        cardType: "song",
      });
      expect(ability.effect.type).toBe("optional");
    }
  });
});

describe("Trigger Pattern: When this character is banished", () => {
  it("should parse 'When this character is banished' trigger", () => {
    const result = parseTriggeredAbility(
      "When this character is banished, draw 2 cards.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("when");
      expect(ability.trigger.event).toBe("banish");
      expect(ability.trigger.on).toBe("SELF");
      expect(ability.effect.type).toBe("draw");
    }
  });

  it("should parse 'Whenever this character is banished' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever this character is banished, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("banish");
      expect(ability.trigger.on).toBe("SELF");
    }
  });

  it("should parse named ability with banish trigger", () => {
    const result = parseTriggeredAbility(
      "LAST STAND When this character is banished, you may draw a card.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("LAST STAND");
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.event).toBe("banish");
      expect(ability.effect.type).toBe("optional");
    }
  });
});

describe("Integration: Complex trigger combinations", () => {
  it("should distinguish between 'play a card' and 'play a character'", () => {
    const cardResult = parseTriggeredAbility(
      "Whenever you play a card, draw a card.",
    );
    const characterResult = parseTriggeredAbility(
      "Whenever you play a character, draw a card.",
    );

    expect(cardResult.success).toBe(true);
    expect(characterResult.success).toBe(true);

    const cardAbility = cardResult.ability?.ability;
    const characterAbility = characterResult.ability?.ability;

    if (cardAbility?.type === "triggered") {
      expect(cardAbility.trigger.on).toEqual({
        controller: "you",
        cardType: "card",
      });
    }

    if (characterAbility?.type === "triggered") {
      expect(characterAbility.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
      });
    }
  });

  it("should distinguish between classification-based and generic triggers", () => {
    const heroResult = parseTriggeredAbility(
      "Whenever you play a Hero character, gain 1 lore.",
    );
    const genericResult = parseTriggeredAbility(
      "Whenever you play a character, gain 1 lore.",
    );

    expect(heroResult.success).toBe(true);
    expect(genericResult.success).toBe(true);

    const heroAbility = heroResult.ability?.ability;
    const genericAbility = genericResult.ability?.ability;

    if (heroAbility?.type === "triggered") {
      expect(heroAbility.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
        classification: "Hero",
      });
    }

    if (genericAbility?.type === "triggered") {
      expect(genericAbility.trigger.on).toEqual({
        controller: "you",
        cardType: "character",
      });
    }
  });

  it("should handle self-referential triggers correctly", () => {
    const result = parseTriggeredAbility(
      "When you play this character, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toBe("SELF");
      expect(ability.trigger.on).not.toEqual({
        controller: "you",
        cardType: "character",
      });
    }
  });
});
