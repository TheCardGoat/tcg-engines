import { describe, test } from "vite-plus/test";
import { op07SlowSlowBeamSword076 } from "../../../../../cards/src/cards/OP07/events/076-slow-slow-beam-sword.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-076 Slow-Slow Beam Sword", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07SlowSlowBeamSword076);
  });
});
