import { describe, test } from "vite-plus/test";
import { op05Rebecca091 } from "../../../../../cards/src/cards/characters/op05-091-rebecca.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-091 Rebecca", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Rebecca091);
  });
});
