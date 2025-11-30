import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { eilonwyPrincessOfLlyr } from "./007-eilonwy-princess-of-llyr";

describe("Eilonwy - Princess of Llyr", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(eilonwyPrincessOfLlyr, "Support")).toBe(true);
  });
});
