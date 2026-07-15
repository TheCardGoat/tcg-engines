import { describe, test } from "vite-plus/test";
import { prb01KaidoOp05118Reprint118 } from "../../../../../cards/src/cards/PRB01/characters/118-kaido-op05-118-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-118 Kaido (OP05-118) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01KaidoOp05118Reprint118);
  });
});
