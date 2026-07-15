import { describe, test } from "vite-plus/test";
import { op11Coribou086 } from "../../../../../cards/src/cards/OP11/characters/086-coribou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-086 Coribou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Coribou086);
  });
});
