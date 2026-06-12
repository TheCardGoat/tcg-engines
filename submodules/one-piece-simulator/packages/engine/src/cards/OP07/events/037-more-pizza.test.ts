import { describe, test } from "vite-plus/test";
import { op07MorePizza037 } from "../../../../../cards/src/cards/OP07/events/037-more-pizza.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-037 More Pizza!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07MorePizza037);
  });
});
