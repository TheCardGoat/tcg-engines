import { describe, test } from "vite-plus/test";
import { op07Shaka101 } from "../../../../../cards/src/cards/characters/op07-101-shaka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-101 Shaka", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Shaka101);
  });
});
