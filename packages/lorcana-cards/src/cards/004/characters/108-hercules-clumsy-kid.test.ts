import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { herculesClumsyKid } from "./108-hercules-clumsy-kid";

describe("Hercules - Clumsy Kid", () => {
  it("should have Rush ability", () => {
    expect(hasRush(herculesClumsyKid)).toBe(true);
  });
});
