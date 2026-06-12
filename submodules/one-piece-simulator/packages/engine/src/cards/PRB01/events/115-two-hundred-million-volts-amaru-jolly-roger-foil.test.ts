import { describe, test } from "vite-plus/test";
import { prb01TwoHundredMillionVoltsAmaruJollyRogerFoil115 } from "../../../../../cards/src/cards/PRB01/events/115-two-hundred-million-volts-amaru-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-115 Two-Hundred Million Volts Amaru (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01TwoHundredMillionVoltsAmaruJollyRogerFoil115);
  });
});
