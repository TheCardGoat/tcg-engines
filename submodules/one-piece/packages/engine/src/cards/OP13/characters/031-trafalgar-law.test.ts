import { describe, test } from "vite-plus/test";
import { op13TrafalgarLaw031 } from "../../../../../cards/src/cards/OP13/characters/031-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-031 Trafalgar Law", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13TrafalgarLaw031);
  });
});
