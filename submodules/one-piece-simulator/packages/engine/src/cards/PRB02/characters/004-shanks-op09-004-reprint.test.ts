import { describe, test } from "vite-plus/test";
import { prb02ShanksOp09004Reprint004 } from "../../../../../cards/src/cards/PRB02/characters/004-shanks-op09-004-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-004 Shanks - OP09-004 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ShanksOp09004Reprint004);
  });
});
