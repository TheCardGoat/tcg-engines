import { describe, test } from "vite-plus/test";
import { op12Gin068 } from "../../../../../cards/src/cards/OP12/characters/068-gin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-068 Gin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Gin068);
  });
});
