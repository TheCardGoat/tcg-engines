import { describe, test } from "vite-plus/test";
import { prb02MonetPirateFoil036 } from "../../../../../cards/src/cards/PRB02/characters/036-monet-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-036 Monet (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MonetPirateFoil036);
  });
});
