import { describe, test } from "vite-plus/test";
import { eb01Brook046 } from "../../../../../cards/src/cards/characters/eb01-046-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-046 Brook", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Brook046);
  });
});
