import { describe, test } from "vite-plus/test";
import { prb02PlasticSurgeryShotSt12017PirateFoil017 } from "../../../../../cards/src/cards/PRB02/events/017-plastic-surgery-shot-st12-017-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST12-017 Plastic Surgery Shot - ST12-017 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02PlasticSurgeryShotSt12017PirateFoil017);
  });
});
