import { describe, test } from "vite-plus/test";
import { op07KeepOut018 } from "../../../../../cards/src/cards/OP07/events/018-keep-out.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-018 Keep Out", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07KeepOut018);
  });
});
