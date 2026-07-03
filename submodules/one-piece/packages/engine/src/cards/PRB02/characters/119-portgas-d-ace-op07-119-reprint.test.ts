import { describe, test } from "vite-plus/test";
import { prb02PortgasDAceOp07119Reprint119 } from "../../../../../cards/src/cards/PRB02/characters/119-portgas-d-ace-op07-119-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-119 Portgas.D.Ace - OP07-119 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02PortgasDAceOp07119Reprint119);
  });
});
