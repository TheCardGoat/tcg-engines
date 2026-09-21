import { describe, test } from "vite-plus/test";
import { eb03Alvida021 } from "../../../../../cards/src/cards/characters/eb03-021-alvida.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-021 Alvida", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Alvida021);
  });
});
