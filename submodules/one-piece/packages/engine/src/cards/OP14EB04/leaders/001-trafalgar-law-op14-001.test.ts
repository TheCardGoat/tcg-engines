import { describe, test } from "vite-plus/test";
import { op14eb04TrafalgarLawOp14001001 } from "../../../../../cards/src/cards/OP14EB04/leaders/001-trafalgar-law-op14-001.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-001 Trafalgar Law - OP14-001", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04TrafalgarLawOp14001001);
  });
});
