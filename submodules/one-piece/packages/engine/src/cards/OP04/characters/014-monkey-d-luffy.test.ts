import { describe, test } from "vite-plus/test";
import { op04MonkeyDLuffy014 } from "../../../../../cards/src/cards/OP04/characters/014-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-014 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04MonkeyDLuffy014);
  });
});
