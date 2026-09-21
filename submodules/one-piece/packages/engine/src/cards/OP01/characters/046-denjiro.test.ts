import { describe, test } from "vite-plus/test";
import { op01Denjiro046 } from "../../../../../cards/src/cards/characters/op01-046-denjiro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-046 Denjiro", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Denjiro046);
  });
});
