import { describe, test } from "vite-plus/test";
import { op03Hatchan033 } from "../../../../../cards/src/cards/characters/op03-033-hatchan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-033 Hatchan", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Hatchan033);
  });
});
