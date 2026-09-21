import { describe, test } from "vite-plus/test";
import { op10TrafalgarLaw022 } from "../../../../../cards/src/cards/leaders/op10-022-trafalgar-law.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-022 Trafalgar Law", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10TrafalgarLaw022);
  });
});
