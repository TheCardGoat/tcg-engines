import { describe, test } from "vite-plus/test";
import { op13Rakuyo055 } from "../../../../../cards/src/cards/OP13/characters/055-rakuyo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-055 Rakuyo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Rakuyo055);
  });
});
