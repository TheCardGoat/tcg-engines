import { describe, test } from "vite-plus/test";
import { op08Jack084 } from "../../../../../cards/src/cards/characters/op08-084-jack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-084 Jack", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Jack084);
  });
});
