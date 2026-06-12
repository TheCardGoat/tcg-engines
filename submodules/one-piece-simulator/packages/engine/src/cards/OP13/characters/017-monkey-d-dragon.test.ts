import { describe, test } from "vite-plus/test";
import { op13MonkeyDDragon017 } from "../../../../../cards/src/cards/OP13/characters/017-monkey-d-dragon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-017 Monkey.D.Dragon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13MonkeyDDragon017);
  });
});
