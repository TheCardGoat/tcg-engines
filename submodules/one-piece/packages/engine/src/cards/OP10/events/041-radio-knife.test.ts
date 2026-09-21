import { describe, test } from "vite-plus/test";
import { op10RadioKnife041 } from "../../../../../cards/src/cards/events/op10-041-radio-knife.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-041 Radio Knife", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10RadioKnife041);
  });
});
