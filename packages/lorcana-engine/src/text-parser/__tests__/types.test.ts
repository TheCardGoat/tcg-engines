// Unit tests for type definitions and interfaces

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import type {
  EffectPattern,
  ParsedClause,
  ParsedEffect,
  ParseResult,
  ParserConfig,
} from "../types";

describe("Type Definitions", () => {
  it("should allow creating ParsedClause objects", () => {
    const clause: ParsedClause = {
      text: "Draw a card.",
      type: "effect",
      effects: [],
      dependencies: [],
    };

    expect(clause.text).toBe("Draw a card.");
    expect(clause.type).toBe("effect");
    expect(Array.isArray(clause.effects)).toBe(true);
    expect(Array.isArray(clause.dependencies)).toBe(true);
  });

  it("should allow creating ParsedEffect objects", () => {
    const effect: ParsedEffect = {
      type: "draw",
      amount: 1,
      parameters: {},
    };

    expect(effect.type).toBe("draw");
    expect(effect.amount).toBe(1);
    expect(typeof effect.parameters).toBe("object");
  });

  it("should allow creating EffectPattern objects", () => {
    const pattern: EffectPattern = {
      pattern: /draw (\d+) cards?/i,
      type: "draw",
      extractor: (match) => ({
        type: "draw",
        amount: Number.parseInt(match[1] || "1"),
        parameters: {},
      }),
    };

    expect(pattern.pattern instanceof RegExp).toBe(true);
    expect(pattern.type).toBe("draw");
    expect(typeof pattern.extractor).toBe("function");
  });

  it("should allow creating ParserConfig objects", () => {
    const config: ParserConfig = {
      debug: true,
      strictMode: false,
      customPatterns: {},
    };

    expect(config.debug).toBe(true);
    expect(config.strictMode).toBe(false);
    expect(typeof config.customPatterns).toBe("object");
  });

  it("should allow creating ParseResult objects", () => {
    const result: ParseResult = {
      abilities: [],
      warnings: [],
      errors: [],
      clauses: [],
    };

    expect(Array.isArray(result.abilities)).toBe(true);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.errors)).toBe(true);
    expect(Array.isArray(result.clauses)).toBe(true);
  });
});
