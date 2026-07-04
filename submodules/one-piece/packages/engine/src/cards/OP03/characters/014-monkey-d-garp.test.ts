import { describe, test } from "vite-plus/test";
import { op03MonkeyDGarp014 } from "../../../../../cards/src/cards/OP03/characters/014-monkey-d-garp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-014 Monkey.D.Garp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03MonkeyDGarp014);
  });
});
