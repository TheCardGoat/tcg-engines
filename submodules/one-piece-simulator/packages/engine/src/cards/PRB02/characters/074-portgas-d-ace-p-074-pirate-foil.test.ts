import { describe, test } from "vite-plus/test";
import { prb02PortgasDAceP074PirateFoil074 } from "../../../../../cards/src/cards/PRB02/characters/074-portgas-d-ace-p-074-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-074 Portgas.D.Ace - P-074 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02PortgasDAceP074PirateFoil074);
  });
});
