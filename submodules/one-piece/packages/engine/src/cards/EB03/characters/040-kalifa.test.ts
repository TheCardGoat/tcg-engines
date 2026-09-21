import { describe, test } from "vite-plus/test";
import { eb03Kalifa040 } from "../../../../../cards/src/cards/characters/eb03-040-kalifa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-040 Kalifa", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Kalifa040);
  });
});
