import { describe, test } from "vite-plus/test";
import { op03CharlottePudding112 } from "../../../../../cards/src/cards/characters/op03-112-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-112 Charlotte Pudding", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlottePudding112);
  });
});
