import { describe, test } from "vite-plus/test";
import { op09TrafalgarLaw030 } from "../../../../../cards/src/cards/characters/op09-030-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-030 Trafalgar Law", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09TrafalgarLaw030);
  });
});
