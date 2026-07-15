import { describe, test } from "vite-plus/test";
import { prb02SixKingPistolReprint097 } from "../../../../../cards/src/cards/PRB02/events/097-six-king-pistol-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-097 Six King Pistol (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SixKingPistolReprint097);
  });
});
