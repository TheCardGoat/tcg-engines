import { describe, test } from "vite-plus/test";
import { prb01KuzanOp02096Reprint096 } from "../../../../../cards/src/cards/PRB01/characters/096-kuzan-op02-096-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-096 Kuzan (OP02-096) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KuzanOp02096Reprint096);
  });
});
