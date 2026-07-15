import { describe, test } from "vite-plus/test";
import { prb02DraculeMihawkP081PirateFoil081 } from "../../../../../cards/src/cards/PRB02/characters/081-dracule-mihawk-p-081-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-081 Dracule Mihawk - P-081 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02DraculeMihawkP081PirateFoil081);
  });
});
