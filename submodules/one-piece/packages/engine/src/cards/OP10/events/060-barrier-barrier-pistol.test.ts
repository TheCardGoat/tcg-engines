import { describe, test } from "vite-plus/test";
import { op10BarrierBarrierPistol060 } from "../../../../../cards/src/cards/events/op10-060-barrier-barrier-pistol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-060 Barrier-Barrier Pistol", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10BarrierBarrierPistol060);
  });
});
