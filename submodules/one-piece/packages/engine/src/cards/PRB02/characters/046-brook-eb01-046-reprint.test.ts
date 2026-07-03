import { describe, test } from "vite-plus/test";
import { prb02BrookEb01046Reprint046 } from "../../../../../cards/src/cards/PRB02/characters/046-brook-eb01-046-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-046 Brook - EB01-046 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BrookEb01046Reprint046);
  });
});
