import { describe, test } from "vite-plus/test";
import { op05HauteCouturePatchWork094 } from "../../../../../cards/src/cards/events/op05-094-haute-couture-patch-work.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-094 Haute Couture Patch Work", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05HauteCouturePatchWork094);
  });
});
