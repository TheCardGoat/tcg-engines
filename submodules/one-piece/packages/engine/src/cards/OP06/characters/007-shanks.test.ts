import { describe, test } from "vite-plus/test";
import { op06Shanks007 } from "../../../../../cards/src/cards/characters/op06-007-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-007 Shanks", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Shanks007);
  });
});
