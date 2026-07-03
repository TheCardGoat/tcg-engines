import { describe, test } from "vite-plus/test";
import { op03Gin024 } from "../../../../../cards/src/cards/OP03/characters/024-gin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-024 Gin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Gin024);
  });
});
