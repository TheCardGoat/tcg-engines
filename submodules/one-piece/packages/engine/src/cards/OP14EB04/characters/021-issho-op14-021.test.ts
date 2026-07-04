import { describe, test } from "vite-plus/test";
import { op14eb04IsshoOp14021021 } from "../../../../../cards/src/cards/OP14EB04/characters/021-issho-op14-021.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-021 Issho - OP14-021", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04IsshoOp14021021);
  });
});
