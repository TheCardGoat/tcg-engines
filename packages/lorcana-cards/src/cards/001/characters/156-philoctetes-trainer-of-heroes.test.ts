import { describe, expect, it } from "bun:test";
import { hasKeyword } from "@tcg/lorcana";
import { philoctetesTrainerOfHeroes } from "./156-philoctetes-trainer-of-heroes";

describe("Philoctetes - Trainer of Heroes", () => {
  it("should have Support ability", () => {
    expect(hasKeyword(philoctetesTrainerOfHeroes, "Support")).toBe(true);
  });
});
