import { describe, test } from "vite-plus/test";
import { op12MonkeyDLuffy015 } from "../../../../../cards/src/cards/OP12/characters/015-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-015 Monkey.D.Luffy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12MonkeyDLuffy015);
  });
});
