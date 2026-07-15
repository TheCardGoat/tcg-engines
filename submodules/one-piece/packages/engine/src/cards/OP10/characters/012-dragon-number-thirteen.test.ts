import { describe, test } from "vite-plus/test";
import { op10DragonNumberThirteen012 } from "../../../../../cards/src/cards/OP10/characters/012-dragon-number-thirteen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-012 Dragon Number Thirteen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10DragonNumberThirteen012);
  });
});
