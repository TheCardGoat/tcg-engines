import { describe, test } from "vite-plus/test";
import { op07Sterry006 } from "../../../../../cards/src/cards/OP07/characters/006-sterry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-006 Sterry", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Sterry006);
  });
});
