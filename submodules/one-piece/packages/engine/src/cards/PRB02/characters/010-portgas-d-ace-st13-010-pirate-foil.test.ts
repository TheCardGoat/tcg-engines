import { describe, test } from "vite-plus/test";
import { prb02PortgasDAceSt13010PirateFoil010 } from "../../../../../cards/src/cards/PRB02/characters/010-portgas-d-ace-st13-010-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST13-010 Portgas.D.Ace - ST13-010 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02PortgasDAceSt13010PirateFoil010);
  });
});
