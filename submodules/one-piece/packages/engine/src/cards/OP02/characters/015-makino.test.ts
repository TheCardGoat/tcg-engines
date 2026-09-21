import { describe, test } from "vite-plus/test";
import { op02Makino015 } from "../../../../../cards/src/cards/characters/op02-015-makino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-015 Makino", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Makino015);
  });
});
