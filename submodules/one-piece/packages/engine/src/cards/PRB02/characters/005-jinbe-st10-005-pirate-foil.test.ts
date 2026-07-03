import { describe, test } from "vite-plus/test";
import { prb02JinbeSt10005PirateFoil005 } from "../../../../../cards/src/cards/PRB02/characters/005-jinbe-st10-005-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST10-005 Jinbe - ST10-005 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JinbeSt10005PirateFoil005);
  });
});
