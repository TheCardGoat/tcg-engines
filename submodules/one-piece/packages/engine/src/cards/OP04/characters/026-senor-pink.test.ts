import { describe, test } from "vite-plus/test";
import { op04SenorPink026 } from "../../../../../cards/src/cards/OP04/characters/026-senor-pink.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-026 Senor Pink", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04SenorPink026);
  });
});
