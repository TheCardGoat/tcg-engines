import { describe, test } from "vite-plus/test";
import { eb03IKnewYouPeopleWereBehindThis049 } from "../../../../../cards/src/cards/EB03/events/049-i-knew-you-people-were-behind-this.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-049 I Knew You People Were Behind This.", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03IKnewYouPeopleWereBehindThis049);
  });
});
