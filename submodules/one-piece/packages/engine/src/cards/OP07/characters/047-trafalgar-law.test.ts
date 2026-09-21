import { describe, test } from "vite-plus/test";
import { op07TrafalgarLaw047 } from "../../../../../cards/src/cards/characters/op07-047-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-047 Trafalgar Law", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07TrafalgarLaw047);
  });
});
