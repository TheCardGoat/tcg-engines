import { describe, test } from "vite-plus/test";
import { op02Mr2BonKureiBentham064 } from "../../../../../cards/src/cards/OP02/characters/064-mr-2-bon-kurei-bentham.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-064 Mr.2.Bon.Kurei (Bentham)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Mr2BonKureiBentham064);
  });
});
