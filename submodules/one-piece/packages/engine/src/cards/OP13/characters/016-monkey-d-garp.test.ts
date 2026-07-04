import { describe, test } from "vite-plus/test";
import { op13MonkeyDGarp016 } from "../../../../../cards/src/cards/OP13/characters/016-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-016 Monkey.D.Garp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13MonkeyDGarp016);
  });
});
