import { describe, test } from "vite-plus/test";
import { prb02NicoRobinSt14007PirateFoil007 } from "../../../../../cards/src/cards/characters/st14-007-nico-robin-st14-007-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST14-007 Nico Robin - ST14-007 (Pirate Foil)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02NicoRobinSt14007PirateFoil007);
  });
});
