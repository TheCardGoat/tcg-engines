import { describe, test } from "vite-plus/test";
import { prb02SilversRayleighOp09005Reprint005 } from "../../../../../cards/src/cards/PRB02/characters/005-silvers-rayleigh-op09-005-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-005 Silvers Rayleigh - OP09-005 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SilversRayleighOp09005Reprint005);
  });
});
