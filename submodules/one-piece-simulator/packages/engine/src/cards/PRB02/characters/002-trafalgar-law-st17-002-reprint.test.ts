import { describe, test } from "vite-plus/test";
import { prb02TrafalgarLawSt17002Reprint002 } from "../../../../../cards/src/cards/PRB02/characters/002-trafalgar-law-st17-002-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST17-002 Trafalgar Law - ST17-002 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TrafalgarLawSt17002Reprint002);
  });
});
