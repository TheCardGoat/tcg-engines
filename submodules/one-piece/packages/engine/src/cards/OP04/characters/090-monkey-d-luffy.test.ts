import { describe, test } from "vite-plus/test";
import { op04MonkeyDLuffy090 } from "../../../../../cards/src/cards/OP04/characters/090-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-090 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04MonkeyDLuffy090);
  });
});
