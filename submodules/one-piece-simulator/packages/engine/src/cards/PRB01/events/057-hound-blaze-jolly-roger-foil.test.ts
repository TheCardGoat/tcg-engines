import { describe, test } from "vite-plus/test";
import { prb01HoundBlazeJollyRogerFoil057 } from "../../../../../cards/src/cards/PRB01/events/057-hound-blaze-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-057 Hound Blaze (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01HoundBlazeJollyRogerFoil057);
  });
});
