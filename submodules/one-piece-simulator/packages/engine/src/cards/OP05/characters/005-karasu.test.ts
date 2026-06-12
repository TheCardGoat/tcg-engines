import { describe, test } from "vite-plus/test";
import { op05Karasu005 } from "../../../../../cards/src/cards/OP05/characters/005-karasu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-005 Karasu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Karasu005);
  });
});
