import { describe, test } from "vite-plus/test";
import { prb02MonkeyDLuffyP075PirateFoil075 } from "../../../../../cards/src/cards/PRB02/characters/075-monkey-d-luffy-p-075-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("P-075 Monkey.D.Luffy - P-075 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MonkeyDLuffyP075PirateFoil075);
  });
});
