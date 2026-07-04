import { describe, test } from "vite-plus/test";
import { op01BaoHuang105 } from "../../../../../cards/src/cards/OP01/characters/105-bao-huang.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-105 Bao Huang", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01BaoHuang105);
  });
});
