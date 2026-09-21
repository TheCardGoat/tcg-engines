import { describe, test } from "vite-plus/test";
import { op08Jinbe085 } from "../../../../../cards/src/cards/characters/op08-085-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-085 Jinbe", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Jinbe085);
  });
});
