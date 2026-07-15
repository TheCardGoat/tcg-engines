import { describe, test } from "vite-plus/test";
import { op09BonkPunch010 } from "../../../../../cards/src/cards/OP09/characters/010-bonk-punch.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-010 Bonk Punch", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BonkPunch010);
  });
});
