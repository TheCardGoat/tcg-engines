import { describe, test } from "vite-plus/test";
import { eb03CharlottePudding035 } from "../../../../../cards/src/cards/characters/eb03-035-charlotte-pudding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-035 Charlotte Pudding", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03CharlottePudding035);
  });
});
