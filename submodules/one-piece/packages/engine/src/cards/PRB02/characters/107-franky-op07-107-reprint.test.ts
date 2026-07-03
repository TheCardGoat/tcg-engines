import { describe, test } from "vite-plus/test";
import { prb02FrankyOp07107Reprint107 } from "../../../../../cards/src/cards/PRB02/characters/107-franky-op07-107-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-107 Franky - OP07-107 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02FrankyOp07107Reprint107);
  });
});
