import { describe, test } from "vite-plus/test";
import { prb01TsuruJollyRogerFoil106 } from "../../../../../cards/src/cards/PRB01/characters/106-tsuru-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-106 Tsuru (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01TsuruJollyRogerFoil106);
  });
});
