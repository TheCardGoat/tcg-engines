import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { deweyShowyNephew } from "./139-dewey-showy-nephew";

describe("Dewey - Showy Nephew", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(deweyShowyNephew, "Support")).toBe(true);
  });
});
