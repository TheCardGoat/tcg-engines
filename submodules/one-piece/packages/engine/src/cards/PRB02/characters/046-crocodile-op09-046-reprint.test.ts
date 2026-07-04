import { describe, test } from "vite-plus/test";
import { prb02CrocodileOp09046Reprint046 } from "../../../../../cards/src/cards/PRB02/characters/046-crocodile-op09-046-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-046 Crocodile - OP09-046 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CrocodileOp09046Reprint046);
  });
});
