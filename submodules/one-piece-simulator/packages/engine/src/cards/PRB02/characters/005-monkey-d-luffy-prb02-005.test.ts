import { describe, test } from "vite-plus/test";
import { prb02MonkeyDLuffyPrb02005005 } from "../../../../../cards/src/cards/PRB02/characters/005-monkey-d-luffy-prb02-005.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-005 Monkey.D.Luffy - PRB02-005", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MonkeyDLuffyPrb02005005);
  });
});
