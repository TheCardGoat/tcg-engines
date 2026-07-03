import { describe, test } from "vite-plus/test";
import { op01Overheat086 } from "../../../../../cards/src/cards/OP01/events/086-overheat.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-086 Overheat", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Overheat086);
  });
});
