import { describe, test } from "vite-plus/test";
import { op01Alvida064 } from "../../../../../cards/src/cards/OP01/characters/064-alvida.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-064 Alvida", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Alvida064);
  });
});
