import { describe, test } from "vite-plus/test";
import { op02Shiki075 } from "../../../../../cards/src/cards/OP02/characters/075-shiki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-075 Shiki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Shiki075);
  });
});
