import { describe, test } from "vite-plus/test";
import { eb01Viola052 } from "../../../../../cards/src/cards/characters/eb01-052-viola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-052 Viola", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Viola052);
  });
});
