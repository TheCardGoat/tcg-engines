import { describe, test } from "vite-plus/test";
import { prb02BasilHawkinsOp07029Reprint029 } from "../../../../../cards/src/cards/PRB02/characters/029-basil-hawkins-op07-029-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-029 Basil Hawkins - OP07-029 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BasilHawkinsOp07029Reprint029);
  });
});
