import { describe, test } from "vite-plus/test";
import { op13MonkeyDLuffy001 } from "../../../../../cards/src/cards/OP13/leaders/001-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-001 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13MonkeyDLuffy001);
  });
});
