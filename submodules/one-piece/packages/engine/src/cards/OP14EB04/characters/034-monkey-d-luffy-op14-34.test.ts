import { describe, test } from "vite-plus/test";
import { op14eb04MonkeyDLuffyOp1434034 } from "../../../../../cards/src/cards/OP14EB04/characters/034-monkey-d-luffy-op14-34.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-034 Monkey.D.Luffy - OP14-34", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04MonkeyDLuffyOp1434034);
  });
});
