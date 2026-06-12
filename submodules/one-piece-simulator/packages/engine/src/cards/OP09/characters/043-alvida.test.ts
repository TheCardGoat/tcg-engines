import { describe, test } from "vite-plus/test";
import { op09Alvida043 } from "../../../../../cards/src/cards/OP09/characters/043-alvida.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-043 Alvida", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Alvida043);
  });
});
