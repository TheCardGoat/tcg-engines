import { describe, test } from "vite-plus/test";
import { op06VinsmokeJudge062 } from "../../../../../cards/src/cards/characters/op06-062-vinsmoke-judge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-062 Vinsmoke Judge", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeJudge062);
  });
});
