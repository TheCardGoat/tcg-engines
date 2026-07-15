import { describe, test } from "vite-plus/test";
import { eb01Spandine043 } from "../../../../../cards/src/cards/EB01/characters/043-spandine.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-043 Spandine", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Spandine043);
  });
});
