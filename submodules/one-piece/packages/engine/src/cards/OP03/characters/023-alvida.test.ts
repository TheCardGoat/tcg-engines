import { describe, test } from "vite-plus/test";
import { op03Alvida023 } from "../../../../../cards/src/cards/characters/op03-023-alvida.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-023 Alvida", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Alvida023);
  });
});
