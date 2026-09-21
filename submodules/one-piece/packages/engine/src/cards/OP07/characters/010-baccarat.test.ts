import { describe, test } from "vite-plus/test";
import { op07Baccarat010 } from "../../../../../cards/src/cards/characters/op07-010-baccarat.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-010 Baccarat", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Baccarat010);
  });
});
