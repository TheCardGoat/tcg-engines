import { describe, test } from "vite-plus/test";
import { op13Nekomamushi071 } from "../../../../../cards/src/cards/OP13/characters/071-nekomamushi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-071 Nekomamushi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Nekomamushi071);
  });
});
