import { describe, test } from "vite-plus/test";
import { prb02TrafalgarLawOp09069Reprint069 } from "../../../../../cards/src/cards/PRB02/characters/069-trafalgar-law-op09-069-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-069 Trafalgar Law - OP09-069 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TrafalgarLawOp09069Reprint069);
  });
});
