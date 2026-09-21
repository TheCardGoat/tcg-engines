import { describe, test } from "vite-plus/test";
import { op03Genzo046 } from "../../../../../cards/src/cards/characters/op03-046-genzo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-046 Genzo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Genzo046);
  });
});
