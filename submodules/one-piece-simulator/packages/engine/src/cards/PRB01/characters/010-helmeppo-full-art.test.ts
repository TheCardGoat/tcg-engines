import { describe, test } from "vite-plus/test";
import { prb01HelmeppoFullArt010 } from "../../../../../cards/src/cards/PRB01/characters/010-helmeppo-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST06-010 Helmeppo (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01HelmeppoFullArt010);
  });
});
