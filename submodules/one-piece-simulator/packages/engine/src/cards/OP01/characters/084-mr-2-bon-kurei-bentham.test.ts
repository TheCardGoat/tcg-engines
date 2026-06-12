import { describe, test } from "vite-plus/test";
import { op01Mr2BonKureiBentham084 } from "../../../../../cards/src/cards/OP01/characters/084-mr-2-bon-kurei-bentham.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-084 Mr.2.Bon.Kurei (Bentham)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Mr2BonKureiBentham084);
  });
});
