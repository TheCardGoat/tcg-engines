import { describe, test } from "vite-plus/test";
import { op09CharlottePudding087 } from "../../../../../cards/src/cards/OP09/characters/087-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-087 Charlotte Pudding", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09CharlottePudding087);
  });
});
