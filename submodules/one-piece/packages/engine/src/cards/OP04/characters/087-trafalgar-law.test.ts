import { describe, test } from "vite-plus/test";
import { op04TrafalgarLaw087 } from "../../../../../cards/src/cards/OP04/characters/087-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-087 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04TrafalgarLaw087);
  });
});
