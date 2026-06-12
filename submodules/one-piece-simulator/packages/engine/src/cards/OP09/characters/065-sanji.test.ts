import { describe, test } from "vite-plus/test";
import { op09Sanji065 } from "../../../../../cards/src/cards/OP09/characters/065-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-065 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Sanji065);
  });
});
