import { describe, test } from "vite-plus/test";
import { op09Sanji028 } from "../../../../../cards/src/cards/OP09/characters/028-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-028 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Sanji028);
  });
});
