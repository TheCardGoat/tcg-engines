import { describe, test } from "vite-plus/test";
import { op10Leo057 } from "../../../../../cards/src/cards/OP10/characters/057-leo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-057 Leo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Leo057);
  });
});
