import { describe, test } from "vite-plus/test";
import { op13EmporioIvankov008 } from "../../../../../cards/src/cards/OP13/characters/008-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-008 Emporio.Ivankov", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13EmporioIvankov008);
  });
});
