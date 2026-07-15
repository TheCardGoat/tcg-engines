import { describe, test } from "vite-plus/test";
import { prb02SlowSlowBeamSwordPirateFoil076 } from "../../../../../cards/src/cards/PRB02/events/076-slow-slow-beam-sword-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-076 Slow-Slow Beam Sword (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SlowSlowBeamSwordPirateFoil076);
  });
});
