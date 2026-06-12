import { describe, test } from "vite-plus/test";
import { prb01NamiP053FullArt053 } from "../../../../../cards/src/cards/PRB01/characters/053-nami-p-053-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-053 Nami (P-053) (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01NamiP053FullArt053);
  });
});
