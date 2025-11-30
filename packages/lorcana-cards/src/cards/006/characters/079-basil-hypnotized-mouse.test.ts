import { describe, expect, it } from "bun:test";
import { hasEvasive } from "@tcg/lorcana";
import { basilHypnotizedMouse } from "./079-basil-hypnotized-mouse";

describe("Basil - Hypnotized Mouse", () => {
  it("should have Evasive ability", () => {
    expect(hasEvasive(basilHypnotizedMouse)).toBe(true);
  });
});
