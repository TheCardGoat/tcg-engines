import { describe, test } from "vite-plus/test";
import { op06VinsmokeJudge062 } from "../../../../../cards/src/cards/OP06/characters/062-vinsmoke-judge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-062 Vinsmoke Judge", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06VinsmokeJudge062);
  });
});
