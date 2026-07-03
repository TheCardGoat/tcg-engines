import { describe, test } from "vite-plus/test";
import { op06GravityBladeRagingTiger058 } from "../../../../../cards/src/cards/OP06/events/058-gravity-blade-raging-tiger.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-058 Gravity Blade Raging Tiger", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06GravityBladeRagingTiger058);
  });
});
