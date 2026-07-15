import { describe, test } from "vite-plus/test";
import { op09Morley113 } from "../../../../../cards/src/cards/OP09/characters/113-morley.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-113 Morley", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Morley113);
  });
});
