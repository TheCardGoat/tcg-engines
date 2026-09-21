import { describe, test } from "vite-plus/test";
import { op08Kingdew044 } from "../../../../../cards/src/cards/characters/op08-044-kingdew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-044 Kingdew", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Kingdew044);
  });
});
