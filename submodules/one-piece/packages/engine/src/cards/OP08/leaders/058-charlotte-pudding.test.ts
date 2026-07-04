import { describe, test } from "vite-plus/test";
import { op08CharlottePudding058 } from "../../../../../cards/src/cards/OP08/leaders/058-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-058 Charlotte Pudding", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlottePudding058);
  });
});
