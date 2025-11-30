import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { lenaSabrewingRebelliousTeenager } from "./043-lena-sabrewing-rebellious-teenager";

describe("Lena Sabrewing - Rebellious Teenager", () => {
  it("should have Rush ability", () => {
    expect(hasRush(lenaSabrewingRebelliousTeenager)).toBe(true);
  });
});
