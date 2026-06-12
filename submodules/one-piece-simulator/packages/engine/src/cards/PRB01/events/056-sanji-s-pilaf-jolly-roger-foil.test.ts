import { describe, test } from "vite-plus/test";
import { prb01SanjiSPilafJollyRogerFoil056 } from "../../../../../cards/src/cards/PRB01/events/056-sanji-s-pilaf-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-056 Sanji's Pilaf (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01SanjiSPilafJollyRogerFoil056);
  });
});
