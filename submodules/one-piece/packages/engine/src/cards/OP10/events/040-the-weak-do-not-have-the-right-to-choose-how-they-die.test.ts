import { describe, test } from "vite-plus/test";
import { op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040 } from "../../../../../cards/src/cards/OP10/events/040-the-weak-do-not-have-the-right-to-choose-how-they-die.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-040 The Weak Do Not Have the Right to Choose How They Die", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040);
  });
});
