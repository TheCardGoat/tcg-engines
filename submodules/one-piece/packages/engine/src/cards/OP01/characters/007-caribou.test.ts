import { describe, test } from "vite-plus/test";
import { op01Caribou007 } from "../../../../../cards/src/cards/OP01/characters/007-caribou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-007 Caribou", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Caribou007);
  });
});
