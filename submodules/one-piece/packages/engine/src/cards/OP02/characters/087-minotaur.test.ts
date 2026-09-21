import { describe, test } from "vite-plus/test";
import { op02Minotaur087 } from "../../../../../cards/src/cards/characters/op02-087-minotaur.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-087 Minotaur", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Minotaur087);
  });
});
