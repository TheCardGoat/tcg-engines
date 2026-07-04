import { describe, test } from "vite-plus/test";
import { op01Vergo065 } from "../../../../../cards/src/cards/OP01/characters/065-vergo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-065 Vergo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Vergo065);
  });
});
