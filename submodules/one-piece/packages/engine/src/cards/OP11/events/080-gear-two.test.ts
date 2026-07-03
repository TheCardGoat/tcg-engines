import { describe, test } from "vite-plus/test";
import { op11GearTwo080 } from "../../../../../cards/src/cards/OP11/events/080-gear-two.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-080 Gear Two", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11GearTwo080);
  });
});
