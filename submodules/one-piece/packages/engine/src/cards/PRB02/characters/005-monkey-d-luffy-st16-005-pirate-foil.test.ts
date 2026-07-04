import { describe, test } from "vite-plus/test";
import { prb02MonkeyDLuffySt16005PirateFoil005 } from "../../../../../cards/src/cards/PRB02/characters/005-monkey-d-luffy-st16-005-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST16-005 Monkey.D.Luffy - ST16-005 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MonkeyDLuffySt16005PirateFoil005);
  });
});
