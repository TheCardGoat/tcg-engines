import { describe, test } from "vite-plus/test";
import { op05Monet036 } from "../../../../../cards/src/cards/characters/op05-036-monet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-036 Monet", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Monet036);
  });
});
