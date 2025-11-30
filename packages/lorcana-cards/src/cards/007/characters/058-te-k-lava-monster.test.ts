import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { teKLavaMonster } from "./058-te-k-lava-monster";

describe("Te Kā - Lava Monster", () => {
  it("should have Challenger 2 ability", () => {
    expect(hasKeyword(teKLavaMonster, "Challenger")).toBe(true);
  });
});
