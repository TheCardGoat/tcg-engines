import { describe, test } from "vite-plus/test";
import { op01TrafalgarLaw002 } from "../../../../../cards/src/cards/leaders/op01-002-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-002 Trafalgar Law", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01TrafalgarLaw002);
  });
});
