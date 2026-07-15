import { describe, test } from "vite-plus/test";
import { prb02NojikoPirateFoil048 } from "../../../../../cards/src/cards/PRB02/characters/048-nojiko-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-048 Nojiko (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02NojikoPirateFoil048);
  });
});
