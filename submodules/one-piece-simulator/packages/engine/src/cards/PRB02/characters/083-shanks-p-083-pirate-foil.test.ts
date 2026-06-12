import { describe, test } from "vite-plus/test";
import { prb02ShanksP083PirateFoil083 } from "../../../../../cards/src/cards/PRB02/characters/083-shanks-p-083-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-083 Shanks - P-083 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ShanksP083PirateFoil083);
  });
});
