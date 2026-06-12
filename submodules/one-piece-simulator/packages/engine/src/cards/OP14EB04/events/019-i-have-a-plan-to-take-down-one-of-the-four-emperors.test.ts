import { describe, test } from "vite-plus/test";
import { op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019 } from "../../../../../cards/src/cards/OP14EB04/events/019-i-have-a-plan-to-take-down-one-of-the-four-emperors.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-019 I Have a Plan to Take Down One of the Four Emperors!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04IHaveAPlanToTakeDownOneOfTheFourEmperors019);
  });
});
