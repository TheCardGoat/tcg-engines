import { describe, test } from "vite-plus/test";
import { op02Komille097 } from "../../../../../cards/src/cards/OP02/characters/097-komille.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-097 Komille", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Komille097);
  });
});
