import { describe, test } from "vite-plus/test";
import { prb02EdwardNewgateSt13004PirateFoil004 } from "../../../../../cards/src/cards/PRB02/characters/004-edward-newgate-st13-004-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST13-004 Edward.Newgate - ST13-004 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02EdwardNewgateSt13004PirateFoil004);
  });
});
