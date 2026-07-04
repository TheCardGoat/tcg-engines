import { describe, test } from "vite-plus/test";
import { op02MaskedDeuce017 } from "../../../../../cards/src/cards/OP02/characters/017-masked-deuce.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-017 Masked Deuce", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02MaskedDeuce017);
  });
});
