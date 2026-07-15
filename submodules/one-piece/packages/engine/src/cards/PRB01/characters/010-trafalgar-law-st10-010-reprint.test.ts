import { describe, test } from "vite-plus/test";
import { prb01TrafalgarLawSt10010Reprint010 } from "../../../../../cards/src/cards/PRB01/characters/010-trafalgar-law-st10-010-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST10-010 Trafalgar Law (ST10-010) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01TrafalgarLawSt10010Reprint010);
  });
});
