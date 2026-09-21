import { describe, test } from "vite-plus/test";
import { op06SharkArrows040 } from "../../../../../cards/src/cards/events/op06-040-shark-arrows.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-040 Shark Arrows", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06SharkArrows040);
  });
});
