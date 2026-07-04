import { describe, test } from "vite-plus/test";
import { op05GammaKnife077 } from "../../../../../cards/src/cards/OP05/events/077-gamma-knife.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-077 Gamma Knife", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05GammaKnife077);
  });
});
