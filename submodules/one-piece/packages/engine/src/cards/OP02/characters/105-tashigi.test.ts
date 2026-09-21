import { describe, test } from "vite-plus/test";
import { op02Tashigi105 } from "../../../../../cards/src/cards/characters/op02-105-tashigi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-105 Tashigi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Tashigi105);
  });
});
