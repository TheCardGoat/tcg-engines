import { describe, test } from "vite-plus/test";
import { eb01Shirahoshi057 } from "../../../../../cards/src/cards/characters/eb01-057-shirahoshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-057 Shirahoshi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Shirahoshi057);
  });
});
