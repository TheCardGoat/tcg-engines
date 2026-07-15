import { describe, test } from "vite-plus/test";
import { op05Sarquiss026 } from "../../../../../cards/src/cards/OP05/characters/026-sarquiss.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-026 Sarquiss", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Sarquiss026);
  });
});
