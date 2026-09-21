import { describe, test } from "vite-plus/test";
import { op07Jinbe102 } from "../../../../../cards/src/cards/characters/op07-102-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-102 Jinbe", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Jinbe102);
  });
});
