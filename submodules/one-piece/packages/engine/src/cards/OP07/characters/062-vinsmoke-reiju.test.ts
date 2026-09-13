import { describe, test } from "vite-plus/test";
import { op07VinsmokeReiju062 } from "../../../../../cards/src/cards/OP07/characters/062-vinsmoke-reiju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-062 Vinsmoke Reiju", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07VinsmokeReiju062);
  });
});
