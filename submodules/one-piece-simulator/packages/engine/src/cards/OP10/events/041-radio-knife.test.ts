import { describe, test } from "vite-plus/test";
import { op10RadioKnife041 } from "../../../../../cards/src/cards/OP10/events/041-radio-knife.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-041 Radio Knife", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10RadioKnife041);
  });
});
