import { describe, test } from "vite-plus/test";
import { op10Sanji005 } from "../../../../../cards/src/cards/OP10/characters/005-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-005 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Sanji005);
  });
});
