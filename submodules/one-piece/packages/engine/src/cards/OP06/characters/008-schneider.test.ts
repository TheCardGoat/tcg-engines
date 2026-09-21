import { describe, test } from "vite-plus/test";
import { op06Schneider008 } from "../../../../../cards/src/cards/characters/op06-008-schneider.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-008 Schneider", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Schneider008);
  });
});
