import { describe, test } from "vite-plus/test";
import { prb01SaboOp05007Reprint007 } from "../../../../../cards/src/cards/PRB01/characters/007-sabo-op05-007-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-007 Sabo (OP05-007) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01SaboOp05007Reprint007);
  });
});
