import { describe, test } from "vite-plus/test";
import { prb02BennBeckmanReprint009 } from "../../../../../cards/src/cards/PRB02/characters/009-benn-beckman-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-009 Benn.Beckman (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BennBeckmanReprint009);
  });
});
