import { describe, test } from "vite-plus/test";
import { op07BlazeSlice116 } from "../../../../../cards/src/cards/OP07/events/116-blaze-slice.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-116 Blaze Slice", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BlazeSlice116);
  });
});
