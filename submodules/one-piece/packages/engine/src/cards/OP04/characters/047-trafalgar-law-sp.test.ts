import { describe, test } from "vite-plus/test";
import { op04TrafalgarLawSp047 } from "../../../../../cards/src/cards/OP04/characters/047-trafalgar-law-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-047 Trafalgar Law (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04TrafalgarLawSp047);
  });
});
