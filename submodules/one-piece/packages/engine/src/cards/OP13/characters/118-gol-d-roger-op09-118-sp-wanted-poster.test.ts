import { describe, test } from "vite-plus/test";
import { op13GolDRogerOp09118SpWantedPoster118 } from "../../../../../cards/src/cards/OP13/characters/118-gol-d-roger-op09-118-sp-wanted-poster.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-118 Gol.D.Roger - OP09-118 (SP) (Wanted Poster)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13GolDRogerOp09118SpWantedPoster118);
  });
});
