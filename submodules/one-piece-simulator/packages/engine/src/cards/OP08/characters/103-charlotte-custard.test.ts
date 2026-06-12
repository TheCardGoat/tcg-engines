import { describe, test } from "vite-plus/test";
import { op08CharlotteCustard103 } from "../../../../../cards/src/cards/OP08/characters/103-charlotte-custard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-103 Charlotte Custard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlotteCustard103);
  });
});
