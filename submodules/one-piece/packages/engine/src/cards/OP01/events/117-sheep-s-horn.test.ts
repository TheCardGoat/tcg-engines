import { describe, test } from "vite-plus/test";
import { op01SheepSHorn117 } from "../../../../../cards/src/cards/events/op01-117-sheep-s-horn.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-117 Sheep's Horn", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01SheepSHorn117);
  });
});
