import { describe, test } from "vite-plus/test";
import { op14eb04TrafalgarLawOp14009009 } from "../../../../../cards/src/cards/OP14EB04/characters/009-trafalgar-law-op14-009.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-009 Trafalgar Law - OP14-009", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04TrafalgarLawOp14009009);
  });
});
