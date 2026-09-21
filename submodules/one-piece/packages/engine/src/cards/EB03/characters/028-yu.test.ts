import { describe, test } from "vite-plus/test";
import { eb03Yu028 } from "../../../../../cards/src/cards/characters/eb03-028-yu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-028 Yu", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03Yu028);
  });
});
