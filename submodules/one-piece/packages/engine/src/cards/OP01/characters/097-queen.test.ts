import { describe, test } from "vite-plus/test";
import { op01Queen097 } from "../../../../../cards/src/cards/characters/op01-097-queen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-097 Queen", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Queen097);
  });
});
