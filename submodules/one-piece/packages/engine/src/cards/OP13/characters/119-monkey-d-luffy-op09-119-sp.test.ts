import { describe, test } from "vite-plus/test";
import { op13MonkeyDLuffyOp09119Sp119 } from "../../../../../cards/src/cards/OP13/characters/119-monkey-d-luffy-op09-119-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-119 Monkey.D.Luffy - OP09-119 (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13MonkeyDLuffyOp09119Sp119);
  });
});
