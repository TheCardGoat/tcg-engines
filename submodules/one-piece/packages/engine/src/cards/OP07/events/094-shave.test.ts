import { describe, test } from "vite-plus/test";
import { op07Shave094 } from "../../../../../cards/src/cards/events/op07-094-shave.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-094 Shave", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Shave094);
  });
});
