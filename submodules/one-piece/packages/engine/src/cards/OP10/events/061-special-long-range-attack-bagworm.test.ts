import { describe, test } from "vite-plus/test";
import { op10SpecialLongRangeAttackBagworm061 } from "../../../../../cards/src/cards/OP10/events/061-special-long-range-attack-bagworm.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-061 Special Long-Range Attack!! Bagworm", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10SpecialLongRangeAttackBagworm061);
  });
});
