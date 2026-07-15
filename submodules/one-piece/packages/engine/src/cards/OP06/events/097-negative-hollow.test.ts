import { describe, test } from "vite-plus/test";
import { op06NegativeHollow097 } from "../../../../../cards/src/cards/OP06/events/097-negative-hollow.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-097 Negative Hollow", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06NegativeHollow097);
  });
});
