/**
 * Tests for format utilities
 */

import { describe, expect, test } from "bun:test";
import { formatJSON, formatTypeScript } from "./format-utils";

describe("Format Utils", () => {
  describe("formatTypeScript", () => {
    test("should format unformatted TypeScript code", async () => {
      const unformatted = "export const test={value:42,name:'test'};";

      const formatted = await formatTypeScript(unformatted);

      expect(formatted).toContain("test");
      expect(formatted).toContain("42");
      expect(formatted).toContain("test");
      // Should have proper formatting (spaces, newlines, etc.)
      expect(formatted.length).toBeGreaterThan(unformatted.length);
    });

    test("should handle already formatted code", async () => {
      const code = `export const test = {
	value: 42,
	name: "test",
};`;

      const formatted = await formatTypeScript(code);

      expect(formatted).toContain("test");
      expect(formatted).toContain("42");
    });

    test("should handle multi-line code", async () => {
      const code = `
export const card1 = { id: "1", name: "Card One" };
export const card2 = { id: "2", name: "Card Two" };
`;

      const formatted = await formatTypeScript(code);

      expect(formatted).toContain("card1");
      expect(formatted).toContain("card2");
    });

    test("should handle complex object structures", async () => {
      const code = `export const card={id:"test",properties:{nested:{deep:{value:42}}}};`;

      const formatted = await formatTypeScript(code);

      expect(formatted).toContain("nested");
      expect(formatted).toContain("deep");
      expect(formatted).toContain("value");
    });

    test("should handle arrays", async () => {
      const code = "export const list=[1,2,3,4,5];";

      const formatted = await formatTypeScript(code);

      expect(formatted).toContain("[");
      expect(formatted).toContain("]");
    });

    test("should handle functions", async () => {
      const code = "export function test(){return 42;}";

      const formatted = await formatTypeScript(code);

      expect(formatted).toContain("function");
      expect(formatted).toContain("test");
      expect(formatted).toContain("return");
    });

    test("should handle type annotations", async () => {
      const code = "export const test:number=42;";

      const formatted = await formatTypeScript(code);

      expect(formatted).toContain("number");
      expect(formatted).toContain("42");
    });
  });

  describe("formatJSON", () => {
    test("should format JSON with default indentation", () => {
      const obj = { id: "test", value: 42, nested: { key: "value" } };

      const formatted = formatJSON(obj);

      expect(formatted).toContain('"id"');
      expect(formatted).toContain('"test"');
      expect(formatted).toContain("42");
      expect(formatted).toContain('"nested"');
    });

    test("should format JSON with custom indentation", () => {
      const obj = { key: "value" };

      const formatted = formatJSON(obj, 4);

      expect(formatted).toContain('"key"');
      expect(formatted).toContain('"value"');
      // Should have 4-space indentation
      expect(formatted).toContain("    ");
    });

    test("should handle arrays", () => {
      const obj = { items: [1, 2, 3] };

      const formatted = formatJSON(obj);

      expect(formatted).toContain("[");
      expect(formatted).toContain("]");
      expect(formatted).toContain("1");
      expect(formatted).toContain("2");
      expect(formatted).toContain("3");
    });

    test("should handle nested objects", () => {
      const obj = {
        level1: {
          level2: {
            level3: {
              value: "deep",
            },
          },
        },
      };

      const formatted = formatJSON(obj);

      expect(formatted).toContain("level1");
      expect(formatted).toContain("level2");
      expect(formatted).toContain("level3");
      expect(formatted).toContain("deep");
    });
  });
});
