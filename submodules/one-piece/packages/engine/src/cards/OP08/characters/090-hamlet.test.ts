import { describe, test } from "vite-plus/test";
import { op08Hamlet090 } from "../../../../../cards/src/cards/OP08/characters/090-hamlet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-090 Hamlet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Hamlet090);
  });
});
