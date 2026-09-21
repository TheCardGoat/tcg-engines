import { describe, test } from "vite-plus/test";
import { op05Chaka008 } from "../../../../../cards/src/cards/characters/op05-008-chaka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-008 Chaka", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Chaka008);
  });
});
