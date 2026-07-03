import { describe, test } from "vite-plus/test";
import { op13MonkeyDLuffyOp11058Tr058 } from "../../../../../cards/src/cards/OP13/characters/058-monkey-d-luffy-op11-058-tr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-058 Monkey.D.Luffy - OP11-058 (TR)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13MonkeyDLuffyOp11058Tr058);
  });
});
