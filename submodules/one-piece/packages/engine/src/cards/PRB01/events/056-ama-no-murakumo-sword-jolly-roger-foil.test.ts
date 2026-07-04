import { describe, test } from "vite-plus/test";
import { prb01AmaNoMurakumoSwordJollyRogerFoil056 } from "../../../../../cards/src/cards/PRB01/events/056-ama-no-murakumo-sword-jolly-roger-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-056 Ama no Murakumo Sword (Jolly Roger Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01AmaNoMurakumoSwordJollyRogerFoil056);
  });
});
