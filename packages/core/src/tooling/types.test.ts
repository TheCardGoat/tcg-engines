/**
 * Tests for card tooling types
 */

import { describe, expect, test } from "bun:test";
import type { GeneratorOptions, ParserResult, ValidationResult } from "./types";

describe("Card Tooling Types", () => {
  describe("ParserResult", () => {
    test("should accept valid success result", () => {
      const result: ParserResult<string> = {
        success: true,
        data: "parsed data",
        warnings: [],
      };

      expect(result.success).toBe(true);
      expect(result.data).toBe("parsed data");
      expect(result.warnings).toEqual([]);
    });

    test("should accept success result with warnings", () => {
      const result: ParserResult<number> = {
        success: true,
        data: 42,
        warnings: ["Warning 1", "Warning 2"],
      };

      expect(result.success).toBe(true);
      expect(result.warnings).toHaveLength(2);
    });

    test("should accept valid error result", () => {
      const result: ParserResult<string> = {
        success: false,
        errors: ["Error 1", "Error 2"],
      };

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe("ValidationResult", () => {
    test("should accept valid validation success", () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
      };

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    test("should accept validation with warnings", () => {
      const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: ["Warning about formatting"],
      };

      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(1);
    });

    test("should accept validation failure", () => {
      const result: ValidationResult = {
        valid: false,
        errors: ["Missing required field"],
        warnings: ["Consider adding description"],
      };

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.warnings).toHaveLength(1);
    });
  });

  describe("GeneratorOptions", () => {
    test("should accept minimal options", () => {
      const options: GeneratorOptions = {
        outputDir: "./output",
      };

      expect(options.outputDir).toBe("./output");
    });

    test("should accept full options", () => {
      const options: GeneratorOptions = {
        outputDir: "./output",
        format: true,
        overwrite: true,
        dryRun: false,
      };

      expect(options.outputDir).toBe("./output");
      expect(options.format).toBe(true);
      expect(options.overwrite).toBe(true);
      expect(options.dryRun).toBe(false);
    });
  });
});
