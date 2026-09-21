import { describe, test } from "vite-plus/test";
import { op04Sugar024 } from "../../../../../cards/src/cards/characters/op04-024-sugar.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-024 Sugar", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Sugar024);
  });
});
