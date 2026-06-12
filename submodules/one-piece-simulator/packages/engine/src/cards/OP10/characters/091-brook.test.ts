import { describe, test } from "vite-plus/test";
import { op10Brook091 } from "../../../../../cards/src/cards/OP10/characters/091-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-091 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Brook091);
  });
});
