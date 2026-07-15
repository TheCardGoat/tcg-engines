import { describe, test } from "vite-plus/test";
import { op02Kingdew006 } from "../../../../../cards/src/cards/OP02/characters/006-kingdew.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-006 Kingdew", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Kingdew006);
  });
});
