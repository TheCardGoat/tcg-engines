import { describe, test } from "vite-plus/test";
import { op14eb04SenorPink065 } from "../../../../../cards/src/cards/OP14EB04/characters/065-senor-pink.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-065 Senor Pink", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04SenorPink065);
  });
});
