/**
 * Tests for Expanded Trigger Patterns
 *
 * Tests the new trigger patterns added in Task Group 2.3
 */

import { describe, expect, it } from "bun:test";
import type { TriggeredAbility } from "@tcg/lorcana";
import { parseTriggeredAbility } from "../parsers/triggered-parser";

describe("Trigger Pattern: Whenever you play a card", () => {
  it("should parse 'Whenever you play a card' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a card, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        cardType: "card",
        controller: "you",
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.name).toBe("YOUR REWARD AWAITS");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        cardType: "card",
        controller: "you",
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        cardType: "action",
        controller: "opponent", // "song" is mapped to "action" (songs are actions)
      });
      expect(ability.effect.type).toBe("optional");
    }
  });

  it("should parse 'Whenever an opponent plays a character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever an opponent plays a character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        cardType: "character",
        controller: "opponent",
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "action",
        controller: "opponent", // "song" is mapped to "action" (songs are actions)
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        cardType: "character",
        classification: "Hero",
        controller: "you",
      });
      expect(ability.effect.type).toBe("gain-lore");
    }
  });

  it("should parse 'Whenever you play a Villain character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Villain character, gain 2 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "character",
        classification: "Villain",
        controller: "you",
      });
    }
  });

  it("should parse 'Whenever you play a Princess character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Princess character, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "character",
        classification: "Princess",
        controller: "you",
      });
    }
  });

  it("should parse named ability with Hero character trigger", () => {
    const result = parseTriggeredAbility(
      "SHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    expect(result.ability?.name).toBe("SHAMELESS PROMOTER");
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.name).toBe("SHAMELESS PROMOTER");
      expect(ability.trigger.on).toEqual({
        cardType: "character",
        classification: "Hero",
        controller: "you",
      });
    }
  });

  it("should parse 'Whenever you play a King character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a King character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "character",
        classification: "King",
        controller: "you",
      });
    }
  });

  it("should parse 'Whenever you play a Queen character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Queen character, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "character",
        classification: "Queen",
        controller: "you",
      });
    }
  });

  it("should parse 'Whenever you play a Pirate character' trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a Pirate character, gain 1 lore.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "character",
        classification: "Pirate",
        controller: "you",
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        cardType: "action",
        controller: "you",
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "action",
        controller: "you",
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        cardType: "item",
        controller: "you",
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "item",
        controller: "you",
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.timing).toBe("whenever");
      expect(ability.trigger.event).toBe("play");
      expect(ability.trigger.on).toEqual({
        cardType: "action",
        controller: "you", // "song" is mapped to "action" (songs are actions)
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.name).toBe("FAN FAVORITE");
      expect(ability.trigger.on).toEqual({
        cardType: "action",
        controller: "you", // "song" is mapped to "action" (songs are actions)
      });
    }
  });

  it("should parse optional effect with song trigger", () => {
    const result = parseTriggeredAbility(
      "Whenever you play a song, you may draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toEqual({
        cardType: "action",
        controller: "you", // "song" is mapped to "action" (songs are actions)
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
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
    const ability = result.ability?.ability as TriggeredAbility | undefined;
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

    const cardAbility = cardResult.ability?.ability as
      | TriggeredAbility
      | undefined;
    const characterAbility = characterResult.ability?.ability as
      | TriggeredAbility
      | undefined;

    if (cardAbility?.type === "triggered") {
      expect(cardAbility.trigger.on).toEqual({
        cardType: "card",
        controller: "you",
      });
    }

    if (characterAbility?.type === "triggered") {
      expect(characterAbility.trigger.on).toEqual({
        cardType: "character",
        controller: "you",
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

    const heroAbility = heroResult.ability?.ability as
      | TriggeredAbility
      | undefined;
    const genericAbility = genericResult.ability?.ability as
      | TriggeredAbility
      | undefined;

    if (heroAbility?.type === "triggered") {
      expect(heroAbility.trigger.on).toEqual({
        cardType: "character",
        classification: "Hero",
        controller: "you",
      });
    }

    if (genericAbility?.type === "triggered") {
      expect(genericAbility.trigger.on).toEqual({
        cardType: "character",
        controller: "you",
      });
    }
  });

  it("should handle self-referential triggers correctly", () => {
    const result = parseTriggeredAbility(
      "When you play this character, draw a card.",
    );

    expect(result.success).toBe(true);
    const ability = result.ability?.ability as TriggeredAbility | undefined;
    if (ability?.type === "triggered") {
      expect(ability.trigger.on).toBe("SELF");
      expect(ability.trigger.on).not.toEqual({
        cardType: "character",
        controller: "you",
      });
    }
  });
});
