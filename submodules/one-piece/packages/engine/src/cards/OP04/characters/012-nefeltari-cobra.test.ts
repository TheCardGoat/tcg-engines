import { describe, test } from "vite-plus/test";
import { op04NefeltariCobra012 } from "../../../../../cards/src/cards/OP04/characters/012-nefeltari-cobra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-012 Nefeltari Cobra", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04NefeltariCobra012);
  });
});
