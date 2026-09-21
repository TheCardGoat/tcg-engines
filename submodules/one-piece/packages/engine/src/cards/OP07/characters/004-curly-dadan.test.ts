import { describe, test } from "vite-plus/test";
import { op07CurlyDadan004 } from "../../../../../cards/src/cards/characters/op07-004-curly-dadan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-004 Curly.Dadan", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07CurlyDadan004);
  });
});
