import { describe, test } from "vite-plus/test";
import { op09GetOutOfHere018 } from "../../../../../cards/src/cards/OP09/events/018-get-out-of-here.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-018 Get Out of Here!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09GetOutOfHere018);
  });
});
