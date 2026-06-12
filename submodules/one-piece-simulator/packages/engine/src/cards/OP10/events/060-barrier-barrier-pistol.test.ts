import { describe, test } from "vite-plus/test";
import { op10BarrierBarrierPistol060 } from "../../../../../cards/src/cards/OP10/events/060-barrier-barrier-pistol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-060 Barrier-Barrier Pistol", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10BarrierBarrierPistol060);
  });
});
