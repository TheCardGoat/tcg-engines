import { describe, test } from "vite-plus/test";
import { op09NobodyHurtsAFriendOfMine019 } from "../../../../../cards/src/cards/OP09/events/019-nobody-hurts-a-friend-of-mine.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-019 Nobody Hurts a Friend of Mine!!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09NobodyHurtsAFriendOfMine019);
  });
});
