import { describe, test } from "vite-plus/test";
import { op05NefeltariCobra085 } from "../../../../../cards/src/cards/OP05/characters/085-nefeltari-cobra.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-085 Nefeltari Cobra", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05NefeltariCobra085);
  });
});
