import { describe, test } from "vite-plus/test";
import { op14eb04BrickBat117 } from "../../../../../cards/src/cards/OP14EB04/events/117-brick-bat.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-117 Brick Bat", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04BrickBat117);
  });
});
