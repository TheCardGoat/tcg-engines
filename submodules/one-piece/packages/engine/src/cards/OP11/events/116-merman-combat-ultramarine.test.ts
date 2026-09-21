import { describe, test } from "vite-plus/test";
import { op11MermanCombatUltramarine116 } from "../../../../../cards/src/cards/events/op11-116-merman-combat-ultramarine.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-116 Merman Combat Ultramarine", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11MermanCombatUltramarine116);
  });
});
