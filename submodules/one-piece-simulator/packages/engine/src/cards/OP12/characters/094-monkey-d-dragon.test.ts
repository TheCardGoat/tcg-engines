import { describe, test } from "vite-plus/test";
import { op12MonkeyDDragon094 } from "../../../../../cards/src/cards/OP12/characters/094-monkey-d-dragon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-094 Monkey.D.Dragon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12MonkeyDDragon094);
  });
});
