import { describe, test } from "vite-plus/test";
import { prb01HelmeppoFullArt010 } from "../../../../../cards/src/cards/characters/st06-010-helmeppo-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST06-010 Helmeppo (Full Art)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01HelmeppoFullArt010);
  });
});
