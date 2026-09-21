import { describe, test } from "vite-plus/test";
import { op05Sarquiss026 } from "../../../../../cards/src/cards/characters/op05-026-sarquiss.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-026 Sarquiss", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Sarquiss026);
  });
});
