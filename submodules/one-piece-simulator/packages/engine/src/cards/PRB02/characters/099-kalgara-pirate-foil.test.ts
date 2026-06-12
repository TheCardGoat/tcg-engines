import { describe, test } from "vite-plus/test";
import { prb02KalgaraPirateFoil099 } from "../../../../../cards/src/cards/PRB02/characters/099-kalgara-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-099 Kalgara (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02KalgaraPirateFoil099);
  });
});
