import { describe, test } from "vite-plus/test";
import { prb02KyrosReprint046 } from "../../../../../cards/src/cards/PRB02/characters/046-kyros-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-046 Kyros (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02KyrosReprint046);
  });
});
