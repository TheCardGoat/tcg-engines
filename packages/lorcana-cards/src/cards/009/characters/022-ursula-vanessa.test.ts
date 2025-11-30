import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { ursulaVanessa } from "./022-ursula-vanessa";

describe("Ursula - Vanessa", () => {
  it("should have Singer 4 ability", () => {
    expect(hasKeyword(ursulaVanessa, "Singer")).toBe(true);
  });
});
