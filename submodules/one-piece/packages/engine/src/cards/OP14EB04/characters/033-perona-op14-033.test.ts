import { describe, test } from "vite-plus/test";
import { op14eb04PeronaOp14033033 } from "../../../../../cards/src/cards/OP14EB04/characters/033-perona-op14-033.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-033 Perona - OP14-033", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04PeronaOp14033033);
  });
});
