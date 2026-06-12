import { describe, test } from "vite-plus/test";
import { prb02SlaveArrowPirateFoil056 } from "../../../../../cards/src/cards/PRB02/events/056-slave-arrow-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-056 Slave Arrow (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SlaveArrowPirateFoil056);
  });
});
