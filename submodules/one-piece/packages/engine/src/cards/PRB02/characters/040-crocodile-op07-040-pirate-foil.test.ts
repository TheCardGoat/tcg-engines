import { describe, test } from "vite-plus/test";
import { prb02CrocodileOp07040PirateFoil040 } from "../../../../../cards/src/cards/PRB02/characters/040-crocodile-op07-040-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-040 Crocodile - OP07-040 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CrocodileOp07040PirateFoil040);
  });
});
