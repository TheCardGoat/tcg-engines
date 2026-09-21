import { describe, test } from "vite-plus/test";
import { op02TrafalgarLaw035 } from "../../../../../cards/src/cards/characters/op02-035-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-035 Trafalgar Law", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02TrafalgarLaw035);
  });
});
