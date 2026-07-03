import { describe, test } from "vite-plus/test";
import { op09TrafalgarLaw030 } from "../../../../../cards/src/cards/OP09/characters/030-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-030 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09TrafalgarLaw030);
  });
});
