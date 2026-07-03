import { describe, test } from "vite-plus/test";
import { op09Lindbergh114 } from "../../../../../cards/src/cards/OP09/characters/114-lindbergh.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-114 Lindbergh", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Lindbergh114);
  });
});
