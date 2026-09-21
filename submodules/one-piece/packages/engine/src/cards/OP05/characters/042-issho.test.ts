import { describe, test } from "vite-plus/test";
import { op05Issho042 } from "../../../../../cards/src/cards/characters/op05-042-issho.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-042 Issho", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Issho042);
  });
});
