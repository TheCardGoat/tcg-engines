import { describe, test } from "vite-plus/test";
import { op07Egghead117 } from "../../../../../cards/src/cards/stages/op07-117-egghead.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-117 Egghead", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Egghead117);
  });
});
