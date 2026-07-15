import { describe, test } from "vite-plus/test";
import { op13NeverExistedInTheFirstPlace098 } from "../../../../../cards/src/cards/OP13/events/098-never-existed-in-the-first-place.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-098 Never Existed... in the First Place...", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13NeverExistedInTheFirstPlace098);
  });
});
