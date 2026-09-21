import { describe, test } from "vite-plus/test";
import { eb01Brook045 } from "../../../../../cards/src/cards/characters/eb01-045-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-045 Brook", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Brook045);
  });
});
