import { describe, test } from "vite-plus/test";
import { op09Shiryu088 } from "../../../../../cards/src/cards/OP09/characters/088-shiryu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-088 Shiryu", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Shiryu088);
  });
});
