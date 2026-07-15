import { describe, test } from "vite-plus/test";
import { prb02BasilHawkinsOp10109Reprint109 } from "../../../../../cards/src/cards/PRB02/characters/109-basil-hawkins-op10-109-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-109 Basil Hawkins - OP10-109 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BasilHawkinsOp10109Reprint109);
  });
});
