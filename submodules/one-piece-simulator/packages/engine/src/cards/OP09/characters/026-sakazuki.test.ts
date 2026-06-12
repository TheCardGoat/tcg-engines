import { describe, test } from "vite-plus/test";
import { op09Sakazuki026 } from "../../../../../cards/src/cards/OP09/characters/026-sakazuki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-026 Sakazuki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Sakazuki026);
  });
});
