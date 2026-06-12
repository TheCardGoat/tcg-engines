import { describe, test } from "vite-plus/test";
import { eb01Viola052 } from "../../../../../cards/src/cards/EB01/characters/052-viola.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-052 Viola", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Viola052);
  });
});
