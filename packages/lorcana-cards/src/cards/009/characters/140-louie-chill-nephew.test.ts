import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { louieChillNephew } from "./140-louie-chill-nephew";

describe("Louie - Chill Nephew", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(louieChillNephew, "Support")).toBe(true);
  });
});
