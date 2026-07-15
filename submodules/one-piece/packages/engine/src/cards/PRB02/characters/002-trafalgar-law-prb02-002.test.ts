import { describe, test } from "vite-plus/test";
import { prb02TrafalgarLawPrb02002002 } from "../../../../../cards/src/cards/PRB02/characters/002-trafalgar-law-prb02-002.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-002 Trafalgar Law - PRB02-002", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02TrafalgarLawPrb02002002);
  });
});
