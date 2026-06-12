import { describe, test } from "vite-plus/test";
import { op14eb04MonkeyDLuffyOp14013013 } from "../../../../../cards/src/cards/OP14EB04/characters/013-monkey-d-luffy-op14-013.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-013 Monkey.D.Luffy - OP14-013", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04MonkeyDLuffyOp14013013);
  });
});
