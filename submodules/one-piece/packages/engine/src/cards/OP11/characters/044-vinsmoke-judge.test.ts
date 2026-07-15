import { describe, test } from "vite-plus/test";
import { op11VinsmokeJudge044 } from "../../../../../cards/src/cards/OP11/characters/044-vinsmoke-judge.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-044 Vinsmoke Judge", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11VinsmokeJudge044);
  });
});
