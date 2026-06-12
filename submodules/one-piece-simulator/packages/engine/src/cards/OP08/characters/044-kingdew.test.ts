import { describe, test } from "vite-plus/test";
import { op08Kingdew044 } from "../../../../../cards/src/cards/OP08/characters/044-kingdew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-044 Kingdew", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Kingdew044);
  });
});
