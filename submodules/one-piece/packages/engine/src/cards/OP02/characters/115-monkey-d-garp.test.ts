import { describe, test } from "vite-plus/test";
import { op02MonkeyDGarp115 } from "../../../../../cards/src/cards/characters/op02-115-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-115 Monkey.D.Garp", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02MonkeyDGarp115);
  });
});
