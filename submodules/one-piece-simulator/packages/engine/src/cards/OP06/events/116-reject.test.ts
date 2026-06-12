import { describe, test } from "vite-plus/test";
import { op06Reject116 } from "../../../../../cards/src/cards/OP06/events/116-reject.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-116 Reject", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Reject116);
  });
});
