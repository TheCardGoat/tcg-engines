import { describe, test } from "vite-plus/test";
import { op02Rakuyo019 } from "../../../../../cards/src/cards/OP02/characters/019-rakuyo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-019 Rakuyo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Rakuyo019);
  });
});
