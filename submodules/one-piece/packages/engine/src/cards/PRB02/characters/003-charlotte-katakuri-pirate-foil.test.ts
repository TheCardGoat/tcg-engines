import { describe, test } from "vite-plus/test";
import { prb02CharlotteKatakuriPirateFoil003 } from "../../../../../cards/src/cards/PRB02/characters/003-charlotte-katakuri-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST16-003 Charlotte Katakuri (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CharlotteKatakuriPirateFoil003);
  });
});
