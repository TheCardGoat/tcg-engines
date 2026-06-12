import { describe, test } from "vite-plus/test";
import { prb01GumGumRedRocJollyRogerFoil056 } from "../../../../../cards/src/cards/PRB01/events/056-gum-gum-red-roc-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-056 Gum-Gum Red Roc (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01GumGumRedRocJollyRogerFoil056);
  });
});
