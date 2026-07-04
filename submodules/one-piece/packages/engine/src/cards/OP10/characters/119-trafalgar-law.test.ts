import { describe, test } from "vite-plus/test";
import { op10TrafalgarLaw119 } from "../../../../../cards/src/cards/OP10/characters/119-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-119 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10TrafalgarLaw119);
  });
});
