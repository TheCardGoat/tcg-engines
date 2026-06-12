import { describe, test } from "vite-plus/test";
import { op07GalaxyWink016 } from "../../../../../cards/src/cards/OP07/events/016-galaxy-wink.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-016 Galaxy Wink", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07GalaxyWink016);
  });
});
