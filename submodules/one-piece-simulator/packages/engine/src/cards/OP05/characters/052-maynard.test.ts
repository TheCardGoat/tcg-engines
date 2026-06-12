import { describe, test } from "vite-plus/test";
import { op05Maynard052 } from "../../../../../cards/src/cards/OP05/characters/052-maynard.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-052 Maynard", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Maynard052);
  });
});
