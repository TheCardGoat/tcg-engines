import { describe, test } from "vite-plus/test";
import { prb02DraculeMihawkOp09048Reprint048 } from "../../../../../cards/src/cards/PRB02/characters/048-dracule-mihawk-op09-048-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-048 Dracule Mihawk - OP09-048 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02DraculeMihawkOp09048Reprint048);
  });
});
