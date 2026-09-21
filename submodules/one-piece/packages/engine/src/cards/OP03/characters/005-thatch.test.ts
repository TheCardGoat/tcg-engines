import { describe, test } from "vite-plus/test";
import { op03Thatch005 } from "../../../../../cards/src/cards/characters/op03-005-thatch.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-005 Thatch", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Thatch005);
  });
});
