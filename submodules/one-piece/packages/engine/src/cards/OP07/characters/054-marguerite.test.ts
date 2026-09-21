import { describe, test } from "vite-plus/test";
import { op07Marguerite054 } from "../../../../../cards/src/cards/characters/op07-054-marguerite.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-054 Marguerite", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Marguerite054);
  });
});
