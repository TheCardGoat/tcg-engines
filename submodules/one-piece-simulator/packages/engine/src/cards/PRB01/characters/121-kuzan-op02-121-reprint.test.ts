import { describe, test } from "vite-plus/test";
import { prb01KuzanOp02121Reprint121 } from "../../../../../cards/src/cards/PRB01/characters/121-kuzan-op02-121-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-121 Kuzan (OP02-121) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KuzanOp02121Reprint121);
  });
});
