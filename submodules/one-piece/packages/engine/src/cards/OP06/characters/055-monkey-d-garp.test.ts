import { describe, test } from "vite-plus/test";
import { op06MonkeyDGarp055 } from "../../../../../cards/src/cards/OP06/characters/055-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-055 Monkey.D.Garp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06MonkeyDGarp055);
  });
});
