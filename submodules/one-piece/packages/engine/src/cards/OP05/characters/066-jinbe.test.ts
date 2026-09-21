import { describe, test } from "vite-plus/test";
import { op05Jinbe066 } from "../../../../../cards/src/cards/characters/op05-066-jinbe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-066 Jinbe", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Jinbe066);
  });
});
