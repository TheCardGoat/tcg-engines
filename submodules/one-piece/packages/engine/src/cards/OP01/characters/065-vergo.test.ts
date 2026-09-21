import { describe, test } from "vite-plus/test";
import { op01Vergo065 } from "../../../../../cards/src/cards/characters/op01-065-vergo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-065 Vergo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Vergo065);
  });
});
