import { describe, test } from "vite-plus/test";
import { op09BonkPunch010 } from "../../../../../cards/src/cards/characters/op09-010-bonk-punch.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-010 Bonk Punch", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BonkPunch010);
  });
});
