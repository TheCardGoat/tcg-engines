import { describe, test } from "vite-plus/test";
import { prb01TrafalgarLaw047 } from "../../../../../cards/src/cards/PRB01/characters/047-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-047 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01TrafalgarLaw047);
  });
});
