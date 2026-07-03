import { describe, test } from "vite-plus/test";
import { op14eb04CrocodileOp14120120 } from "../../../../../cards/src/cards/OP14EB04/characters/120-crocodile-op14-120.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-120 Crocodile - OP14-120", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04CrocodileOp14120120);
  });
});
