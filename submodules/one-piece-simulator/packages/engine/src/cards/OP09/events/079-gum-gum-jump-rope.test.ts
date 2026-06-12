import { describe, test } from "vite-plus/test";
import { op09GumGumJumpRope079 } from "../../../../../cards/src/cards/OP09/events/079-gum-gum-jump-rope.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-079 Gum-Gum Jump Rope", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09GumGumJumpRope079);
  });
});
