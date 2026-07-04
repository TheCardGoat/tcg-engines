import { describe, test } from "vite-plus/test";
import { op01Sanji013 } from "../../../../../cards/src/cards/OP01/characters/013-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-013 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Sanji013);
  });
});
