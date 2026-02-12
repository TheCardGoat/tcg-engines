import { describe, expect, it } from "bun:test";
import {
  ALL_TARGET_ENUMS,
  CHARACTER_TARGET_ENUMS,
  type CharacterTarget,
  type CharacterTargetEnum,
  ITEM_TARGET_ENUMS,
  type ItemTargetEnum,
  LOCATION_TARGET_ENUMS,
  type LocationTargetEnum,
  type LorcanaCardTarget,
  type LorcanaCharacterTarget,
  expandCharacterTarget,
  expandItemTarget,
  expandLocationTarget,
  expandTarget,
  generateTargetDescription,
  getTargetUIHints,
  isCharacterEnum,
  isDSLTarget,
} from "../index";

describe("Targeting DSL", () => {
  describe("Enum Detection", () => {
    it("should detect string enums", () => {
      expect(isCharacterEnum("CHOSEN_CHARACTER")).toBe(true);
      expect(isCharacterEnum("SELF")).toBe(true);
      expect(isCharacterEnum("ALL_OPPOSING_CHARACTERS")).toBe(true);
    });

    it("should detect DSL objects", () => {
      const dsl: LorcanaCardTarget = {
        cardType: "character",
        count: 1,
        selector: "chosen",
      };
      expect(isDSLTarget(dsl)).toBe(true);
      expect(isDSLTarget("CHOSEN_CHARACTER")).toBe(false);
    });
  });

  describe("Character Target Expansion", () => {
    it("should expand SELF enum", () => {
      const expanded = expandCharacterTarget("SELF");
      expect(expanded).toMatchObject({
        cardType: "character",
        context: { self: true },
        selector: "self",
      });
    });

    it("should expand CHOSEN_CHARACTER enum", () => {
      const expanded = expandCharacterTarget("CHOSEN_CHARACTER");
      expect(expanded).toMatchObject({
        cardType: "character",
        count: 1,
        owner: "any",
        selector: "chosen",
        zones: ["play"],
      });
    });

    it("should expand CHOSEN_OPPOSING_CHARACTER enum", () => {
      const expanded = expandCharacterTarget("CHOSEN_OPPOSING_CHARACTER");
      expect(expanded).toMatchObject({
        cardType: "character",
        count: 1,
        owner: "opponent",
        selector: "chosen",
        zones: ["play"],
      });
    });

    it("should expand ALL_OPPOSING_CHARACTERS enum", () => {
      const expanded = expandCharacterTarget("ALL_OPPOSING_CHARACTERS");
      expect(expanded).toMatchObject({
        cardType: "character",
        count: "all",
        owner: "opponent",
        selector: "all",
        zones: ["play"],
      });
    });

    it("should expand CHOSEN_DAMAGED_CHARACTER enum", () => {
      const expanded = expandCharacterTarget("CHOSEN_DAMAGED_CHARACTER");
      expect(expanded).toMatchObject({
        cardType: "character",
        count: 1,
        filters: [{ type: "damaged" }],
        owner: "any",
        selector: "chosen",
        zones: ["play"],
      });
    });

    it("should expand ANOTHER_CHOSEN_CHARACTER enum", () => {
      const expanded = expandCharacterTarget("ANOTHER_CHOSEN_CHARACTER");
      expect(expanded).toMatchObject({
        count: 1,
        excludeSelf: true,
        selector: "chosen",
      });
    });

    it("should return DSL object unchanged", () => {
      const dsl: CharacterTarget = {
        cardType: "character",
        count: 2,
        filters: [{ type: "exerted" }],
        owner: "opponent",
        selector: "chosen",
      };
      const expanded = expandCharacterTarget(dsl);
      expect(expanded).toBe(dsl);
    });

    it("should expand all character enum values", () => {
      for (const enumValue of CHARACTER_TARGET_ENUMS) {
        const expanded = expandCharacterTarget(enumValue as CharacterTargetEnum);
        expect(expanded).toBeDefined();
        expect(expanded.cardType).toBe("character");
      }
    });
  });

  describe("Item Target Expansion", () => {
    it("should expand CHOSEN_ITEM enum", () => {
      const expanded = expandItemTarget("CHOSEN_ITEM");
      expect(expanded).toMatchObject({
        cardType: "item",
        count: 1,
        owner: "any",
        selector: "chosen",
        zones: ["play"],
      });
    });

    it("should expand THIS_ITEM enum", () => {
      const expanded = expandItemTarget("THIS_ITEM");
      expect(expanded).toMatchObject({
        cardType: "item",
        context: { self: true },
        selector: "self",
      });
    });

    it("should expand all item enum values", () => {
      for (const enumValue of ITEM_TARGET_ENUMS) {
        const expanded = expandItemTarget(enumValue as ItemTargetEnum);
        expect(expanded).toBeDefined();
        expect(expanded.cardType).toBe("item");
      }
    });
  });

  describe("Location Target Expansion", () => {
    it("should expand CHOSEN_LOCATION enum", () => {
      const expanded = expandLocationTarget("CHOSEN_LOCATION");
      expect(expanded).toMatchObject({
        cardType: "location",
        count: 1,
        owner: "any",
        selector: "chosen",
        zones: ["play"],
      });
    });

    it("should expand THIS_LOCATION enum", () => {
      const expanded = expandLocationTarget("THIS_LOCATION");
      expect(expanded).toMatchObject({
        cardType: "location",
        context: { self: true },
        selector: "self",
      });
    });

    it("should expand all location enum values", () => {
      for (const enumValue of LOCATION_TARGET_ENUMS) {
        const expanded = expandLocationTarget(enumValue as LocationTargetEnum);
        expect(expanded).toBeDefined();
        expect(expanded.cardType).toBe("location");
      }
    });
  });

  describe("Generic Target Expansion", () => {
    it("should expand any target enum", () => {
      expect(expandTarget("CHOSEN_CHARACTER").cardType).toBe("character");
      expect(expandTarget("CHOSEN_ITEM").cardType).toBe("item");
      expect(expandTarget("CHOSEN_LOCATION").cardType).toBe("location");
    });

    it("should throw for unknown enum", () => {
      expect(() => expandTarget("UNKNOWN" as any)).toThrow();
    });
  });

  describe("Enum Registries", () => {
    it("should have all character enums registered", () => {
      expect(CHARACTER_TARGET_ENUMS.has("SELF")).toBe(true);
      expect(CHARACTER_TARGET_ENUMS.has("CHOSEN_CHARACTER")).toBe(true);
      expect(CHARACTER_TARGET_ENUMS.has("ALL_OPPOSING_CHARACTERS")).toBe(true);
    });

    it("should have all item enums registered", () => {
      expect(ITEM_TARGET_ENUMS.has("CHOSEN_ITEM")).toBe(true);
      expect(ITEM_TARGET_ENUMS.has("YOUR_ITEMS")).toBe(true);
    });

    it("should have all location enums registered", () => {
      expect(LOCATION_TARGET_ENUMS.has("CHOSEN_LOCATION")).toBe(true);
      expect(LOCATION_TARGET_ENUMS.has("YOUR_LOCATIONS")).toBe(true);
    });

    it("should have complete ALL_TARGET_ENUMS", () => {
      expect(ALL_TARGET_ENUMS.size).toBe(
        CHARACTER_TARGET_ENUMS.size + ITEM_TARGET_ENUMS.size + LOCATION_TARGET_ENUMS.size,
      );
    });
  });
});

describe("Target Description Generation", () => {
  it("should describe CHOSEN_CHARACTER", () => {
    const desc = generateTargetDescription("CHOSEN_CHARACTER");
    expect(desc).toBe("a character");
  });

  it("should describe CHOSEN_OPPOSING_CHARACTER", () => {
    const desc = generateTargetDescription("CHOSEN_OPPOSING_CHARACTER");
    expect(desc).toBe("an opposing character");
  });

  it("should describe ALL_OPPOSING_CHARACTERS", () => {
    const desc = generateTargetDescription("ALL_OPPOSING_CHARACTERS");
    expect(desc).toBe("all opposing characters");
  });

  it("should describe CHOSEN_DAMAGED_CHARACTER", () => {
    const desc = generateTargetDescription("CHOSEN_DAMAGED_CHARACTER");
    expect(desc).toBe("a damaged character");
  });

  it("should describe YOUR_CHARACTERS", () => {
    const desc = generateTargetDescription("YOUR_CHARACTERS");
    expect(desc).toBe("all your characters");
  });

  it("should describe SELF", () => {
    const desc = generateTargetDescription("SELF");
    expect(desc).toBe("this character");
  });

  it("should describe complex DSL with filters", () => {
    const dsl: LorcanaCharacterTarget = {
      cardType: "character",
      count: 2,
      filters: [{ type: "damaged" }, { comparison: "lte", type: "cost", value: 3 }],
      owner: "opponent",
      selector: "chosen",
    };
    const desc = generateTargetDescription(dsl);
    expect(desc).toContain("opposing");
    expect(desc).toContain("damaged");
    expect(desc).toContain("character");
    expect(desc).toContain("cost");
  });

  it("should describe DSL with keyword filter", () => {
    const dsl: LorcanaCharacterTarget = {
      cardType: "character",
      filters: [{ keyword: "Evasive", type: "has-keyword" }],
      owner: "you",
      selector: "all",
    };
    const desc = generateTargetDescription(dsl);
    expect(desc).toContain("your");
    expect(desc).toContain("Evasive");
    expect(desc).toContain("characters");
  });
});

describe("Target UI Hints", () => {
  it("should generate single selection hints for CHOSEN_CHARACTER", () => {
    const hints = getTargetUIHints("CHOSEN_CHARACTER");
    expect(hints.selectionType).toBe("single");
    expect(hints.minSelections).toBe(1);
    expect(hints.maxSelections).toBe(1);
    expect(hints.optional).toBe(false);
  });

  it("should generate automatic hints for ALL_OPPOSING_CHARACTERS", () => {
    const hints = getTargetUIHints("ALL_OPPOSING_CHARACTERS");
    expect(hints.selectionType).toBe("automatic");
    expect(hints.ownerFilter).toBe("opponent");
  });

  it("should generate no selection for SELF", () => {
    const hints = getTargetUIHints("SELF");
    expect(hints.selectionType).toBe("none");
  });

  it("should generate multiple selection hints for up-to count", () => {
    const dsl: LorcanaCharacterTarget = {
      cardType: "character",
      count: { upTo: 3 },
      selector: "chosen",
    };
    const hints = getTargetUIHints(dsl);
    expect(hints.selectionType).toBe("multiple");
    expect(hints.minSelections).toBe(0);
    expect(hints.maxSelections).toBe(3);
    expect(hints.optional).toBe(true);
  });

  it("should include card type in hints", () => {
    const hints = getTargetUIHints("CHOSEN_ITEM");
    expect(hints.cardType).toBe("item");
  });

  it("should include owner filter in hints", () => {
    const hints = getTargetUIHints("CHOSEN_OPPOSING_CHARACTER");
    expect(hints.ownerFilter).toBe("opponent");
  });

  it("should include prompt text", () => {
    const hints = getTargetUIHints("CHOSEN_CHARACTER");
    expect(hints.prompt).toContain("Choose");
  });
});

describe("Complex DSL Creation", () => {
  it("should create complex character target", () => {
    const target: LorcanaCardTarget = {
      cardType: "character",
      count: { upTo: 2 },
      filters: [{ type: "damaged" }, { comparison: "lte", type: "strength", value: 3 }],
      owner: "opponent",
      selector: "chosen",
      zones: ["play"],
    };

    expect(target.selector).toBe("chosen");
    expect(target.owner).toBe("opponent");
    expect(target.filters).toHaveLength(2);
  });

  it("should create target with context reference", () => {
    const target: LorcanaCardTarget = {
      cardType: "character",
      context: {
        self: true,
        triggerSource: false,
      },
      selector: "self",
    };

    expect(target.context?.self).toBe(true);
  });

  it("should create target with composite filters", () => {
    const target: LorcanaCardTarget = {
      cardType: "character",
      filters: [
        {
          filters: [{ type: "damaged" }, { type: "exerted" }],
          type: "or",
        },
      ],
      selector: "all",
    };

    expect(target.filters?.[0].type).toBe("or");
  });
});
