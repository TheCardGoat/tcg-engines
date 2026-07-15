import { describe, test } from "vite-plus/test";
import { op01MonkeyDLuffy003 } from "../../../../../cards/src/cards/OP01/leaders/003-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-003 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01MonkeyDLuffy003);
  });
});
