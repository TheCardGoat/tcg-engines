import { describe, test } from "vite-plus/test";
import { op06Saga006 } from "../../../../../cards/src/cards/OP06/characters/006-saga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-006 Saga", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Saga006);
  });
});
