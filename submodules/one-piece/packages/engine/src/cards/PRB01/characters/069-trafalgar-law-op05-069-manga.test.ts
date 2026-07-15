import { describe, test } from "vite-plus/test";
import { prb01TrafalgarLawOp05069Manga069 } from "../../../../../cards/src/cards/PRB01/characters/069-trafalgar-law-op05-069-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-069 Trafalgar Law (OP05-069) (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01TrafalgarLawOp05069Manga069);
  });
});
