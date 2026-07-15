import { describe, test } from "vite-plus/test";
import { op04Mr2BonKureiBentham069 } from "../../../../../cards/src/cards/OP04/characters/069-mr-2-bon-kurei-bentham.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-069 Mr.2.Bon.Kurei (Bentham)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Mr2BonKureiBentham069);
  });
});
