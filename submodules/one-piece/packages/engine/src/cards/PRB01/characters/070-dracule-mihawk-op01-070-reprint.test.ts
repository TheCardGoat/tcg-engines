import { describe, test } from "vite-plus/test";
import { prb01DraculeMihawkOp01070Reprint070 } from "../../../../../cards/src/cards/PRB01/characters/070-dracule-mihawk-op01-070-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-070 Dracule Mihawk (OP01-070) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01DraculeMihawkOp01070Reprint070);
  });
});
