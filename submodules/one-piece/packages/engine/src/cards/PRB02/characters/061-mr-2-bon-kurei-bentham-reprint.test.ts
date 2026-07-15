import { describe, test } from "vite-plus/test";
import { prb02Mr2BonKureiBenthamReprint061 } from "../../../../../cards/src/cards/PRB02/characters/061-mr-2-bon-kurei-bentham-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-061 Mr.2.Bon.Kurei (Bentham) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Mr2BonKureiBenthamReprint061);
  });
});
