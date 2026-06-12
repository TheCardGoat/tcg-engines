import { describe, test } from "vite-plus/test";
import { prb02LimejuicePirateFoil014 } from "../../../../../cards/src/cards/PRB02/characters/014-limejuice-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-014 Limejuice (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02LimejuicePirateFoil014);
  });
});
