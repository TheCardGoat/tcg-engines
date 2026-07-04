import { describe, test } from "vite-plus/test";
import { op09Sanji105 } from "../../../../../cards/src/cards/OP09/characters/105-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-105 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Sanji105);
  });
});
