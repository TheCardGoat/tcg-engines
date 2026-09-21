import { describe, test } from "vite-plus/test";
import { op02Cabaji052 } from "../../../../../cards/src/cards/characters/op02-052-cabaji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-052 Cabaji", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Cabaji052);
  });
});
