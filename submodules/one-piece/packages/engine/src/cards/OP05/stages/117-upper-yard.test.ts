import { describe, test } from "vite-plus/test";
import { op05UpperYard117 } from "../../../../../cards/src/cards/OP05/stages/117-upper-yard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-117 Upper Yard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05UpperYard117);
  });
});
