import { describe, test } from "vite-plus/test";
import { prb01TheBillionFoldWorldTrichiliocosmJollyRogerFoil038 } from "../../../../../cards/src/cards/PRB01/events/038-the-billion-fold-world-trichiliocosm-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-038 The Billion-fold World Trichiliocosm (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01TheBillionFoldWorldTrichiliocosmJollyRogerFoil038);
  });
});
