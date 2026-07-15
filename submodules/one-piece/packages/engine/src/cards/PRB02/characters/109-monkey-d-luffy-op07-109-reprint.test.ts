import { describe, test } from "vite-plus/test";
import { prb02MonkeyDLuffyOp07109Reprint109 } from "../../../../../cards/src/cards/PRB02/characters/109-monkey-d-luffy-op07-109-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-109 Monkey.D.Luffy - OP07-109 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MonkeyDLuffyOp07109Reprint109);
  });
});
