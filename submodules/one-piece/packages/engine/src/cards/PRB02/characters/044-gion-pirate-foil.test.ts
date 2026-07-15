import { describe, test } from "vite-plus/test";
import { prb02GionPirateFoil044 } from "../../../../../cards/src/cards/PRB02/characters/044-gion-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-044 Gion (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GionPirateFoil044);
  });
});
