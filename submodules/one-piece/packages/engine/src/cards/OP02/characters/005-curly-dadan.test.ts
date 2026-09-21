import { describe, test } from "vite-plus/test";
import { op02CurlyDadan005 } from "../../../../../cards/src/cards/characters/op02-005-curly-dadan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-005 Curly.Dadan", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02CurlyDadan005);
  });
});
