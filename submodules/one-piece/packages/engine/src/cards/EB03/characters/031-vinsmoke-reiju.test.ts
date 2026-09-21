import { describe, test } from "vite-plus/test";
import { eb03VinsmokeReiju031 } from "../../../../../cards/src/cards/characters/eb03-031-vinsmoke-reiju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-031 Vinsmoke Reiju", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03VinsmokeReiju031);
  });
});
