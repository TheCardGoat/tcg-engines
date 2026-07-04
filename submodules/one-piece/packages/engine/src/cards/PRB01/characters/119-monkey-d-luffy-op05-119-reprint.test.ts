import { describe, test } from "vite-plus/test";
import { prb01MonkeyDLuffyOp05119Reprint119 } from "../../../../../cards/src/cards/PRB01/characters/119-monkey-d-luffy-op05-119-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-119 Monkey.D.Luffy (OP05-119) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01MonkeyDLuffyOp05119Reprint119);
  });
});
