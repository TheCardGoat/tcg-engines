import { describe, test } from "vite-plus/test";
import { prb02GravityBladeRagingTigerReprint058 } from "../../../../../cards/src/cards/PRB02/events/058-gravity-blade-raging-tiger-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-058 Gravity Blade Raging Tiger (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GravityBladeRagingTigerReprint058);
  });
});
