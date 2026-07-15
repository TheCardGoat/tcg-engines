import { describe, test } from "vite-plus/test";
import { op11ShanksSp004 } from "../../../../../cards/src/cards/OP11/characters/004-shanks-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST16-004 Shanks (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11ShanksSp004);
  });
});
