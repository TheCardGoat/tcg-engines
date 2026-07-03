import { describe, test } from "vite-plus/test";
import { prb02MarshallDTeachSt17005PirateFoil005 } from "../../../../../cards/src/cards/PRB02/characters/005-marshall-d-teach-st17-005-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST17-005 Marshall.D.Teach - ST17-005 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MarshallDTeachSt17005PirateFoil005);
  });
});
