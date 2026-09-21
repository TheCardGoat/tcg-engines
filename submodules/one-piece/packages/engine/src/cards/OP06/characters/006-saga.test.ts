import { describe, test } from "vite-plus/test";
import { op06Saga006 } from "../../../../../cards/src/cards/characters/op06-006-saga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-006 Saga", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Saga006);
  });
});
