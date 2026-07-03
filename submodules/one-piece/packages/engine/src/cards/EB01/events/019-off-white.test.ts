import { describe, test } from "vite-plus/test";
import { eb01OffWhite019 } from "../../../../../cards/src/cards/EB01/events/019-off-white.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-019 Off-White", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01OffWhite019);
  });
});
