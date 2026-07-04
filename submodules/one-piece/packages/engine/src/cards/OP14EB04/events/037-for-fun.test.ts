import { describe, test } from "vite-plus/test";
import { op14eb04ForFun037 } from "../../../../../cards/src/cards/OP14EB04/events/037-for-fun.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-037 For Fun", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04ForFun037);
  });
});
