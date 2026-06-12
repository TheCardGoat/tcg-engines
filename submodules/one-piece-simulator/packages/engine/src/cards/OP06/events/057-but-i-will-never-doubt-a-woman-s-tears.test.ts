import { describe, test } from "vite-plus/test";
import { op06ButIWillNeverDoubtAWomanSTears057 } from "../../../../../cards/src/cards/OP06/events/057-but-i-will-never-doubt-a-woman-s-tears.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-057 But I Will Never Doubt a Woman's Tears!!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06ButIWillNeverDoubtAWomanSTears057);
  });
});
