import { describe, test } from "vite-plus/test";
import { prb02AmaNoMurakumoSwordPirateFoil056 } from "../../../../../cards/src/cards/PRB02/events/056-ama-no-murakumo-sword-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-056 Ama no Murakumo Sword (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02AmaNoMurakumoSwordPirateFoil056);
  });
});
