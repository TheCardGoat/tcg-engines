import { describe, test } from "vite-plus/test";
import { op09MonkeyDLuffy061 } from "../../../../../cards/src/cards/OP09/leaders/061-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-061 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MonkeyDLuffy061);
  });
});
