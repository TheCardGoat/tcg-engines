import { describe, test } from "vite-plus/test";
import { op08Hamlet090 } from "../../../../../cards/src/cards/characters/op08-090-hamlet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-090 Hamlet", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Hamlet090);
  });
});
