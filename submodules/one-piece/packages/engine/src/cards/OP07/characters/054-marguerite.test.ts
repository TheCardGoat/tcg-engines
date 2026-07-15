import { describe, test } from "vite-plus/test";
import { op07Marguerite054 } from "../../../../../cards/src/cards/OP07/characters/054-marguerite.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-054 Marguerite", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Marguerite054);
  });
});
