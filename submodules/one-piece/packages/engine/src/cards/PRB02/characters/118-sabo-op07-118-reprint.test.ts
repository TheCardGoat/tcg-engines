import { describe, test } from "vite-plus/test";
import { prb02SaboOp07118Reprint118 } from "../../../../../cards/src/cards/PRB02/characters/118-sabo-op07-118-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-118 Sabo - OP07-118 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SaboOp07118Reprint118);
  });
});
