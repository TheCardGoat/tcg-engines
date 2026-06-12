import { describe, test } from "vite-plus/test";
import { op10SenorPink067 } from "../../../../../cards/src/cards/OP10/characters/067-senor-pink.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-067 Senor Pink", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10SenorPink067);
  });
});
