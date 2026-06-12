import { describe, test } from "vite-plus/test";
import { eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030 } from "../../../../../cards/src/cards/EB02/events/030-and-that-s-when-somebody-makes-fun-of-their-friend-s-dream.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-030 And That's When Somebody Makes Fun of Their Friend's Dream!!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02AndThatSWhenSomebodyMakesFunOfTheirFriendSDream030);
  });
});
