import { describe, test } from "vite-plus/test";
import { op10EmporioIvankov102 } from "../../../../../cards/src/cards/OP10/characters/102-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-102 Emporio.Ivankov", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10EmporioIvankov102);
  });
});
