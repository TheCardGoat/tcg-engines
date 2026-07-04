import { describe, test } from "vite-plus/test";
import { prb02VinsmokeSoraPirateFoil063 } from "../../../../../cards/src/cards/PRB02/characters/063-vinsmoke-sora-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-063 Vinsmoke Sora (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02VinsmokeSoraPirateFoil063);
  });
});
