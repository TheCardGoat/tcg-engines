import { describe, test } from "vite-plus/test";
import { op12TrafalgarLaw073 } from "../../../../../cards/src/cards/OP12/characters/073-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-073 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12TrafalgarLaw073);
  });
});
