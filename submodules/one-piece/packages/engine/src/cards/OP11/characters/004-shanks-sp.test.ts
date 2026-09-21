import { describe, test } from "vite-plus/test";
import { op11ShanksSp004 } from "../../../../../cards/src/cards/characters/st16-004-shanks-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST16-004 Shanks (SP)", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11ShanksSp004);
  });
});
