import { describe, test } from "vite-plus/test";
import { eb01Mr2BonKureiBentham061 } from "../../../../../cards/src/cards/EB01/characters/061-mr-2-bon-kurei-bentham.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-061 Mr.2.Bon.Kurei (Bentham)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Mr2BonKureiBentham061);
  });
});
