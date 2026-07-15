import { describe, test } from "vite-plus/test";
import { prb01CharlotteSmoothieFullArt110 } from "../../../../../cards/src/cards/PRB01/characters/110-charlotte-smoothie-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-110 Charlotte Smoothie (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01CharlotteSmoothieFullArt110);
  });
});
