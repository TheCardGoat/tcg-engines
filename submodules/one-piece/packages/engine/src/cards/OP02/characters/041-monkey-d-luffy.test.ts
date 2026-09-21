import { describe, test } from "vite-plus/test";
import { op02MonkeyDLuffy041 } from "../../../../../cards/src/cards/characters/op02-041-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-041 Monkey.D.Luffy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02MonkeyDLuffy041);
  });
});
