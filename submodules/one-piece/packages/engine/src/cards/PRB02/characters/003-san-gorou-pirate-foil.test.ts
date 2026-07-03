import { describe, test } from "vite-plus/test";
import { prb02SanGorouPirateFoil003 } from "../../../../../cards/src/cards/PRB02/characters/003-san-gorou-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST18-003 San-Gorou (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SanGorouPirateFoil003);
  });
});
