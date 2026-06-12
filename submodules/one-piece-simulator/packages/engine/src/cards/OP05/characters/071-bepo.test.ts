import { describe, test } from "vite-plus/test";
import { op05Bepo071 } from "../../../../../cards/src/cards/OP05/characters/071-bepo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-071 Bepo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Bepo071);
  });
});
