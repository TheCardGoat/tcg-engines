import { describe, test } from "vite-plus/test";
import { op10Marco055 } from "../../../../../cards/src/cards/OP10/characters/055-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-055 Marco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Marco055);
  });
});
