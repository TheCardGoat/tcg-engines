import { describe, test } from "vite-plus/test";
import { op07Pickles069 } from "../../../../../cards/src/cards/OP07/characters/069-pickles.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-069 Pickles", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Pickles069);
  });
});
