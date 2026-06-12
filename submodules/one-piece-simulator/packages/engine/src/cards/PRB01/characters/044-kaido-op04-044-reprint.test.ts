import { describe, test } from "vite-plus/test";
import { prb01KaidoOp04044Reprint044 } from "../../../../../cards/src/cards/PRB01/characters/044-kaido-op04-044-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-044 Kaido (OP04-044) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KaidoOp04044Reprint044);
  });
});
