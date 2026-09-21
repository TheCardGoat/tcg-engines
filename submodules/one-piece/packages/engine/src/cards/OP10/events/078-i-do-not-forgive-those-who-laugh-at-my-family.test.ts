import { describe, test } from "vite-plus/test";
import { op10IDoNotForgiveThoseWhoLaughAtMyFamily078 } from "../../../../../cards/src/cards/events/op10-078-i-do-not-forgive-those-who-laugh-at-my-family.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-078 I Do Not Forgive Those Who Laugh at My Family!!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10IDoNotForgiveThoseWhoLaughAtMyFamily078);
  });
});
