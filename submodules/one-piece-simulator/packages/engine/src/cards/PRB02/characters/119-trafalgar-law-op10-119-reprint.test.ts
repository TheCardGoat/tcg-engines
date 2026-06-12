import { describe, test } from "vite-plus/test";
import { prb02TrafalgarLawOp10119Reprint119 } from "../../../../../cards/src/cards/PRB02/characters/119-trafalgar-law-op10-119-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-119 Trafalgar Law - OP10-119 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TrafalgarLawOp10119Reprint119);
  });
});
