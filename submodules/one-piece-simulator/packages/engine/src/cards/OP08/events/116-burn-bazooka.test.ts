import { describe, test } from "vite-plus/test";
import { op08BurnBazooka116 } from "../../../../../cards/src/cards/OP08/events/116-burn-bazooka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-116 Burn Bazooka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08BurnBazooka116);
  });
});
