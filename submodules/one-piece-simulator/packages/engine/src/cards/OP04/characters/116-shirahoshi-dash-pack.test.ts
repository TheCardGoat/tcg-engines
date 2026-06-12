import { describe, test } from "vite-plus/test";
import { op04ShirahoshiDashPack116 } from "../../../../../cards/src/cards/OP04/characters/116-shirahoshi-dash-pack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-116 Shirahoshi (Dash Pack)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04ShirahoshiDashPack116);
  });
});
