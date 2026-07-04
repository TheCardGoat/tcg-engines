import { describe, test } from "vite-plus/test";
import { op14eb04Mr2BonKureiBentham091 } from "../../../../../cards/src/cards/OP14EB04/characters/091-mr-2-bon-kurei-bentham.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-091 Mr.2.Bon.Kurei (Bentham)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04Mr2BonKureiBentham091);
  });
});
