import { describe, test } from "vite-plus/test";
import { prb02BlackVortexPirateFoil097 } from "../../../../../cards/src/cards/PRB02/events/097-black-vortex-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-097 Black Vortex (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BlackVortexPirateFoil097);
  });
});
