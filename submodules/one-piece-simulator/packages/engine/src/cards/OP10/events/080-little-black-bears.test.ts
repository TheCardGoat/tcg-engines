import { describe, test } from "vite-plus/test";
import { op10LittleBlackBears080 } from "../../../../../cards/src/cards/OP10/events/080-little-black-bears.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-080 Little Black Bears", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10LittleBlackBears080);
  });
});
