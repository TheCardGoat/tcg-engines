import { describe, test } from "vite-plus/test";
import { op01Shanks120 } from "../../../../../cards/src/cards/OP01/characters/120-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-120 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Shanks120);
  });
});
