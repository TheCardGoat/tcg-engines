import { describe, test } from "vite-plus/test";
import { op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038 } from "../../../../../cards/src/cards/OP04/events/038-the-weak-do-not-have-the-right-to-choose-how-they-die.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-038 The Weak Do Not Have the Right to Choose How They Die!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04TheWeakDoNotHaveTheRightToChooseHowTheyDie038);
  });
});
