import { describe, test } from "vite-plus/test";
import { prb02ShachiPenguinPirateFoil008 } from "../../../../../cards/src/cards/characters/st10-008-shachi-penguin-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST10-008 Shachi & Penguin (Pirate Foil)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ShachiPenguinPirateFoil008);
  });
});
