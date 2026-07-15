import { describe, test } from "vite-plus/test";
import { op12EmporioIvankov065 } from "../../../../../cards/src/cards/OP12/characters/065-emporio-ivankov.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-065 Emporio.Ivankov", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12EmporioIvankov065);
  });
});
