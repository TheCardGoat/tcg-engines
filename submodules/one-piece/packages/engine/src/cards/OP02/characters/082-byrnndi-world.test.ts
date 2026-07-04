import { describe, test } from "vite-plus/test";
import { op02ByrnndiWorld082 } from "../../../../../cards/src/cards/OP02/characters/082-byrnndi-world.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-082 Byrnndi World", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02ByrnndiWorld082);
  });
});
