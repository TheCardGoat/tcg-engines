import { describe, test } from "vite-plus/test";
import { prb01BoaHancockOp01078Reprint078 } from "../../../../../cards/src/cards/PRB01/characters/078-boa-hancock-op01-078-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-078 Boa Hancock (OP01-078) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BoaHancockOp01078Reprint078);
  });
});
