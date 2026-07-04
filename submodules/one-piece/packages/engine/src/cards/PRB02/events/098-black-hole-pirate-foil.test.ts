import { describe, test } from "vite-plus/test";
import { prb02BlackHolePirateFoil098 } from "../../../../../cards/src/cards/PRB02/events/098-black-hole-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-098 Black Hole (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BlackHolePirateFoil098);
  });
});
