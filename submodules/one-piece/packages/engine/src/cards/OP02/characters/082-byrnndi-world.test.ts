import { describe, test } from "vite-plus/test";
import { op02ByrnndiWorld082 } from "../../../../../cards/src/cards/characters/op02-082-byrnndi-world.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-082 Byrnndi World", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02ByrnndiWorld082);
  });
});
