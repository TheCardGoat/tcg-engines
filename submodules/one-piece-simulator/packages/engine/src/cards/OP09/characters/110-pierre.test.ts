import { describe, test } from "vite-plus/test";
import { op09Pierre110 } from "../../../../../cards/src/cards/OP09/characters/110-pierre.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-110 Pierre", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Pierre110);
  });
});
