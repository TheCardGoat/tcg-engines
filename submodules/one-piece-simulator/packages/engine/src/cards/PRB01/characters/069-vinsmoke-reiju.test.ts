import { describe, test } from "vite-plus/test";
import { prb01VinsmokeReiju069 } from "../../../../../cards/src/cards/PRB01/characters/069-vinsmoke-reiju.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-069 Vinsmoke Reiju", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01VinsmokeReiju069);
  });
});
