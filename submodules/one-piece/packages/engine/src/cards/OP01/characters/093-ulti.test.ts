import { describe, test } from "vite-plus/test";
import { op01Ulti093 } from "../../../../../cards/src/cards/characters/op01-093-ulti.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-093 Ulti", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Ulti093);
  });
});
