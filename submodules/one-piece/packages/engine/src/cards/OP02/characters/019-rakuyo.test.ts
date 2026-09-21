import { describe, test } from "vite-plus/test";
import { op02Rakuyo019 } from "../../../../../cards/src/cards/characters/op02-019-rakuyo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-019 Rakuyo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Rakuyo019);
  });
});
