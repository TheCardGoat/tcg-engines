import { describe, test } from "vite-plus/test";
import { op02Franky039 } from "../../../../../cards/src/cards/characters/op02-039-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-039 Franky", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Franky039);
  });
});
