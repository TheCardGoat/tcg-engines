import { describe, test } from "vite-plus/test";
import { prb02LimPirateFoil079 } from "../../../../../cards/src/cards/PRB02/characters/079-lim-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-079 Lim (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02LimPirateFoil079);
  });
});
