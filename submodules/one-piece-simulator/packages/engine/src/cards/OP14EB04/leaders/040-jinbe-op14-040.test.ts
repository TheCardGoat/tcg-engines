import { describe, test } from "vite-plus/test";
import { op14eb04JinbeOp14040040 } from "../../../../../cards/src/cards/OP14EB04/leaders/040-jinbe-op14-040.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-040 Jinbe - OP14-040", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04JinbeOp14040040);
  });
});
