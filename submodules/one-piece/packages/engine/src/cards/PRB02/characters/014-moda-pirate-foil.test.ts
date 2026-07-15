import { describe, test } from "vite-plus/test";
import { prb02ModaPirateFoil014 } from "../../../../../cards/src/cards/PRB02/characters/014-moda-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-014 Moda (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ModaPirateFoil014);
  });
});
