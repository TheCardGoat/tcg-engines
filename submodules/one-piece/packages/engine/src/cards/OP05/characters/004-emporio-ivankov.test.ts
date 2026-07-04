import { describe, test } from "vite-plus/test";
import { op05EmporioIvankov004 } from "../../../../../cards/src/cards/OP05/characters/004-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-004 Emporio.Ivankov", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05EmporioIvankov004);
  });
});
