import { describe, test } from "vite-plus/test";
import { prb02SaboP073PirateFoil073 } from "../../../../../cards/src/cards/PRB02/characters/073-sabo-p-073-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-073 Sabo - P-073 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SaboP073PirateFoil073);
  });
});
