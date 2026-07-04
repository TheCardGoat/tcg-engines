import { describe, test } from "vite-plus/test";
import { prb01UltiReprint043 } from "../../../../../cards/src/cards/PRB01/characters/043-ulti-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-043 Ulti (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01UltiReprint043);
  });
});
