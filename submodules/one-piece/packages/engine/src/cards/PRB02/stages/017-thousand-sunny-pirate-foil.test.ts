import { describe, test } from "vite-plus/test";
import { prb02ThousandSunnyPirateFoil017 } from "../../../../../cards/src/cards/stages/st14-017-thousand-sunny-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST14-017 Thousand Sunny (Pirate Foil)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ThousandSunnyPirateFoil017);
  });
});
