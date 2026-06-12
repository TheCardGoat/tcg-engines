import { describe, test } from "vite-plus/test";
import { prb02FrankyOp09072Reprint072 } from "../../../../../cards/src/cards/PRB02/characters/072-franky-op09-072-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-072 Franky - OP09-072 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02FrankyOp09072Reprint072);
  });
});
