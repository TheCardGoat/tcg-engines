import { describe, test } from "vite-plus/test";
import { op07Stussy085 } from "../../../../../cards/src/cards/characters/op07-085-stussy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-085 Stussy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Stussy085);
  });
});
