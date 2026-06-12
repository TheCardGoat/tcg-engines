import { describe, test } from "vite-plus/test";
import { op03Striker020 } from "../../../../../cards/src/cards/OP03/stages/020-striker.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-020 Striker", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Striker020);
  });
});
