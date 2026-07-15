import { describe, test } from "vite-plus/test";
import { prb02ShanksSp007 } from "../../../../../cards/src/cards/PRB02/characters/007-shanks-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-007 Shanks (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02ShanksSp007);
  });
});
