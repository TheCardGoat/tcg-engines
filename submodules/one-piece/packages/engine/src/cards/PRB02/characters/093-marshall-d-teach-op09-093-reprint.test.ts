import { describe, test } from "vite-plus/test";
import { prb02MarshallDTeachOp09093Reprint093 } from "../../../../../cards/src/cards/PRB02/characters/093-marshall-d-teach-op09-093-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-093 Marshall.D.Teach - OP09-093 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02MarshallDTeachOp09093Reprint093);
  });
});
