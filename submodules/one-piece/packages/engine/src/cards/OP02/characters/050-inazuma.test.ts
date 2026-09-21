import { describe, test } from "vite-plus/test";
import { op02Inazuma050 } from "../../../../../cards/src/cards/characters/op02-050-inazuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-050 Inazuma", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Inazuma050);
  });
});
