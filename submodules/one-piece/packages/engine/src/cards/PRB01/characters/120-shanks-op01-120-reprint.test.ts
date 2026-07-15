import { describe, test } from "vite-plus/test";
import { prb01ShanksOp01120Reprint120 } from "../../../../../cards/src/cards/PRB01/characters/120-shanks-op01-120-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-120 Shanks (OP01-120) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01ShanksOp01120Reprint120);
  });
});
