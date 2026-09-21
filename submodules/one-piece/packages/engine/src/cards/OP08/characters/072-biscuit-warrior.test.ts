import { describe, test } from "vite-plus/test";
import { op08BiscuitWarrior072 } from "../../../../../cards/src/cards/characters/op08-072-biscuit-warrior.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-072 Biscuit Warrior", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08BiscuitWarrior072);
  });
});
