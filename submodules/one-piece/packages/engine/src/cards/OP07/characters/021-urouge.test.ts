import { describe, test } from "vite-plus/test";
import { op07Urouge021 } from "../../../../../cards/src/cards/characters/op07-021-urouge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-021 Urouge", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Urouge021);
  });
});
