import { describe, test } from "vite-plus/test";
import { prb02MonkeyDLuffySt13014PirateFoil014 } from "../../../../../cards/src/cards/PRB02/characters/014-monkey-d-luffy-st13-014-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST13-014 Monkey.D.Luffy - ST13-014 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MonkeyDLuffySt13014PirateFoil014);
  });
});
