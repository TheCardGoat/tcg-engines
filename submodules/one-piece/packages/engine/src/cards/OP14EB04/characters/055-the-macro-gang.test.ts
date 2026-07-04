import { describe, test } from "vite-plus/test";
import { op14eb04TheMacroGang055 } from "../../../../../cards/src/cards/OP14EB04/characters/055-the-macro-gang.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-055 The Macro Gang", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04TheMacroGang055);
  });
});
