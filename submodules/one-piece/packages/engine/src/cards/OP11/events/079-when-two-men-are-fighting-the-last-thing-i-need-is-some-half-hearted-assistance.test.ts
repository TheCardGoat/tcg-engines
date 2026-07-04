import { describe, test } from "vite-plus/test";
import { op11WhenTwoMenAreFightingTheLastThingINeedIsSomeHalfHeartedAssistance079 } from "../../../../../cards/src/cards/OP11/events/079-when-two-men-are-fighting-the-last-thing-i-need-is-some-half-hearted-assistance.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-079 When Two Men Are Fighting the Last Thing I Need Is Some Half-Hearted Assistance!!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11WhenTwoMenAreFightingTheLastThingINeedIsSomeHalfHeartedAssistance079);
  });
});
