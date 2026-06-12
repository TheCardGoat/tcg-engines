import { describe, test } from "vite-plus/test";
import { prb02BrookSt01011PirateFoil011 } from "../../../../../cards/src/cards/PRB02/characters/011-brook-st01-011-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST01-011 Brook - ST01-011 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BrookSt01011PirateFoil011);
  });
});
