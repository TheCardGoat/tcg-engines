import { describe, test } from "vite-plus/test";
import { prb02SaboSt13007PirateFoil007 } from "../../../../../cards/src/cards/PRB02/characters/007-sabo-st13-007-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST13-007 Sabo - ST13-007 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SaboSt13007PirateFoil007);
  });
});
