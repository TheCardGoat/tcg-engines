import { describe, test } from "vite-plus/test";
import { op11MonkeyDLuffy118 } from "../../../../../cards/src/cards/OP11/characters/118-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-118 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11MonkeyDLuffy118);
  });
});
