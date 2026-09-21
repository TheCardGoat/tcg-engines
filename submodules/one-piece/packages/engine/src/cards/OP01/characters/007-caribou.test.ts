import { describe, test } from "vite-plus/test";
import { op01Caribou007 } from "../../../../../cards/src/cards/characters/op01-007-caribou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-007 Caribou", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Caribou007);
  });
});
