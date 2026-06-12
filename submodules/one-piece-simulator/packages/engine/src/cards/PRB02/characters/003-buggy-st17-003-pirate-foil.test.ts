import { describe, test } from "vite-plus/test";
import { prb02BuggySt17003PirateFoil003 } from "../../../../../cards/src/cards/PRB02/characters/003-buggy-st17-003-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST17-003 Buggy - ST17-003 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BuggySt17003PirateFoil003);
  });
});
