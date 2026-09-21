import { describe, test } from "vite-plus/test";
import { op07MaskedDeuce013 } from "../../../../../cards/src/cards/characters/op07-013-masked-deuce.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-013 Masked Deuce", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MaskedDeuce013);
  });
});
