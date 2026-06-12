import { describe, test } from "vite-plus/test";
import { prb01YamatoOp01121Reprint121 } from "../../../../../cards/src/cards/PRB01/characters/121-yamato-op01-121-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-121 Yamato (OP01-121) (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01YamatoOp01121Reprint121);
  });
});
