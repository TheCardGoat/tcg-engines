import { describe, test } from "vite-plus/test";
import { op08TheEarthWillNotLose115 } from "../../../../../cards/src/cards/OP08/events/115-the-earth-will-not-lose.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-115 The Earth Will Not Lose!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08TheEarthWillNotLose115);
  });
});
