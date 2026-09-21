import { describe, test } from "vite-plus/test";
import { prb02PeronaPirateFoil005 } from "../../../../../cards/src/cards/characters/st12-005-perona-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST12-005 Perona (Pirate Foil)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02PeronaPirateFoil005);
  });
});
