import { describe, test } from "vite-plus/test";
import { op05UpperYard117 } from "../../../../../cards/src/cards/stages/op05-117-upper-yard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-117 Upper Yard", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05UpperYard117);
  });
});
