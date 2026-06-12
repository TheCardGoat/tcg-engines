import { describe, test } from "vite-plus/test";
import { op02CurlyDadan005 } from "../../../../../cards/src/cards/OP02/characters/005-curly-dadan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-005 Curly.Dadan", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02CurlyDadan005);
  });
});
