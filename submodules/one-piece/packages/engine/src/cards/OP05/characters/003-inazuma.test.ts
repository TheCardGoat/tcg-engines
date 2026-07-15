import { describe, test } from "vite-plus/test";
import { op05Inazuma003 } from "../../../../../cards/src/cards/OP05/characters/003-inazuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-003 Inazuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Inazuma003);
  });
});
