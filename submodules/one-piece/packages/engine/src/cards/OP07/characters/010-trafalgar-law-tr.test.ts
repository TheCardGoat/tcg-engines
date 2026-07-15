import { describe, test } from "vite-plus/test";
import { op07TrafalgarLawTr010 } from "../../../../../cards/src/cards/OP07/characters/010-trafalgar-law-tr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST10-010 Trafalgar Law (TR)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07TrafalgarLawTr010);
  });
});
