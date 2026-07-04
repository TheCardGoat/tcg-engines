import { describe, test } from "vite-plus/test";
import { op13NefeltariCobra011 } from "../../../../../cards/src/cards/OP13/characters/011-nefeltari-cobra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-011 Nefeltari Cobra", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13NefeltariCobra011);
  });
});
