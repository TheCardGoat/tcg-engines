import { describe, test } from "vite-plus/test";
import { op04Viola021 } from "../../../../../cards/src/cards/characters/op04-021-viola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-021 Viola", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Viola021);
  });
});
