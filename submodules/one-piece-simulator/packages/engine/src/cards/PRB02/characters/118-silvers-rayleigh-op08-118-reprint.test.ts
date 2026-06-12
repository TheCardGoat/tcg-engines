import { describe, test } from "vite-plus/test";
import { prb02SilversRayleighOp08118Reprint118 } from "../../../../../cards/src/cards/PRB02/characters/118-silvers-rayleigh-op08-118-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-118 Silvers Rayleigh - OP08-118 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02SilversRayleighOp08118Reprint118);
  });
});
