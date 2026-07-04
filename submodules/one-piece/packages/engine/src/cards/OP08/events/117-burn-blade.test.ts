import { describe, test } from "vite-plus/test";
import { op08BurnBlade117 } from "../../../../../cards/src/cards/OP08/events/117-burn-blade.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-117 Burn Blade", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08BurnBlade117);
  });
});
