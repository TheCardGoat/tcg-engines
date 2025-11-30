import { describe, expect, it } from "bun:test";
import { hasBodyguard } from "@tcg/lorcana";
import { thePrinceVigilantSuitor } from "./024-the-prince-vigilant-suitor";

describe("The Prince - Vigilant Suitor", () => {
  it("should have Bodyguard ability", () => {
    expect(hasBodyguard(thePrinceVigilantSuitor)).toBe(true);
  });
});
