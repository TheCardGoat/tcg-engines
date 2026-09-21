import { describe, test } from "vite-plus/test";
import { op01Alvida064 } from "../../../../../cards/src/cards/characters/op01-064-alvida.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-064 Alvida", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Alvida064);
  });
});
