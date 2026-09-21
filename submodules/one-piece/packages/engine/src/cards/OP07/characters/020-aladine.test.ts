import { describe, test } from "vite-plus/test";
import { op07Aladine020 } from "../../../../../cards/src/cards/characters/op07-020-aladine.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-020 Aladine", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Aladine020);
  });
});
