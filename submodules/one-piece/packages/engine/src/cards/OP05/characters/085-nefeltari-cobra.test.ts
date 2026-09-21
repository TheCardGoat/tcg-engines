import { describe, test } from "vite-plus/test";
import { op05NefeltariCobra085 } from "../../../../../cards/src/cards/characters/op05-085-nefeltari-cobra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-085 Nefeltari Cobra", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05NefeltariCobra085);
  });
});
