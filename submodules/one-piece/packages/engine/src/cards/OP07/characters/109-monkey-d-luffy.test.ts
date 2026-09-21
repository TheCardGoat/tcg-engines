import { describe, test } from "vite-plus/test";
import { op07MonkeyDLuffy109 } from "../../../../../cards/src/cards/characters/op07-109-monkey-d-luffy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-109 Monkey.D.Luffy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MonkeyDLuffy109);
  });
});
