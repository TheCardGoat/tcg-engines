import { describe, test } from "vite-plus/test";
import { op03SixKingPistol097 } from "../../../../../cards/src/cards/OP03/events/097-six-king-pistol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-097 Six King Pistol", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03SixKingPistol097);
  });
});
