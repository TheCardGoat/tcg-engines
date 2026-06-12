import { describe, test } from "vite-plus/test";
import { op05Chaka008 } from "../../../../../cards/src/cards/OP05/characters/008-chaka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-008 Chaka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Chaka008);
  });
});
