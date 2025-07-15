// Unit tests for validation and type safety functions

import type { ResolutionAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  isValidParsedClause,
  isValidParsedEffect,
  isValidResolutionAbility,
  validateAgainstEngineTypes,
  validateParsedClause,
  validateParsedEffect,
  validateParseResult,
  validateResolutionAbility,
} from "../parser";
import type { ParsedClause, ParsedEffect, ParseResult } from "../types";

describe("validateParsedEffect", () => {
  it("should validate a valid draw effect", () => {
    const effect: ParsedEffect = {
      type: "draw",
      amount: 1,
      parameters: {},
    };

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("should validate a valid damage effect", () => {
    const effect: ParsedEffect = {
      type: "damage",
      amount: 2,
      parameters: {
        targetText: "chosen character",
      },
    };

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("should validate a valid attribute effect", () => {
    const effect: ParsedEffect = {
      type: "attribute",
      amount: 2,
      parameters: {
        attribute: "strength",
        targetText: "chosen character",
      },
    };

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("should reject effect with missing type", () => {
    const effect = {
      amount: 1,
      parameters: {},
    } as any;

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Effect is missing required "type" property or type is not a string',
    );
  });

  it("should reject effect with missing parameters", () => {
    const effect = {
      type: "draw",
      amount: 1,
    } as any;

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Effect is missing required "parameters" property or parameters is not an object',
    );
  });

  it("should reject damage effect without amount", () => {
    const effect: ParsedEffect = {
      type: "damage",
      parameters: {
        targetText: "chosen character",
      },
    };

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Damage effect is missing required "amount" property',
    );
  });

  it("should reject damage effect without target text", () => {
    const effect: ParsedEffect = {
      type: "damage",
      amount: 2,
      parameters: {},
    };

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Damage effect is missing target text in parameters",
    );
  });

  it("should reject attribute effect with invalid attribute", () => {
    const effect: ParsedEffect = {
      type: "attribute",
      amount: 2,
      parameters: {
        attribute: "invalid",
        targetText: "chosen character",
      },
    };

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Attribute effect has invalid attribute type: invalid",
    );
  });

  it("should reject effect with invalid duration", () => {
    const effect: ParsedEffect = {
      type: "draw",
      amount: 1,
      duration: "invalid",
      parameters: {},
    };

    const result = validateParsedEffect(effect);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Effect has invalid duration: invalid");
  });
});

describe("validateParsedClause", () => {
  it("should validate a valid clause", () => {
    const clause: ParsedClause = {
      text: "Draw a card",
      type: "effect",
      effects: [
        {
          type: "draw",
          amount: 1,
          parameters: {},
        },
      ],
      dependencies: [],
    };

    const result = validateParsedClause(clause);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("should reject clause with missing text", () => {
    const clause = {
      type: "effect",
      effects: [],
      dependencies: [],
    } as any;

    const result = validateParsedClause(clause);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Clause is missing required "text" property or text is not a string',
    );
  });

  it("should reject clause with invalid type", () => {
    const clause: ParsedClause = {
      text: "Draw a card",
      type: "invalid" as any,
      effects: [],
      dependencies: [],
    };

    const result = validateParsedClause(clause);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain("Clause has invalid type: invalid");
  });

  it("should reject clause with invalid effects array", () => {
    const clause = {
      text: "Draw a card",
      type: "effect",
      effects: "not an array",
      dependencies: [],
    } as any;

    const result = validateParsedClause(clause);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Clause is missing required "effects" array or effects is not an array',
    );
  });

  it("should reject clause with invalid effect", () => {
    const clause: ParsedClause = {
      text: "Draw a card",
      type: "effect",
      effects: [
        {
          type: "damage",
          parameters: {}, // Missing required amount and targetText
        },
      ],
      dependencies: [],
    };

    const result = validateParsedClause(clause);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("Effect 1 in clause is invalid");
  });
});

describe("validateResolutionAbility", () => {
  it("should validate a valid resolution ability", () => {
    const ability: ResolutionAbility = {
      type: "resolution",
      effects: [
        {
          type: "draw",
          amount: 1,
          target: { type: "player", value: "self" },
        },
      ],
    };

    const result = validateResolutionAbility(ability);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("should reject ability with wrong type", () => {
    const ability = {
      type: "triggered",
      effects: [],
    } as any;

    const result = validateResolutionAbility(ability);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      "Expected resolution ability, got type: triggered",
    );
  });

  it("should reject ability with missing effects", () => {
    const ability = {
      type: "resolution",
    } as any;

    const result = validateResolutionAbility(ability);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Resolution ability is missing required "effects" array',
    );
  });

  it("should warn about ability with no effects", () => {
    const ability: ResolutionAbility = {
      type: "resolution",
      effects: [],
    };

    const result = validateResolutionAbility(ability);
    expect(result.isValid).toBe(true);
    expect(result.warnings).toContain("Resolution ability has no effects");
  });

  it("should reject effect with missing target", () => {
    const ability: ResolutionAbility = {
      type: "resolution",
      effects: [
        {
          type: "damage",
          amount: 2,
        } as any,
      ],
    };

    const result = validateResolutionAbility(ability);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Damage effect 1 is missing required "target" property',
    );
  });

  it("should reject damage effect with missing amount", () => {
    const ability: ResolutionAbility = {
      type: "resolution",
      effects: [
        {
          type: "damage",
          target: { type: "card", value: 1, filters: [] },
        } as any,
      ],
    };

    const result = validateResolutionAbility(ability);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain(
      'Damage effect 1 is missing required "amount" property',
    );
  });
});

describe("validateAgainstEngineTypes", () => {
  it("should validate abilities with known effect types", () => {
    const abilities: ResolutionAbility[] = [
      {
        type: "resolution",
        effects: [
          {
            type: "draw",
            amount: 1,
            target: { type: "player", value: "self" },
          },
          {
            type: "damage",
            amount: 2,
            target: { type: "card", value: 1, filters: [] },
          },
        ],
      },
    ];

    const result = validateAgainstEngineTypes(abilities);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it("should warn about unknown effect types", () => {
    const abilities: ResolutionAbility[] = [
      {
        type: "resolution",
        effects: [
          {
            type: "unknown",
            target: { type: "player", value: "self" },
          } as any,
        ],
      },
    ];

    const result = validateAgainstEngineTypes(abilities);
    expect(result.warnings).toContain(
      "Effect 1 in ability 1 uses unknown type: unknown",
    );
  });

  it("should warn about unknown attribute types", () => {
    const abilities: ResolutionAbility[] = [
      {
        type: "resolution",
        effects: [
          {
            type: "attribute",
            amount: 2,
            attribute: "unknown",
            target: { type: "card", value: 1, filters: [] },
          } as any,
        ],
      },
    ];

    const result = validateAgainstEngineTypes(abilities);
    expect(result.warnings).toContain(
      "Attribute effect 1 in ability 1 uses unknown attribute: unknown",
    );
  });

  it("should error on missing required properties", () => {
    const abilities: ResolutionAbility[] = [
      {
        type: "resolution",
        effects: [
          {
            type: "damage",
            amount: 2,
            // Missing target
          } as any,
        ],
      },
    ];

    const result = validateAgainstEngineTypes(abilities);
    expect(result.errors).toContain(
      "damage effect 1 in ability 1 is missing required target",
    );
  });
});

describe("Type Guards", () => {
  describe("isValidResolutionAbility", () => {
    it("should return true for valid resolution ability", () => {
      const ability: ResolutionAbility = {
        type: "resolution",
        effects: [
          {
            type: "draw",
            amount: 1,
            target: { type: "player", value: "self" },
          },
        ],
      };

      expect(isValidResolutionAbility(ability)).toBe(true);
    });

    it("should return false for invalid ability", () => {
      const ability = {
        type: "triggered",
        effects: [],
      };

      expect(isValidResolutionAbility(ability)).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isValidResolutionAbility(null)).toBe(false);
      expect(isValidResolutionAbility(undefined)).toBe(false);
    });
  });

  describe("isValidParsedEffect", () => {
    it("should return true for valid parsed effect", () => {
      const effect: ParsedEffect = {
        type: "draw",
        amount: 1,
        parameters: {},
      };

      expect(isValidParsedEffect(effect)).toBe(true);
    });

    it("should return false for invalid effect", () => {
      const effect = {
        amount: 1,
        // Missing type and parameters
      };

      expect(isValidParsedEffect(effect)).toBe(false);
    });
  });

  describe("isValidParsedClause", () => {
    it("should return true for valid parsed clause", () => {
      const clause: ParsedClause = {
        text: "Draw a card",
        type: "effect",
        effects: [
          {
            type: "draw",
            amount: 1,
            parameters: {},
          },
        ],
        dependencies: [],
      };

      expect(isValidParsedClause(clause)).toBe(true);
    });

    it("should return false for invalid clause", () => {
      const clause = {
        text: "Draw a card",
        // Missing type and effects
      };

      expect(isValidParsedClause(clause)).toBe(false);
    });
  });
});

describe("validateParseResult", () => {
  it("should validate a complete parse result", () => {
    const parseResult: ParseResult = {
      abilities: [
        {
          type: "resolution",
          effects: [
            {
              type: "draw",
              amount: 1,
              target: { type: "player", value: "self" },
            },
          ],
        },
      ],
      clauses: [
        {
          text: "Draw a card",
          type: "effect",
          effects: [
            {
              type: "draw",
              amount: 1,
              parameters: {},
            },
          ],
          dependencies: [],
        },
      ],
      warnings: [],
      errors: [],
    };

    const result = validateParseResult(parseResult);
    expect(result.isValid).toBe(true);
    expect(result.enhancedErrors).toEqual([]);
  });

  it("should accumulate validation errors from all components", () => {
    const parseResult: ParseResult = {
      abilities: [
        {
          type: "resolution",
          effects: [
            {
              type: "damage",
              amount: 2,
              // Missing target
            } as any,
          ],
        },
      ],
      clauses: [
        {
          text: "Deal damage",
          type: "effect",
          effects: [
            {
              type: "damage",
              // Missing amount and parameters
            } as any,
          ],
          dependencies: [],
        },
      ],
      warnings: ["Original warning"],
      errors: ["Original error"],
    };

    const result = validateParseResult(parseResult);
    expect(result.isValid).toBe(false);
    expect(result.enhancedErrors.length).toBeGreaterThan(1);
    expect(result.enhancedErrors).toContain("Original error");
    expect(result.enhancedWarnings).toContain("Original warning");
  });
});
