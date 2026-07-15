import { describe, test } from "vite-plus/test";
import { prb02MonkeyDLuffyEb02061Reprint061 } from "../../../../../cards/src/cards/PRB02/characters/061-monkey-d-luffy-eb02-061-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-061 Monkey.D.Luffy - EB02-061 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MonkeyDLuffyEb02061Reprint061);
  });
});
